import { PrismaClient } from '@prisma/client'
const p = new PrismaClient()

async function main() {
  // 1. Set school for all SoS departments
  const sosDeptNames = [
    'Department of Basic and Applied Biology',
    'Department of Chemical Sciences',
    'Department of Computer Science',
    'Department of Information Technology and Decision Sciences',
    'Department of Mathematics and Statistics',
  ]

  for (const name of sosDeptNames) {
    const dept = await p.department.findFirst({ where: { name } })
    if (dept) {
      await p.department.update({ where: { id: dept.id }, data: { school: 'School of Sciences' } })
      console.log(`Set school for: ${name}`)
    }
  }

  // 2. Rename "Department of Computer Science" to "Department of Computer Science and Informatics"
  const csDept = await p.department.findFirst({ where: { name: 'Department of Computer Science' } })
  if (csDept) {
    await p.department.update({ where: { id: csDept.id }, data: { name: 'Department of Computer Science and Informatics' } })
    console.log('Renamed: Department of Computer Science -> Department of Computer Science and Informatics')
  }

  // 3. Fix BSc Biological Sciences - find correct dept
  const bioDept = await p.department.findFirst({ where: { name: 'Department of Basic and Applied Biology' } })
  const bioProg = await p.programme.findFirst({ where: { slug: 'bsc-biological-sciences' } })
  if (bioDept && bioProg) {
    await p.programme.update({ where: { id: bioProg.id }, data: { departmentId: bioDept.id } })
    console.log('Assigned BSc Biological Sciences to Basic and Applied Biology')
  }

  // 4. Delete any remaining unwanted departments
  const unwantedDepts = await p.department.findMany({ where: { school: null } })
  for (const d of unwantedDepts) {
    const progCount = await p.programme.count({ where: { departmentId: d.id } })
    if (progCount === 0) {
      await p.department.delete({ where: { id: d.id } })
      console.log(`Deleted orphan dept: ${d.name}`)
    } else {
      console.log(`Cannot delete ${d.name} - has ${progCount} programmes`)
    }
  }

  // 5. Show final state
  console.log('\n=== Final SoS departments ===')
  const final = await p.department.findMany({ where: { school: 'School of Sciences' }, select: { name: true, programmes: { select: { name: true } } }, orderBy: { name: 'asc' } })
  final.forEach(d => {
    console.log(d.name)
    d.programmes.forEach(x => console.log('  -', x.name))
  })

  await p.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
