import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const existing = await prisma.user.count()

  // 1) Bootstrap admin from env (if configured)
  if (process.env.ADMIN_BOOTSTRAP === 'true') {
    const email = (process.env.ADMIN_EMAIL || 'admin@sciences.uenr.edu.gh')
      .toLowerCase()
      .trim()
    const password = process.env.ADMIN_PASSWORD || 'ChangeMe123!'
    const found = await prisma.user.findUnique({ where: { email } })
    if (!found) {
      const passwordHash = await bcrypt.hash(password, 10)
      await prisma.user.create({
        data: { email, name: 'Administrator', passwordHash, role: 'ADMIN' },
      })
      console.log(`✓ Created admin account: ${email}`)
    } else {
      console.log(`✓ Admin account already exists: ${email}`)
    }
  }

  // Only seed sample content if the DB is empty (fresh setup)
  if (existing > 0) {
    console.log('↷ Database already has content; skipping sample seed.')
    await seedResources()
    return
  }

  console.log('↷ Seeding sample content…')

  const chem = await prisma.department.create({
    data: {
      slug: 'chemical-sciences',
      name: 'Department of Chemical Sciences',
      shortName: 'Chem. Sciences',
      ordering: 1,
      summary:
        'Chemistry with applications to energy, environment, and natural resources.',
      description:
        'Established in 2014, the Department of Chemical Sciences offers the BSc Chemistry programme. The department equips students with theoretical and practical knowledge in chemistry for careers in research, industry, and academia.',
    },
  })

  const cs = await prisma.department.create({
    data: {
      slug: 'computer-science-and-informatics',
      name: 'Department of Computer Science',
      shortName: 'Computer Science',
      ordering: 2,
      summary:
        'Training in computing theory, algorithms, programming, and software systems.',
      description:
        'One of the founding departments (2013), offering BSc Computer Science and postgraduate programmes. The department hosts the UENR chapter of the Huawei ICT Academy.',
    },
  })

  const itds = await prisma.department.create({
    data: {
      slug: 'information-technology-and-decision-sciences',
      name: 'Department of Information Technology and Decision Sciences',
      shortName: 'IT & Decision Sciences',
      ordering: 3,
      summary:
        'Applications of technology to information management, networks, and business decision systems.',
      description:
        'Focusing on information technology infrastructure, decision support systems, data analytics, and the application of technology in organisational contexts.',
    },
  })

  const maths = await prisma.department.create({
    data: {
      slug: 'mathematics-and-statistics',
      name: 'Department of Mathematics and Statistics',
      shortName: 'Maths & Statistics',
      ordering: 3,
      summary:
        'Mathematics, statistics, and actuarial science for scientific and industrial problem solving.',
      description:
        'A founding department (2013) offering BSc Mathematics, BSc Statistics, BSc Actuarial Science, and MPhil Applied Mathematics.',
    },
  })

  await prisma.department.create({
    data: {
      slug: 'basic-and-applied-biology',
      name: 'Department of Basic and Applied Biology',
      shortName: 'Biological Science',
      ordering: 4,
      summary:
        'Biological sciences with emphasis on applied and natural resource biology.',
      description:
        'Established in 2017, offering BSc Biological Sciences. The department is closely linked with the Centre for Research in Applied Biology (CeRAB-UENR).',
    },
  })

  await prisma.department.create({
    data: {
      slug: 'medical-laboratory-science',
      name: 'Department of Medical Laboratory Science',
      shortName: 'Medical Lab Science',
      ordering: 5,
      summary:
        'Training biomedical scientists for healthcare diagnostics and research.',
      description:
        'Offering BSc Medical Laboratory Science for careers in clinical diagnostics and biomedical research.',
    },
  })

  await prisma.department.create({
    data: {
      slug: 'nursing',
      name: 'Department of Nursing',
      shortName: 'Nursing',
      ordering: 6,
      summary:
        'Nursing education for professional and compassionate healthcare delivery.',
      description:
        'Offering BSc Nursing, preparing graduates for registered nursing careers in Ghana and abroad.',
    },
  })

  const nursingDept = await prisma.department.findUnique({
    where: { slug: 'nursing' },
  })

  await prisma.programme.createMany({
    data: [
      {
        slug: 'bsc-actuarial-science',
        name: 'BSc Actuarial Science',
        code: 'ACT',
        level: 'DEGREE',
        mode: 'Regular',
        duration: '4 Years',
        departmentId: maths.id,
        summary:
          'Apply mathematics and statistics to assess risk in finance and insurance.',
        overview:
          'The BSc Actuarial Science programme trains students to apply mathematical and statistical methods to assess risk in the insurance, finance, and investment industries.',
        requirements:
          'Credit passes in English Language, Mathematics, Integrated Science\nElective subjects must include Elective Mathematics',
        careerPaths:
          'Actuary\nRisk Analyst\nInvestment Analyst\nInsurance Underwriter',
      },
      {
        slug: 'bsc-biological-sciences',
        name: 'BSc Biological Sciences',
        code: 'BIO',
        level: 'DEGREE',
        mode: 'Regular',
        duration: '4 Years',
        summary:
          'Study living organisms and their relationship to the environment.',
        overview:
          'A broad programme covering the principles of biology with emphasis on applied and natural resource biology relevant to Ghana\u2019s development.',
        requirements:
          'Credit passes in English Language, Mathematics, Integrated Science\nElectives: Chemistry, Elective Mathematics/Physics and Biology/General Agriculture/Forestry',
        careerPaths:
          'Research Scientist\nEnvironmental Biologist\nBiotechnologist\nScience Educator',
      },
      {
        slug: 'bsc-chemistry',
        name: 'BSc Chemistry',
        code: 'CHM',
        level: 'DEGREE',
        mode: 'Regular',
        duration: '4 Years',
        departmentId: chem.id,
        summary:
          'Comprehensive training in the theory and practice of chemistry.',
        overview:
          'Covers inorganic, organic, physical, analytical, and environmental chemistry with applications to energy and natural resources.',
        requirements:
          'Credit passes in English Language, Mathematics, Integrated Science\nElectives: Chemistry, Physics and Biology/Mathematics',
        careerPaths:
          'Chemist\nQuality Control Analyst\nEnvironmental Consultant\nLaboratory Manager',
      },
      {
        slug: 'bsc-computer-science',
        name: 'BSc Computer Science',
        code: 'CS',
        level: 'DEGREE',
        mode: 'Regular',
        duration: '4 Years',
        departmentId: cs.id,
        summary:
          'Study computing theory, algorithms, programming, and software systems.',
        overview:
          'Trains graduates in the theory and application of computing, including programming, algorithms, artificial intelligence, and networking.',
        requirements:
          'Credit passes in English Language, Mathematics, Integrated Science\nElectives must include Elective Mathematics and Physics',
        careerPaths:
          'Software Developer\nSystems Analyst\nCybersecurity Specialist\nData Scientist',
      },
      {
        slug: 'bsc-information-technology',
        name: 'BSc Information Technology',
        code: 'IT',
        level: 'DEGREE',
        mode: 'Regular / Weekend',
        duration: '4 Years',
        departmentId: itds.id,
        summary:
          'Applications of technology to manage and process information.',
        overview:
          'Focuses on the application of technology to information management, networks, databases, and business systems.',
        requirements:
          'Credit passes in English Language, Mathematics, Integrated Science\nElectives must include Elective Mathematics',
        careerPaths:
          'IT Consultant\nNetwork Administrator\nDatabase Administrator\nSystems Engineer',
      },
      {
        slug: 'bsc-mathematics',
        name: 'BSc Mathematics',
        code: 'MTH',
        level: 'DEGREE',
        mode: 'Regular',
        duration: '4 Years',
        departmentId: maths.id,
        summary:
          'Pure and applied mathematics for scientific and industrial careers.',
        overview:
          'Develops strong analytical and problem-solving skills through pure and applied mathematics.',
        requirements:
          'Credit passes in English Language, Mathematics, Integrated Science\nElectives must include Elective Mathematics',
        careerPaths:
          'Mathematician\nData Analyst\nEducator\nQuantitative Analyst',
      },
      {
        slug: 'bsc-medical-laboratory-science',
        name: 'BSc Medical Laboratory Science',
        code: 'MLS',
        level: 'DEGREE',
        mode: 'Regular',
        duration: '4 Years',
        departmentId: chem.id,
        summary:
          'Train to carry out clinical diagnostics in biomedical laboratories.',
        overview:
          'Trains biomedical scientists to perform laboratory tests that support disease diagnosis, treatment, and prevention.',
        requirements:
          'Credit passes in English Language, Mathematics, Integrated Science\nElectives: Chemistry, Elective Mathematics/Physics and Biology/General Agriculture/Forestry',
        careerPaths:
          'Medical Laboratory Scientist\nBiomedical Researcher\nQuality Assurance Officer',
      },
      {
        slug: 'bsc-nursing',
        name: 'BSc Nursing',
        code: 'NUR',
        level: 'DEGREE',
        mode: 'Regular',
        duration: '4 Years',
        departmentId: nursingDept ? nursingDept.id : null,
        summary: 'Nursing education leading to registered nursing practice.',
        overview:
          'Prepares graduates for professional nursing practice in clinical and community settings.',
        requirements:
          'Credit passes in English Language, Mathematics, Integrated Science\nElectives from Science/General Arts/Agriculture/Home Economics',
        careerPaths: 'Registered Nurse\nNurse Educator\nPublic Health Nurse',
      },
      {
        slug: 'bsc-statistics',
        name: 'BSc Statistics',
        code: 'STA',
        level: 'DEGREE',
        mode: 'Regular',
        duration: '4 Years',
        departmentId: maths.id,
        summary:
          'Collect, analyse, and interpret data to inform decisions.',
        overview:
          'Trains students in data collection, probability, statistical modelling, and data analysis.',
        requirements:
          'Credit passes in English Language, Mathematics, Integrated Science\nElectives must include Elective Mathematics',
        careerPaths:
          'Statistician\nData Scientist\nMarket Researcher\nBiostatistician',
      },
      {
        slug: 'msc-computer-science',
        name: 'MSc Computer Science',
        code: 'CS',
        level: 'POSTGRADUATE',
        mode: 'Regular / Weekend',
        duration: '1 Year',
        departmentId: cs.id,
        summary:
          'Advanced study and research in computer science and IT.',
        overview:
          'A one-year master\u2019s programme preparing graduates for research and advanced professional roles in computing.',
        requirements:
          'BSc in Computer Science or a related discipline with minimum Second-Class (Lower Division)',
        careerPaths:
          'Academic Researcher\nSenior Software Engineer\nIT Consultant',
      },
      {
        slug: 'mphil-computer-science',
        name: 'MPhil Computer Science',
        code: 'CS',
        level: 'POSTGRADUATE',
        mode: 'Regular / Weekend',
        duration: '2 Years',
        departmentId: cs.id,
        summary: 'Research master\u2019s in computer science.',
        overview:
          'A two-year research-oriented programme producing expert computer scientists capable of high-quality research.',
        requirements:
          'BSc in Computer Science or related discipline with minimum Second-Class Honours (Lower Division)',
        careerPaths: 'Researcher\nLecturer\nPhD candidate',
      },
      {
        slug: 'mphil-applied-mathematics',
        name: 'MPhil Applied Mathematics',
        code: 'MTH',
        level: 'POSTGRADUATE',
        mode: 'Weekend',
        duration: '2 Years',
        departmentId: maths.id,
        summary:
          'Mathematical modelling for real-world applications.',
        overview:
          'Trains graduates to model real-world situations in biology, engineering, natural resources, business, and finance.',
        requirements:
          'Bachelor\u2019s degree with strong mathematics component, minimum Second-Class (Lower Division)',
        careerPaths: 'Researcher\nMathematical Modeller\nEducator',
      },
      {
        slug: 'phd-computer-science',
        name: 'PhD Computer Science',
        code: 'CS',
        level: 'POSTGRADUATE',
        mode: 'Regular',
        duration: '4 Years',
        departmentId: cs.id,
        summary: 'Doctoral research in computer science.',
        overview:
          'A four-year doctoral programme open to graduates of computer science and related science/engineering disciplines.',
        requirements:
          'MPhil in Computer Science or equivalent; exceptional candidates from related fields may be considered',
        careerPaths: 'Academic Researcher\nUniversity Faculty\nSenior Industry Researcher',
      },
    ],
  })

  // Staff
  await prisma.staff.createMany({
    data: [
      {
        name: 'Prof. Samuel Gyasi',
        title: 'Professor',
        roles: 'Dean, School of Sciences',
        email: 'samuel.gyasi@sciences.uenr.edu.gh',
        showOnPublic: true,
        ordering: 0,
        bio: 'Dean of the School of Sciences.',
      },
      {
        name: 'Dr. Adelaide Boateng',
        title: 'Senior Lecturer',
        roles: 'Head, Department of Chemical Sciences',
        email: 'adelaide.boateng@uenr.edu.gh',
        departmentId: chem.id,
        showOnPublic: true,
        ordering: 1,
      },
      {
        name: 'Dr. Kwame Mensah',
        title: 'Senior Lecturer',
        roles: 'Head, Department of Computer Science and Informatics',
        email: 'kwame.mensah@uenr.edu.gh',
        departmentId: cs.id,
        showOnPublic: true,
        ordering: 1,
      },
      {
        name: 'Dr. Efua Nyarko',
        title: 'Senior Lecturer',
        roles: 'Head, Department of Mathematics and Statistics',
        email: 'efua.nyarko@uenr.edu.gh',
        departmentId: maths.id,
        showOnPublic: true,
        ordering: 1,
      },
    ],
  })

  // SPMS Admin user (separate from CMS admin)
  await prisma.staff.create({
    data: {
      name: 'SPMS Administrator',
      title: 'System Administrator',
      email: (process.env.ADMIN_EMAIL || 'admin@sciences.uenr.edu.gh').toLowerCase().trim(),
      roles: 'Administrator',
      staffType: 'ADMINISTRATOR',
      spmsAccess: true,
      spmsPasswordChanged: true,
      showOnPublic: false,
      bio: 'SPMS system administrator account.',
    },
  })

  // News posts
  await prisma.post.createMany({
    data: [
      {
        slug: 'ict-academy-trains-students',
        title: 'UENR Chapter of Huawei ICT Academy Trains 50 Students in Routing and Switching',
        category: 'NEWS',
        excerpt:
          'The UENR chapter of the Huawei ICT Academy recently trained 50 students in routing and switching as part of its capacity-building programme.',
        content:
          'The University of Energy and Natural Resources chapter of the Huawei ICT Academy recently trained 50 students in routing and switching.\n\nThe initiative, hosted within the School of Sciences, is part of a broader effort to equip students with practical, industry-relevant information and communication technology skills.\n\nParticipants gained hands-on experience in configuring and managing networks, positioning them for careers in network administration and ICT support.',
        published: true,
        featured: true,
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6),
      },
      {
        slug: 'ai-app-detect-crop-pests',
        title: 'Faculty Develop AI Application to Detect Crop Pests and Diseases',
        category: 'NEWS',
        excerpt:
          'A faculty member of the Department of Information Technology led a team to develop an AI application for detecting crop pests and diseases.',
        content:
          'A faculty member of the Department of Information Technology and Decision Sciences has led a team of researchers to develop an artificial intelligence application to detect pests and diseases of crops and their control.\n\nThe application aims to support farmers in identifying threats early and improving crop yields across Ghana.',
        published: true,
        featured: true,
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12),
      },
      {
        slug: 'uenr-selected-seeding-labs',
        title: 'UENR Selected for Seeding Labs Instrumental Access Programme',
        category: 'ANNOUNCEMENT',
        excerpt:
          'UENR has been selected for the Seeding Labs 2020 Instrumental Access programme.',
        content:
          'The University has been selected for the Seeding Labs 2020 Instrumental Access programme, which provides laboratory equipment to support scientific research and teaching.\n\nThe selection reinforces the University\u2019s commitment to building world-class laboratory capacity within the sciences.',
        published: true,
        featured: true,
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20),
      },
      {
        slug: 'industrial-tour-diploma-it',
        title: 'Department Organizes Transformative Industrial Tour for Diploma IT Students',
        category: 'EVENT',
        excerpt:
          'The Department of Information Technology and Decision Sciences organized an industrial tour for Diploma IT students.',
        content:
          'The Department of Information Technology and Decision Sciences organized a transformative industrial tour for its Diploma IT students.\n\nThe tour gave students exposure to real-world technology environments, linking classroom learning with industry practice.',
        published: true,
        featured: false,
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
      },
      {
        slug: 'applications-open-2026',
        title: 'Applications Open for the 2026/2027 Academic Year',
        category: 'ANNOUNCEMENT',
        excerpt:
          'Applications are now open for admission to the School of Sciences for the 2026/2027 academic year.',
        content:
          'Applications are now open for admission to the School of Sciences for the 2026/2027 academic year.\n\nProspective students are encouraged to apply through the University admissions portal. Requirements include credit passes in core and relevant elective subjects as described in each programme.',
        published: true,
        featured: false,
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
      },
    ],
  })

  // Research areas
  await prisma.researchArea.createMany({
    data: [
      {
        slug: 'applied-biology',
        title: 'Applied Biology & Biotechnology',
        summary:
          'Research applying biological sciences to agriculture, health, and environmental challenges.',
        content:
          'The Centre for Research in Applied Biology (CeRAB-UENR) conducts research applying biology and biotechnology to address Ghana\u2019s agricultural, health, and environmental challenges.\n\nResearchers collaborate with industry and government to translate findings into practical solutions.',
        published: true,
        ordering: 1,
      },
      {
        slug: 'computing-and-ai',
        title: 'Computing, AI & Data Science',
        summary:
          'Artificial intelligence, machine learning, and data-driven solutions for real-world problems.',
        content:
          'The Department of Computer Science and Informatics undertakes research in artificial intelligence, machine learning, and data science, including applications to agriculture (e.g., pest and disease detection) and other sectors.',
        published: true,
        ordering: 2,
      },
      {
        slug: 'energy-materials-chemistry',
        title: 'Energy & Materials Chemistry',
        summary:
          'Chemistry research supporting sustainable energy and natural resource management.',
        content:
          'Research in the Department of Chemical Sciences addresses the chemistry of energy systems, including renewable energy materials, environmental monitoring, and resource utilisation.',
        published: true,
        ordering: 3,
      },
      {
        slug: 'biostatistics-modelling',
        title: 'Statistics & Mathematical Modelling',
        summary:
          'Statistical methods and mathematical modelling for energy, environment, and finance.',
        content:
          'The Department of Mathematics and Statistics conducts research on statistical methods and mathematical modelling applied to energy, environmental, financial, and biological systems.',
        published: true,
        ordering: 4,
      },
    ],
  })

  // Settings used by the site (optional)
  await prisma.siteSetting.createMany({
    data: [
      { key: 'school_name', value: 'School of Sciences' },
      { key: 'school_tagline', value: 'Science is an adventure' },
      { key: 'contact_email', value: 'info@sciences.uenr.edu.gh' },
      { key: 'contact_phone', value: '+233 (0) 00 000 0000' },
      { key: 'address', value: 'P.O. Box 214, Sunyani, Ghana' },
    ],
  })

  // Academic years
  const y2324 = await prisma.academicYear.create({ data: { year: '2023/2024' } })
  const y2425 = await prisma.academicYear.create({ data: { year: '2024/2025', active: true } })
  const y2526 = await prisma.academicYear.create({ data: { year: '2025/2026' } })

  // Resources — handbooks & student lists (sample PDF placeholder)
  await seedResources()

  console.log('✓ Sample content seeded successfully.')
}

