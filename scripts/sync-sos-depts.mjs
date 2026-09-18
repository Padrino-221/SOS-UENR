import { PrismaClient } from '@prisma/client'
const p = new PrismaClient()

function rule(level, cores, { coreAlternative = null, minGrade = 'C6', electiveCount = 3, electiveGroups = [], requiresExam = false, aggregateCutOff = null, note = null } = {}) {
  return { level, cores, coreAlternative, minGrade, electiveCount, electiveGroups, requiresExam, aggregateCutOff, note }
}

const SCHOOL = 'School of Sciences'

const departments = [
  {
    slug: 'basic-and-applied-biology',
    name: 'Department of Basic and Applied Biology',
    shortName: 'Biological Science',
    ordering: 1,
  },
  {
    slug: 'chemical-sciences',
    name: 'Department of Chemical Sciences',
    shortName: 'Chem. Sciences',
    ordering: 2,
  },
  {
    slug: 'computer-science-and-informatics',
    name: 'Department of Computer Science and Informatics',
    shortName: 'Computer Science',
    ordering: 3,
  },
  {
    slug: 'information-technology-and-decision-sciences',
    name: 'Department of Information Technology and Decision Sciences',
    shortName: 'IT & Decision Sciences',
    ordering: 4,
  },
  {
    slug: 'mathematics-and-statistics',
    name: 'Department of Mathematics and Statistics',
    shortName: 'Maths & Statistics',
    ordering: 5,
  },
  {
    slug: 'medical-laboratory-science',
    name: 'Department of Medical Laboratory Science',
    shortName: 'Medical Lab Science',
    summary: 'Clinical diagnostics, biomedical science, and laboratory practice for healthcare delivery.',
    description:
      'The Department of Medical Laboratory Science trains biomedical scientists to perform clinical diagnostics, analyse specimens, and support disease prevention, diagnosis, and treatment across Ghana\u2019s health system.',
    ordering: 6,
  },
  {
    slug: 'nursing',
    name: 'Department of Nursing',
    shortName: 'Nursing',
    summary: 'Professional nursing education for registered practice, patient care, and community health.',
    description:
      'The Department of Nursing prepares compassionate, competent nurses for registered practice, equipping students with the clinical skills, ethical grounding, and public-health awareness needed to serve communities across Ghana and beyond.',
    ordering: 7,
  },
]

