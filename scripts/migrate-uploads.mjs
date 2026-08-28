/**
 * Migrate existing local uploads from public/uploads/ to Cloudinary,
 * update all database references, and remove local files.
 *
 * Usage: node scripts/migrate-uploads.mjs
 */

import { v2 as cloudinary } from 'cloudinary'
import { PrismaClient } from '@prisma/client'
import { readFile, unlink, readdir } from 'fs/promises'
import { join } from 'path'

// Load env
import { config } from 'dotenv'
config({ path: '.env' })

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const prisma = new PrismaClient()

const UPLOADS_DIR = join(process.cwd(), 'public', 'uploads')

// Maps local URL prefix -> Cloudinary folder
function getCloudinaryFolder(localPath) {
  if (localPath.startsWith('/uploads/spms-')) return 'spms-documents'
  return 'site-uploads'
}

function getCloudinaryResourceType(localPath) {
  if (localPath.endsWith('.pdf')) return 'raw'
  return 'image'
}

async function uploadToCloudinary(buffer, localPath) {
  const folder = getCloudinaryFolder(localPath)
  const resourceType = getCloudinaryResourceType(localPath)
  const ext = localPath.split('.').pop()

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        format: ext,
        access_mode: 'public',
      },
      (error, result) => {
        if (error) return reject(error)
        resolve(result.secure_url)
      },
    ).end(buffer)
  })
}

// Tables and columns that may contain /uploads/ URLs
const TABLES = [
  { table: 'posts', column: 'coverImage' },
  { table: 'staff', column: 'photoUrl' },
  { table: 'departments', column: 'imageUrl' },
  { table: 'programmes', column: 'imageUrl' },
  { table: 'projects', column: 'documentUrl' },
]

async function main() {
  console.log('🔍 Scanning database for /uploads/ references...\n')

  const urlMap = new Map() // localPath -> cloudinaryUrl

  // Find all records with /uploads/ URLs
  for (const { table, column } of TABLES) {
    try {
      const rows = await prisma.$queryRawUnsafe(
        `SELECT id, "${column}" as url FROM "${table}" WHERE "${column}" LIKE '/uploads/%'`
      )
      for (const row of rows) {
        if (row.url && !urlMap.has(row.url)) {
          urlMap.set(row.url, null) // null = not yet uploaded
        }
      }
      if (rows.length > 0) {
        console.log(`  📋 ${table}.${column}: ${rows.length} reference(s)`)
      }
    } catch {
      // Column may not exist in this table
    }
  }

  if (urlMap.size === 0) {
    console.log('✅ No local uploads found in the database. Nothing to migrate.')
    return
  }

  console.log(`\n📤 Uploading ${urlMap.size} unique file(s) to Cloudinary...\n`)

  // Upload each unique file
  for (const localPath of urlMap.keys()) {
    const filename = localPath.replace('/uploads/', '')
    const localFile = join(UPLOADS_DIR, filename)

    try {
      const buffer = await readFile(localFile)
      const cloudinaryUrl = await uploadToCloudinary(buffer, localPath)
      urlMap.set(localPath, cloudinaryUrl)
      console.log(`  ✅ ${filename} → ${cloudinaryUrl}`)
    } catch (err) {
      console.error(`  ❌ ${filename} — ${err.message}`)
    }
  }

  // Update database records
  console.log('\n💾 Updating database references...\n')

  let totalUpdated = 0

  for (const { table, column } of TABLES) {
    try {
      const rows = await prisma.$queryRawUnsafe(
        `SELECT id, "${column}" as url FROM "${table}" WHERE "${column}" LIKE '/uploads/%'`
      )

      for (const row of rows) {
        const newUrl = urlMap.get(row.url)
        if (!newUrl) {
          console.log(`  ⚠️  Skipped ${table}/${row.id} — upload failed`)
          continue
        }

        await prisma.$executeRawUnsafe(
          `UPDATE "${table}" SET "${column}" = $1 WHERE id = $2`,
          newUrl,
          row.id,
        )
        totalUpdated++
      }
    } catch {
      // Column may not exist in this table
    }
  }

  console.log(`  ✅ Updated ${totalUpdated} database record(s)`)

  // Remove local files
  console.log('\n🗑️  Cleaning up local files...\n')

  let removed = 0
  for (const localPath of urlMap.keys()) {
    const filename = localPath.replace('/uploads/', '')
    const localFile = join(UPLOADS_DIR, filename)

    try {
      await unlink(localFile)
      removed++
      console.log(`  🗑️  ${filename}`)
    } catch {
      // File may already be gone
    }
  }

  console.log(`\n🎉 Migration complete!`)
  console.log(`   - ${urlMap.size} files uploaded to Cloudinary`)
  console.log(`   - ${totalUpdated} database records updated`)
  console.log(`   - ${removed} local files removed`)
}

main()
  .catch((err) => {
    console.error('Migration failed:', err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
