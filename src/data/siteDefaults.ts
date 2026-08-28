export type SiteSectionKey =
  | 'branding'
  | 'hero'
  | 'home'
  | 'about'
  | 'programmes'
  | 'news'
  | 'staff'
  | 'leadership'
  | 'contact'
  | 'projects'
  | 'footer'
  | 'navigation'

export interface SiteBranding {
  siteName: string
  logo: string
}

export interface SiteHero {
  badge: string
  title: string
  highlightWord: string
  subtitle: string
  description: string
  primaryCta: { label: string; href: string }
  secondaryCta: { label: string; href: string }
  image: string
  stats: { value: string; label: string }[]
}

export interface SiteHome {
  aboutEyebrow: string
  aboutHeading: string
  aboutBody: string
  aboutLink: string
  aboutYear: number
  aboutYearText: string
  aboutStat1Value: string
  aboutStat1Label: string
  aboutStat2Value: string
  aboutStat2Label: string
  deptEyebrow: string
  deptHeading: string
  deptLink: string
  progEyebrow: string
  progHeading: string
  progLink: string
  newsEyebrow: string
  newsHeading: string
  newsLink: string
  newsEmpty: string
  ctaHeading: string
  ctaBody: string
  ctaPrimary: { label: string; href: string }
  ctaSecondary: { label: string; href: string }
}

export interface SiteAbout {
  heroTitle: string
  heroSubtitle: string
  storyEyebrow: string
  storyHeading: string
  storyBody: string
  visionTitle: string
  visionBody: string
  missionTitle: string
  missionBody: string
  deptEyebrow: string
  deptHeading: string
  cerabHeading: string
  cerabBody: string
  cerabLink: string
  valuesEyebrow: string
  valuesHeading: string
  values: { title: string; description: string }[]
}

export interface SiteProgrammes {
  heroTitle: string
  heroSubtitle: string
  reqHeading: string
  reqBody: string
  reqCta: { label: string; href: string }
}

export interface SiteNews {
  heroTitle: string
  heroSubtitle: string
}

export interface SiteStaff {
  heroTitle: string
  heroSubtitle: string
}

export interface SiteLeadership {
  heroTitle: string
  heroSubtitle: string
}

export interface SiteContact {
  heroTitle: string
  heroSubtitle: string
  cardHeading: string
  address: string
  phone: string
  email: string
  officeHours: string
  mapEmbed: string
  formHeading: string
}

export interface SiteProjects {
  heroTitle: string
  heroSubtitle: string
  comingSoonHeading: string
  comingSoonBody: string
  ugTitle: string
  ugBody: string
  pgTitle: string
  pgBody: string
}

export interface SiteFooter {
  brandName: string
  brandSubtitle: string
  tagline: string
  quickLinksHeading: string
  quickLinks: { label: string; href: string }[]
  programmesHeading: string
  programmesLinks: { label: string; href: string }[]
  contactHeading: string
  address: string
  phone: string
  email: string
  copyright: string
  bottomTagline: string
}

export interface SiteNavigation {
  topBarText: string
  topBarLink: { label: string; href: string }
  ctaLabel: string
  ctaHref: string
  items: {
    label: string
    href: string
    children?: { label: string; href: string }[]
  }[]
}

export interface SiteSections {
  branding: SiteBranding
  hero: SiteHero
  home: SiteHome
  about: SiteAbout
  programmes: SiteProgrammes
  news: SiteNews
  staff: SiteStaff
  leadership: SiteLeadership
  contact: SiteContact
  projects: SiteProjects
  footer: SiteFooter
  navigation: SiteNavigation
}

