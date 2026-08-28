import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

await prisma.department.update({
  where: { slug: 'computer-science-and-informatics' },
  data: { name: 'Department of Computer Science', shortName: 'Computer Science' }
});

await prisma.department.create({
  data: {
    slug: 'information-technology-and-decision-sciences',
    name: 'Department of Information Technology and Decision Sciences',
    shortName: 'IT & Decision Sciences',
    ordering: 3,
    summary: 'Applications of technology to information management, networks, and business decision systems.',
    description: 'Focusing on information technology infrastructure, decision support systems, data analytics, and the application of technology in organisational contexts.'
  }
});

console.log('Departments updated.');
await prisma.$disconnect();