const programmes = [
  // 1. Basic and Applied Biology
  {
    slug: 'bsc-biological-science',
    deptSlug: 'basic-and-applied-biology',
    name: 'BSc Biological Sciences',
    level: 'DEGREE',
    mode: 'Regular',
    ordering: 1,
  },
  {
    slug: 'mphil-environmental-science',
    deptSlug: 'basic-and-applied-biology',
    name: 'MPhil Environmental Science',
    level: 'POSTGRADUATE',
    mode: 'Regular',
    ordering: 2,
    summary: 'Advanced research training in environmental science, ecology, and sustainable resource management.',
    overview:
      'The MPhil Environmental Science programme develops researchers and practitioners equipped to understand, monitor, and manage environmental systems. It combines coursework in environmental chemistry, ecology, and resource management with an independent research thesis.',
    requirements: 'A good Bachelor\u2019s degree (Second Class Lower or better) in a relevant science or environmental discipline.',
    rule: rule('POSTGRADUATE', [], { electiveCount: 0, note: 'Postgraduate: a relevant Bachelor\u2019s degree with Second Class Lower or better required.' }),
  },

  // 2. Chemical Sciences
  {
    slug: 'bsc-chemistry',
    deptSlug: 'chemical-sciences',
    name: 'BSc Chemistry',
    level: 'DEGREE',
    mode: 'Regular',
    ordering: 1,
  },
  {
    slug: 'bsc-biochemistry',
    deptSlug: 'chemical-sciences',
    name: 'BSc Biochemistry',
    level: 'DEGREE',
    mode: 'Regular',
    ordering: 2,
    summary: 'Study the chemistry of living systems, from molecular biology to metabolic processes.',
    overview:
      'BSc Biochemistry explores the molecular foundations of life. Students study proteins, enzymes, metabolism, genetics, and molecular biology, with laboratory training that prepares them for careers in health, research, biotechnology, and industry.',
    requirements: 'Credit passes in core English, Mathematics and Integrated Science plus Chemistry, Biology and Physics/Elective Mathematics.',
    rule: rule('DEGREE', ['English Language', 'Mathematics', 'Integrated Science'], {
      electiveGroups: [
        { any: 1, from: ['Chemistry'], label: 'Chemistry' },
        { any: 1, from: ['Biology'], label: 'Biology' },
        { any: 1, from: ['Physics', 'Applied Electricity', 'Elective Mathematics', 'General Agriculture', 'Forestry'], label: 'Physics / Applied Electricity / Elective Mathematics / General Agriculture / Forestry' },
      ],
      electiveCount: 3,
    }),
  },
  {
    slug: 'bsc-engineering-physics',
    deptSlug: 'chemical-sciences',
    name: 'BSc Engineering Physics',
    level: 'DEGREE',
    mode: 'Regular',
    ordering: 3,
    summary: 'Apply physics principles to engineering problems, instrumentation, and applied technology.',
    overview:
      'BSc Engineering Physics bridges fundamental physics and applied engineering. Students gain strong grounding in mechanics, electricity and magnetism, electronics, and materials, preparing them for instrumentation, energy, and technology careers.',
    requirements: 'Credit passes in core English, Mathematics and Integrated Science plus Physics, Chemistry and Mathematics/Applied Electricity.',
    rule: rule('DEGREE', ['English Language', 'Mathematics', 'Integrated Science'], {
      electiveGroups: [
        { any: 1, from: ['Physics'], label: 'Physics' },
        { any: 1, from: ['Chemistry'], label: 'Chemistry' },
        { any: 1, from: ['Elective Mathematics', 'Applied Electricity'], label: 'Elective Mathematics or Applied Electricity' },
      ],
      electiveCount: 3,
    }),
  },
  {
    slug: 'mphil-chemistry',
    deptSlug: 'chemical-sciences',
    name: 'MPhil Chemistry',
    level: 'POSTGRADUATE',
    mode: 'Regular',
    ordering: 4,
    summary: 'Research-based master\u2019s training in analytical, organic, inorganic, and physical chemistry.',
    overview:
      'The MPhil Chemistry programme offers advanced coursework and independent research across analytical, organic, inorganic, and physical chemistry, preparing graduates for research, academia, and industry.',
    requirements: 'A good Bachelor\u2019s degree (Second Class Lower or better) in Chemistry or a related science discipline.',
    rule: rule('POSTGRADUATE', [], { electiveCount: 0, note: 'Postgraduate: a relevant Bachelor\u2019s degree with Second Class Lower or better required.' }),
  },

  // 3. Computer Science and Informatics
  {
    slug: 'diploma-computer-science',
    deptSlug: 'computer-science-and-informatics',
    name: 'Diploma Computer Science',
    level: 'DIPLOMA',
    mode: 'Regular',
    ordering: 1,
  },
  {
    slug: 'bsc-computer-science',
    deptSlug: 'computer-science-and-informatics',
    name: 'BSc Computer Science',
    level: 'DEGREE',
    mode: 'Regular',
    ordering: 2,
  },
  {
    slug: 'msc-computer-science',
    deptSlug: 'computer-science-and-informatics',
    name: 'MSc Computer Science',
    level: 'POSTGRADUATE',
    mode: 'Weekend',
    ordering: 3,
  },
  {
    slug: 'mphil-computer-science',
    deptSlug: 'computer-science-and-informatics',
    name: 'MPhil Computer Science',
    level: 'POSTGRADUATE',
    mode: 'Weekend',
    ordering: 4,
  },

  // 4. Information Technology and Decision Sciences
  {
    slug: 'diploma-information-technology',
    deptSlug: 'information-technology-and-decision-sciences',
    name: 'Diploma Information Technology',
    level: 'DIPLOMA',
    mode: 'Regular',
    ordering: 1,
    summary: 'Practical foundation in IT support, networking, programming, and information systems.',
    overview:
      'The Diploma Information Technology programme provides hands-on grounding in computer hardware and software, networking, web technologies, and information systems, preparing graduates for technical support and entry-level IT roles.',
    requirements: 'Credit passes in core English, Mathematics and Integrated Science/Social Studies plus two elective subjects.',
    rule: rule('DIPLOMA', ['English Language', 'Mathematics', 'Integrated Science'], {
      coreAlternative: 'Social Studies',
      electiveCount: 2,
      electiveGroups: [],
      note: 'Diploma: 5 subjects total (3 cores + 2 electives) at A1-C6.',
    }),
  },
  {
    slug: 'bsc-information-technology',
    deptSlug: 'information-technology-and-decision-sciences',
    name: 'BSc Information Technology',
    level: 'DEGREE',
    mode: 'Regular / Weekend',
    ordering: 2,
  },
  {
    slug: 'msc-information-technology',
    deptSlug: 'information-technology-and-decision-sciences',
    name: 'MSc Information Technology',
    level: 'POSTGRADUATE',
    mode: 'Weekend',
    ordering: 3,
    summary: 'Advanced study in IT systems, data management, networks, and digital transformation.',
    overview:
      'The MSc Information Technology programme deepens expertise in systems design, data management, cybersecurity, and emerging technologies, equipping professionals to lead digital initiatives.',
    requirements: 'A good Bachelor\u2019s degree (Second Class Lower or better) in IT, computing, or a related discipline.',
    rule: rule('POSTGRADUATE', [], { electiveCount: 0, note: 'Postgraduate: a relevant Bachelor\u2019s degree with Second Class Lower or better required.' }),
  },
  {
    slug: 'mphil-information-technology',
    deptSlug: 'information-technology-and-decision-sciences',
    name: 'MPhil Information Technology',
    level: 'POSTGRADUATE',
    mode: 'Weekend',
    ordering: 4,
    summary: 'Research master\u2019s in information technology with an independent thesis.',
    overview:
      'The MPhil Information Technology programme combines advanced coursework with supervised research, preparing graduates for academic, research, and senior professional roles in the IT field.',
    requirements: 'A good Bachelor\u2019s degree (Second Class Lower or better) in IT, computing, or a related discipline.',
    rule: rule('POSTGRADUATE', [], { electiveCount: 0, note: 'Postgraduate: a relevant Bachelor\u2019s degree with Second Class Lower or better required.' }),
  },
  {
    slug: 'phd-information-technology',
    deptSlug: 'information-technology-and-decision-sciences',
    name: 'PhD Information Technology',
    level: 'POSTGRADUATE',
    mode: 'Weekend',
    ordering: 5,
    summary: 'Doctoral research advancing knowledge and innovation in information technology.',
    overview:
      'The PhD Information Technology programme supports original, high-impact research across computing, data science, networks, and information systems, preparing candidates for academic and research leadership.',
    requirements: 'A relevant Master\u2019s degree with strong research background.',
    rule: rule('POSTGRADUATE', [], { electiveCount: 0, note: 'Doctoral: a relevant Master\u2019s degree required.' }),
  },

  // 5. Mathematics and Statistics
  {
    slug: 'diploma-statistics',
    deptSlug: 'mathematics-and-statistics',
    name: 'Diploma Statistics',
    level: 'DIPLOMA',
    mode: 'Regular / Weekend',
    ordering: 1,
  },
  {
    slug: 'bsc-mathematics',
    deptSlug: 'mathematics-and-statistics',
    name: 'BSc Mathematics',
    level: 'DEGREE',
    mode: 'Regular / Weekend',
    ordering: 2,
  },
  {
    slug: 'bsc-actuarial-science',
    deptSlug: 'mathematics-and-statistics',
    name: 'BSc Actuarial Science',
    level: 'DEGREE',
    mode: 'Regular / Weekend',
    ordering: 3,
  },

  // 6. Medical Laboratory Science
  {
    slug: 'bsc-medical-laboratory-science',
    deptSlug: 'medical-laboratory-science',
    name: 'BSc Medical Laboratory Science',
    level: 'DEGREE',
    mode: 'Regular',
    ordering: 1,
  },

  // 7. Nursing
  {
    slug: 'bsc-nursing',
    deptSlug: 'nursing',
    name: 'BSc Nursing',
    level: 'DEGREE',
    mode: 'Regular',
    ordering: 1,
  },
]