export const siteDefaults: SiteSections = {
  branding: {
    siteName: 'School of Sciences',
    logo: '/SCHOOL OF SCIENCES LOGO OFFICIAL NEW.jpg.jpeg',
  },

  hero: {
    badge: 'University of Energy and Natural Resources',
    title: 'School of Sciences —',
    highlightWord: 'Science',
    subtitle: 'is\nan adventure',
    description:
      'Transformational and value-based education in physical and biological sciences, mathematics, computer science, and information technology — building scientific leaders to power Ghana and Africa.',
    primaryCta: { label: 'Explore Programmes', href: '/programmes' },
    secondaryCta: { label: 'Learn About Us', href: '/about' },
    image: '/JOEY SHOT IT_2.jpg',
    stats: [
      { value: '4,000+', label: 'Students' },
      { value: '80+', label: 'Qualified Lecturers' },
      { value: '3,000+', label: 'Graduates' },
    ],
  },

  home: {
    aboutEyebrow: 'Who We Are',
    aboutHeading:
      'Generating and advancing scientific knowledge for national development',
    aboutBody:
      'Established in the 2013/2014 academic year, the School of Sciences began operations with the Department of Mathematics and Statistics and the Department of Computer Science. Today we host multiple departments and centres dedicated to research and teaching about scientific knowledge and technology in its social context.',
    aboutLink: '/about',
    aboutYear: 2013,
    aboutYearText:
      'The year the School of Sciences began operations at UENR',
    aboutStat1Value: '9',
    aboutStat1Label: 'Degree programmes',
    aboutStat2Value: '7',
    aboutStat2Label: 'Departments',
    deptEyebrow: 'Departments',
    deptHeading: 'Explore our departments',
    deptLink: '/about#departments',
    progEyebrow: 'Programmes',
    progHeading: 'Shape your future with us',
    progLink: '/programmes',
    newsEyebrow: 'News & Events',
    newsHeading: 'Latest from the School',
    newsLink: '/news',
    newsEmpty: 'Check back soon for the latest updates.',
    ctaHeading: 'Ready to begin your scientific journey?',
    ctaBody:
      'Join a community of scientists, innovators, and problem-solvers committed to sustainable development and the energy future of Ghana and the world.',
    ctaPrimary: { label: 'Apply to UENR', href: 'https://admissions.uenr.edu.gh/applicant-login' },
    ctaSecondary: { label: 'Contact Us', href: '/contact' },
  },

  about: {
    heroTitle: 'About the School of Sciences',
    heroSubtitle:
      'Established in the 2013/2014 academic year as the third school of the University of Energy and Natural Resources.',
    storyEyebrow: 'Our Story',
    storyHeading: 'A centre of excellence for natural and applied sciences',
    storyBody:
      'The School of Sciences was established in the 2013/2014 Academic Year and is the third of the schools established by the University. It began operations with the Department of Mathematics and Statistics and the Department of Computer Science in 2013. In 2014, the Department of Chemical Science was established and the Department of Basic and Applied Biology in 2017.\n\nThe main objective of the school is to equip students with the requisite skills and competencies to address energy and natural resource challenges. Through its teaching, research and extension, the School plays a notable role in building the emerging discipline of Science & Technology Studies (STS) in Ghana and the world at large.',
    visionTitle: 'Our Vision',
    visionBody:
      'To become a centre of excellence for the promotion of empirical knowledge and innovative research in natural and applied sciences.',
    missionTitle: 'Our Mission',
    missionBody:
      'To generate, advance, and disseminate scientific knowledge and research for the development of human resources and society through competitive science-related disciplines.',
    deptEyebrow: 'Departments & Centres',
    deptHeading: 'Academic departments and research centres',
    cerabHeading: 'Note',
    cerabBody:
      'The School also hosts the Centre for Research in Applied Biology (CeRAB-UENR), available at ',
    cerabLink: 'https://cerab.uenr.edu.gh',
    valuesEyebrow: 'What We Stand For',
    valuesHeading: 'Our institutional values',
    values: [
      {
        title: 'Excellence',
        description:
          'Training the next generation of experts and providing cutting-edge research to support development.',
      },
      {
        title: 'Innovation',
        description:
          'Advancing and disseminating scientific knowledge for the benefit of society.',
      },
      {
        title: 'Integrity',
        description:
          'Conducting research and teaching with honesty, ethics, and accountability.',
      },
      {
        title: 'Impact',
        description:
          'Building competencies for attaining sustainable development goals.',
      },
    ],
  },

  programmes: {
    heroTitle: 'Our Programmes',
    heroSubtitle:
      'Undergraduate, diploma and postgraduate programmes in the physical and biological sciences, mathematics, computer science, and information technology.',
    reqHeading: 'Admission requirements',
    reqBody:
      'SSSCE candidates need credit passes (A-D) and WASSCE candidates need credit passes (A1-C6) in six subjects — three core (English, Mathematics, Integrated Science/Social Studies) and three elective subjects relevant to the programme. Mature and foreign applicants should contact the admissions office.',
    reqCta: { label: 'Apply to UENR', href: 'https://admissions.uenr.edu.gh/applicant-login' },
  },

  news: {
    heroTitle: 'News & Events',
    heroSubtitle:
      'Latest news, announcements and events from the School of Sciences.',
  },

  staff: {
    heroTitle: 'Academic Staff',
    heroSubtitle:
      'Our faculty and lecturers across all departments.',
  },

  leadership: {
    heroTitle: 'Leadership & Administration',
    heroSubtitle:
      'Meet the Dean, Registrar, Department Heads, and Administrators.',
  },

  contact: {
    heroTitle: 'Contact Us',
    heroSubtitle:
      'Get in touch with the School of Sciences — we would love to hear from you.',
    cardHeading: 'Contact information',
    address:
      'School of Sciences, University of Energy and Natural Resources, P.O. Box 214, Sunyani, Ghana',
    phone: '+233 (0) 00 000 0000',
    email: 'info@sciences.uenr.edu.gh',
    officeHours: 'Monday — Friday, 8:00 AM — 5:00 PM GMT',
    mapEmbed:
      'https://www.google.com/maps?q=University%20of%20Energy%20and%20Natural%20Resources%20Sunyani&output=embed',
    formHeading: 'Send us a message',
  },

  projects: {
    heroTitle: 'Student Projects',
    heroSubtitle:
      'Explore final-year and postgraduate projects completed by students of the School of Sciences.',
    comingSoonHeading: 'Coming Soon',
    comingSoonBody:
      'The Student Project Management module is currently under development. This page will showcase undergraduate and postgraduate projects supervised by lecturers in the School of Sciences.',
    ugTitle: 'Undergraduate',
    ugBody: 'Final-year BSc projects across all departments.',
    pgTitle: 'Post-Graduate',
    pgBody: 'MSc, MPhil, and PhD research projects.',
  },

  footer: {
    brandName: 'School of Sciences',
    brandSubtitle: 'UENR, Sunyani',
    tagline:
      'Transformational and value-based education in physical and biological sciences, mathematics, computer science, and information technology.',
    quickLinksHeading: 'Quick Links',
    quickLinks: [
      { label: 'About Us', href: '/about' },
      { label: 'Programmes', href: '/programmes' },
      { label: 'Projects', href: '/projects' },
      { label: 'News & Events', href: '/news' },
      { label: 'Leadership & Staff', href: '/staff' },
      { label: 'Contact', href: '/contact' },
    ],
    programmesHeading: 'Programmes',
    programmesLinks: [
      { label: 'Degree Programmes', href: '/programmes?level=degree' },
      { label: 'Diploma Programmes', href: '/programmes?level=diploma' },
      { label: 'Postgraduate', href: '/programmes?level=postgraduate' },
      { label: 'Apply Online', href: 'https://admissions.uenr.edu.gh/applicant-login' },
    ],
    contactHeading: 'Contact',
    address:
      'School of Sciences, UENR, P.O. Box 214, Sunyani, Ghana',
    phone: '+233 (0) 00 000 0000',
    email: 'info@sciences.uenr.edu.gh',
    copyright:
      'School of Sciences, University of Energy and Natural Resources. All rights reserved.',
    bottomTagline: 'Knowledge · Integrity · Impact',
  },

  navigation: {
    topBarText: 'University of Energy and Natural Resources — Sunyani, Ghana',
    topBarLink: { label: 'uenr.edu.gh', href: 'https://uenr.edu.gh' },
    ctaLabel: 'Apply Now',
    ctaHref: '/programmes',
    items: [
      { label: 'Home', href: '/' },
      {
        label: 'About',
        href: '/about',
        children: [
          { label: 'Overview', href: '/about' },
          { label: 'Our Departments', href: '/about#departments' },
          { label: 'Leadership', href: '/leadership' },
          { label: 'Staff', href: '/staff' },
        ],
      },
      {
        label: 'Programmes',
        href: '/programmes',
        children: [
          { label: 'All Programmes', href: '/programmes' },
          { label: 'Degree', href: '/programmes?level=degree' },
          { label: 'Diploma', href: '/programmes?level=diploma' },
          { label: 'Postgraduate', href: '/programmes?level=postgraduate' },
        ],
      },
      {
        label: 'Projects',
        href: '/projects',
        children: [
          { label: 'BSc', href: '/projects?level=BSc' },
          { label: 'Diploma', href: '/projects?level=Diploma' },
          { label: 'MSc', href: '/projects?level=MSc' },
          { label: 'MPHIL', href: '/projects?level=MPHIL' },
          { label: 'PHD', href: '/projects?level=PHD' },
        ],
      },
      { label: 'News & Events', href: '/news' },
      { label: 'Contact', href: '/contact' },
    ],
  },
}
