import { PrismaClient } from '@prisma/client'
const p = new PrismaClient()

const details = {
  // Department of Basic and Applied Biology
  'bsc-biological-science': {
    overview:
      'Focuses on the fundamental principles of life sciences, covering molecular biology, ecology, genetics, organismal biology, and practical laboratory techniques to solve biological challenges.',
    requirements: [
      'Credit passes (A1\u2013C6 in WASSCE / A\u2013D in SSSCE) in Core English Language, Core Mathematics, and Integrated Science.',
      'Credit passes in three elective subjects: Chemistry, Biology, and either Physics or Elective Mathematics.',
    ],
    careerPaths: [
      'Biologist / Research Scientist',
      'Environmental Consultant',
      'Quality Control Analyst (Pharma/Food)',
      'Ecologist / Conservation Officer',
    ],
  },
  'mphil-environmental-science': {
    overview:
      'An advanced research-focused postgraduate degree examining environmental dynamics, pollution control, resource management, and sustainable environmental policies.',
    requirements: [
      'A good first degree (First Class or Second Class Upper/Lower Division) in Biological Sciences, Environmental Science, Chemistry, or a related field from an accredited institution.',
      'Submission and successful defense of a viable research proposal.',
    ],
    careerPaths: [
      'Environmental Specialist',
      'Sustainability Manager',
      'Environmental Impact Officer',
      'Academic Lecturer / Researcher',
    ],
  },

  // Department of Chemical Sciences
  'bsc-chemistry': {
    overview:
      'Provides deep theoretical and practical knowledge in organic, inorganic, physical, and analytical chemistry to prepare students for industrial and research applications.',
    requirements: [
      'Credit passes in Core English Language, Core Mathematics, and Integrated Science.',
      'Elective passes including Chemistry, Physics, and Elective Mathematics.',
    ],
    careerPaths: [
      'Chemical Analyst',
      'Industrial Chemist',
      'Quality Assurance Specialist',
      'Materials Scientist',
    ],
  },
  'bsc-biochemistry': {
    overview:
      'Explores the chemical processes within and relating to living organisms, bridging chemistry and biology to understand metabolic, cellular, and genetic mechanisms.',
    requirements: [
      'Credit passes in Core English Language, Core Mathematics, and Integrated Science.',
      'Elective passes in Chemistry, Biology, and Physics or Elective Mathematics.',
    ],
    careerPaths: [
      'Biochemist',
      'Biomedical Researcher',
      'Clinical Laboratory Analyst',
      'Pharmaceutical Sales Specialist',
    ],
  },
  'bsc-engineering-physics': {
    overview:
      'Combines core physics, mathematics, and engineering principles to design, develop, and analyze innovative technological and engineering solutions.',
    requirements: [
      'Credit passes in Core English Language, Core Mathematics, and Integrated Science.',
      'Electives must include Physics, Elective Mathematics, and Chemistry.',
    ],
    careerPaths: [
      'Applied Physicist',
      'Instrumentation Engineer',
      'Systems Engineer',
      'Renewable Energy Specialist',
    ],
  },
  'mphil-chemistry': {
    overview:
      'An advanced graduate research program focused on original chemical synthesis, advanced analytical instrumentation, and industrial chemical research.',
    requirements: [
      "A Bachelor's degree (BSc) in Chemistry, Chemical Engineering, or a closely related field with a minimum Second Class (Lower) division.",
      'Academic transcripts, reference letters, and a research statement.',
    ],
    careerPaths: [
      'Research Chemist',
      'R&D Manager',
      'Regulatory Affairs Specialist',
      'University Lecturer',
    ],
  },

  // Department of Computer Science and Informatics
  'diploma-computer-science': {
    overview:
      'Offers foundational training in computer systems, programming fundamentals, web design, and network infrastructure for practical entry-level IT roles.',
    requirements: [
      'Passes in Core English Language, Core Mathematics, and Integrated Science / Social Studies.',
      'Passes in two or three relevant elective subjects (including Elective Mathematics or General Science background preferred).',
    ],
    careerPaths: [
      'IT Support Technician',
      'Junior Web Developer',
      'Helpdesk Technician',
      'Computer Operations Assistant',
    ],
  },
  'bsc-computer-science': {
    overview:
      'Emphasizes algorithmic problem-solving, software engineering, artificial intelligence, database systems, and core computer science theory.',
    requirements: [
      'Credit passes in Core English Language, Core Mathematics, and Integrated Science.',
      'Electives must include Elective Mathematics and either Physics, Chemistry, or Applied Electricity/ICT.',
    ],
    careerPaths: [
      'Software Engineer',
      'Full-Stack Developer',
      'Data Scientist',
      'Systems Analyst',
    ],
  },
  'msc-computer-science': {
    overview:
      'A taught graduate program tailored for working professionals seeking advanced skills in modern software design, algorithms, cybersecurity, and data systems.',
    requirements: [
      "A Bachelor's degree in Computer Science, Software Engineering, or related technical field with at least Second Class Lower Division.",
      'Professional experience in the IT/Tech sector is an added advantage.',
    ],
    careerPaths: [
      'Lead Software Architect',
      'Senior Systems Analyst',
      'Information Technology Director',
      'Data Engineer',
    ],
  },
  'mphil-computer-science': {
    overview:
      "A research-intensive Master's program aimed at advancing knowledge in computing concepts, machine learning, distributed computing, and advanced computational methodologies.",
    requirements: [
      "A good Bachelor's degree in Computer Science or a closely allied field from a recognized university.",
      'A comprehensive research proposal detailing the intended topic of research.',
    ],
    careerPaths: [
      'AI/ML Research Engineer',
      'CS Researcher / Academic',
      'High-Performance Computing Consultant',
      'Technical Solutions Director',
    ],
  },

  // Department of Information Technology and Decision Sciences
  'diploma-information-technology': {
    overview:
      'Focuses on the essential practical skills needed to maintain, deploy, and manage basic IT equipment, network administration, and web technology.',
    requirements: [
      'Passes in English Language, Core Mathematics, and Integrated Science / Social Studies.',
      'Passes in relevant elective subjects.',
    ],
    careerPaths: [
      'Network Assistant',
      'IT Support Specialist',
      'Web Operations Technician',
      'Systems Support Assistant',
    ],
  },
  'bsc-information-technology': {
    overview:
      'Focuses on the application of technology to information management, networks, databases, and business systems to support organizational goals.',
    requirements: [
      'Credit passes in English Language, Mathematics, and Integrated Science.',
      'Electives must include Elective Mathematics.',
    ],
    careerPaths: [
      'IT Consultant',
      'Network Administrator',
      'Database Administrator',
      'Systems Engineer',
    ],
  },
  'msc-information-technology': {
    overview:
      'Provides advanced knowledge in strategic IT management, cybersecurity policies, database architecture, and enterprise IT strategy.',
    requirements: [
      'First degree in Information Technology, Computer Science, IS, or related field with at least a Second Class Lower degree.',
    ],
    careerPaths: [
      'IT Operations Manager',
      'Enterprise Security Manager',
      'Chief Information Officer (CIO)',
      'Enterprise Solutions Architect',
    ],
  },
  'mphil-information-technology': {
    overview:
      'Combines advanced coursework and rigorous empirical research in applied information technology, human-computer interaction, and enterprise information architectures.',
    requirements: [
      'Good first degree in IT or closely related discipline.',
      'Strong academic references and a detailed research proposal.',
    ],
    careerPaths: [
      'IT Research Specialist',
      'University Academic / Lecturer',
      'Senior Technology Strategist',
      'Chief Technology Officer (CTO)',
    ],
  },
  'phd-information-technology': {
    overview:
      'A doctoral program focused on contributing novel research to the field of Information Technology, technological innovation, and decision science models.',
    requirements: [
      'Master\u2019s degree (MPhil or Research MSc) in IT, Computer Science, or closely related discipline.',
      'Comprehensive research proposal and successful interview performance.',
    ],
    careerPaths: [
      'University Professor / Senior Lecturer',
      'Chief Scientist / Principal IT Researcher',
      'Policy Advisor on Information Technology',
      'Tech Innovation Director',
    ],
  },

  // Department of Mathematics and Statistics
  'diploma-statistics': {
    overview:
      'Covers practical statistical methods, data collection techniques, basic probability, and introductory software tools for empirical analysis.',
    requirements: [
      'Passes in Core English Language, Core Mathematics, and Integrated Science.',
      'Relevant elective subjects (Elective Mathematics preferred).',
    ],
    careerPaths: [
      'Data Entry / Research Assistant',
      'Statistical Assistant',
      'Field Survey Supervisor',
      'Junior Analyst',
    ],
  },
  'bsc-mathematics': {
    overview:
      'Explores pure and applied mathematics, numerical analysis, mathematical modeling, and differential equations to solve scientific and engineering problems.',
    requirements: [
      'Credit passes in Core English Language, Core Mathematics, and Integrated Science.',
      'Electives must include Elective Mathematics and Physics or Chemistry.',
    ],
    careerPaths: [
      'Quantitative Analyst',
      'Mathematical Modeler',
      'Data Analyst',
      'Operations Research Analyst',
    ],
  },
  'bsc-actuarial-science': {
    overview:
      'Applies mathematical and statistical methods to assess risk in insurance, finance, pension management, and other industries and professions.',
    requirements: [
      'Credit passes in Core English Language, Core Mathematics, and Integrated Science.',
      'Electives must include Elective Mathematics with high performance.',
    ],
    careerPaths: [
      'Actuarial Analyst',
      'Risk Manager',
      'Financial Analyst',
      'Underwriter',
    ],
  },

  // Department of Medical Laboratory Science
  'bsc-medical-laboratory-science': {
    overview:
      'Prepares students to perform clinical laboratory tests on specimens to diagnose, treat, and prevent diseases in healthcare and research settings.',
    requirements: [
      'Credit passes in Core English Language, Core Mathematics, and Integrated Science.',
      'Electives must include Chemistry, Biology, and Physics or Elective Mathematics.',
    ],
    careerPaths: [
      'Medical Laboratory Scientist',
      'Clinical Pathologist Assistant',
      'Diagnostic Laboratory Director',
      'Research Associate in Diagnostics',
    ],
  },

  // Department of Nursing
  'bsc-nursing': {
    overview:
      'Combines rigorous clinical education with scientific knowledge to prepare compassionate and competent registered nurses for healthcare delivery and clinical management.',
    requirements: [
      'Credit passes in Core English Language, Core Mathematics, and Integrated Science.',
      'Electives must include Chemistry, Biology, and Physics or Elective Mathematics.',
    ],
    careerPaths: [
      'Registered General Nurse (RGN)',
      'Clinical Nurse Specialist',
      'Healthcare Administrator',
      'Public Health Nurse',
    ],
  },
}

async function main() {
  let updated = 0
  let missing = 0
  for (const [slug, d] of Object.entries(details)) {
    const existing = await p.programme.findUnique({ where: { slug } })
    if (!existing) {
      console.log(`\u2192 MISSING ${slug}`)
      missing++
      continue
    }
    await p.programme.update({
      where: { slug },
      data: {
        overview: d.overview,
        requirements: d.requirements.join('\n'),
        careerPaths: d.careerPaths.join('\n'),
      },
    })
    console.log(`\u2713 ${existing.name}`)
    updated++
  }
  console.log(`\nUpdated: ${updated}  |  Missing: ${missing}`)
  await p.$disconnect()
}

main().catch((e) => { console.error(e); process.exit(1) })