// Programmes that no longer exist in the SoS offering
const removeSlugs = ['bsc-statistics', 'mphil-applied-mathematics', 'phd-computer-science']

async function main() {
  const deptIdBySlug = {}

  // 1. Upsert departments
  for (const d of departments) {
    const dept = await p.department.upsert({
      where: { slug: d.slug },
      update: {
        name: d.name,
        shortName: d.shortName,
        school: SCHOOL,
        ordering: d.ordering,
        ...(d.summary ? { summary: d.summary } : {}),
        ...(d.description ? { description: d.description } : {}),
      },
      create: {
        slug: d.slug,
        name: d.name,
        shortName: d.shortName,
        school: SCHOOL,
        ordering: d.ordering,
        summary: d.summary ?? d.name,
        description: d.description ?? '',
      },
    })
    deptIdBySlug[d.slug] = dept.id
    console.log(`dept  ✓ ${dept.name}`)
  }

  // 2. Upsert programmes
  for (const pr of programmes) {
    const departmentId = deptIdBySlug[pr.deptSlug]
    const existing = await p.programme.findUnique({ where: { slug: pr.slug } })
    if (existing) {
      await p.programme.update({
        where: { slug: pr.slug },
        data: {
          name: pr.name,
          level: pr.level,
          mode: pr.mode,
          ordering: pr.ordering,
          departmentId,
          published: true,
        },
      })
      console.log(`prog  ↻ ${pr.name}`)
    } else {
      await p.programme.create({
        data: {
          slug: pr.slug,
          name: pr.name,
          level: pr.level,
          mode: pr.mode,
          ordering: pr.ordering,
          departmentId,
          published: true,
          summary: pr.summary ?? `${pr.name} programme at the School of Sciences, UENR.`,
          overview: pr.overview ?? '',
          requirements: pr.requirements ?? '',
          eligibilityRule: pr.rule ?? null,
        },
      })
      console.log(`prog  + ${pr.name}`)
    }
  }

  // 3. Remove programmes no longer offered
  for (const slug of removeSlugs) {
    const found = await p.programme.findUnique({ where: { slug } })
    if (found) {
      await p.programme.delete({ where: { slug } })
      console.log(`prog  ✕ removed ${slug}`)
    }
  }

  // 4. Backfill eligibility rules for existing programmes missing one
  for (const pr of programmes) {
    if (!pr.rule) continue
    const existing = await p.programme.findUnique({ where: { slug: pr.slug } })
    if (existing && !existing.eligibilityRule) {
      await p.programme.update({ where: { slug: pr.slug }, data: { eligibilityRule: pr.rule } })
      console.log(`rule  ✓ ${pr.slug}`)
    }
  }

  // 5. Report final state
  console.log('\n=== FINAL SoS DEPARTMENTS ===')
  const final = await p.department.findMany({
    where: { school: SCHOOL },
    orderBy: { ordering: 'asc' },
    include: { programmes: { orderBy: { ordering: 'asc' } } },
  })
  for (const d of final) {
    console.log(`\n${d.name}`)
    for (const pr of d.programmes) console.log(`   - ${pr.name} (${pr.level}, ${pr.mode ?? '-'})`)
  }
  const orphan = await p.programme.count({ where: { departmentId: null } })
  console.log(`\nOrphan programmes: ${orphan}`)

  await p.$disconnect()
}

main().catch((e) => { console.error(e); process.exit(1) })
