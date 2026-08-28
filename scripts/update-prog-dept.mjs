import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const itds = await prisma.department.findUnique({
  where: { slug: 'information-technology-and-decision-sciences' },
});

await prisma.programme.update({
  where: { slug: 'bsc-information-technology' },
  data: { departmentId: itds.id },
});

console.log('BSc IT moved to IT & Decision Sciences.');
await prisma.$disconnect();