async function seedResources() {
  const resourceCount = await prisma.resource.count()
  if (resourceCount > 0) {
    console.log('↷ Resources already seeded; skipping.')
    return
  }

  const y2324 = await prisma.academicYear.findUnique({ where: { year: '2023/2024' } })
  const y2425 = await prisma.academicYear.findUnique({ where: { year: '2024/2025' } })
  const y2526 = await prisma.academicYear.findUnique({ where: { year: '2025/2026' } })

  await prisma.resource.createMany({
    data: [
      {
        title: 'Student Handbook 2024/2025',
        description: 'Academic regulations, programmes, and campus life for the School of Sciences.',
        fileUrl: '/sample-first-page.pdf',
        fileName: 'Student_Handbook_2024-2025.pdf',
        category: 'HANDBOOK',
        academicYearId: y2425?.id ?? null,
      },
      {
        title: 'Final Year Project Handbook',
        description: 'Guidelines for topic selection, document formatting, and submission deadlines.',
        fileUrl: '/sample-first-page.pdf',
        fileName: 'Final_Year_Project_Handbook.pdf',
        category: 'HANDBOOK',
      },
      {
        title: 'Examination Regulations',
        description: 'Assessment, grading, and academic integrity policies.',
        fileUrl: '/sample-first-page.pdf',
        fileName: 'Examination_Regulations.pdf',
        category: 'HANDBOOK',
      },
      {
        title: 'Final Year Project Student Group List — 2024/2025',
        description: 'Groups and supervisors for all final year project students, 2024/2025 session.',
        fileUrl: '/sample-first-page.pdf',
        fileName: 'FYP_Group_List_2024-2025.pdf',
        category: 'STUDENT_LIST',
        academicYearId: y2425?.id ?? null,
      },
      {
        title: 'Final Year Project Student Group List — 2023/2024',
        description: 'Groups and supervisors for all final year project students, 2023/2024 session.',
        fileUrl: '/sample-first-page.pdf',
        fileName: 'FYP_Group_List_2023-2024.pdf',
        category: 'STUDENT_LIST',
        academicYearId: y2324?.id ?? null,
      },
      {
        title: 'Final Year Project Student Group List — 2025/2026',
        description: 'Groups and supervisors for all final year project students, 2025/2026 session.',
        fileUrl: '/sample-first-page.pdf',
        fileName: 'FYP_Group_List_2025-2026.pdf',
        category: 'STUDENT_LIST',
        academicYearId: y2526?.id ?? null,
      },
      {
        title: 'Admission Requirements Brochure',
        description: 'General admission requirements for undergraduate and postgraduate programmes.',
        fileUrl: '/sample-first-page.pdf',
        fileName: 'Admission_Requirements.pdf',
        category: 'OTHER',
      },
    ],
  })

  console.log('✓ Sample content seeded successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
