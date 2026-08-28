import { execSync } from 'node:child_process'

try {
  execSync('npx prisma db push --skip-generate', { stdio: 'inherit' })
} catch (err) {
  console.error('DB push failed:', err.message)
  process.exit(1)
}
