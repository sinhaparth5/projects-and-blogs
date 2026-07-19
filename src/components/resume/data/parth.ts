import type { ResumeData } from "../types";

export const parth: ResumeData = {
  profile: {
    name: "Parth Sinha",
    description:
      "Detail-oriented Full Stack Engineer dedicated to building high-quality products.",
    location: "Oxford, United Kingdom",
    locationUrl: "https://www.google.com/maps/place/Oxford",
    about:
      "Frontend-focused Full Stack Engineer specializing in high-performance React applications, scalable Node.js services, and real-time collaboration systems. Experienced in technical architecture design and remote team leadership.",
    image: "/cv/images/profile.webp",
  },
  contactLinks: [
    {
      label: "Personal website",
      href: "https://parthsinha.com",
      icon: "/cv/icons/browser.png",
      external: true,
    },
    {
      label: "Send email",
      href: "mailto:sinhaparth555@gmail.com",
      icon: "/cv/icons/mail.png",
    },
    {
      label: "Call phone",
      href: "tel:+447306179724",
      icon: "/cv/icons/phone.png",
    },
    {
      label: "GitHub profile",
      href: "https://github.com/sinhaparth5",
      icon: "/cv/icons/github.png",
      external: true,
    },
    {
      label: "LinkedIn profile",
      href: "https://www.linkedin.com/in/parth-sinha18/",
      icon: "/cv/icons/linkedin.png",
      external: true,
    },
    {
      label: "X profile",
      href: "https://x.com/sinhaparth555",
      icon: "/cv/icons/x.svg",
      external: true,
    },
  ],
  workExperience: [
    {
      company: "Motion",
      url: "https://motionapp.com/",
      position: "Senior Software Engineer",
      period: "2025 - Present",
      description:
        "Working on internal AI agents platform allowing marketing specialists to create AI workflows.",
      tags: ["Remote", "AI", "React", "Next.js", "TypeScript", "AdonisJS"],
    },
    {
      company: "Film.io",
      url: "https://film.io",
      position: "Software Architect",
      period: "2024 - 2025",
      description:
        "Leading technical architecture of a blockchain-based film funding platform.",
      details: [
        "Architecting migration from CRA to Next.js for improved performance, SEO, and DX",
        "Established release process enabling faster deployments and reliable rollbacks",
        "Implementing system-wide monitoring and security improvements",
      ],
      tags: ["Remote", "React", "Next.js", "TypeScript", "Node.js"],
    },
    {
      company: "Parabol",
      url: "https://parabol.co",
      position: "Senior Full Stack Developer",
      period: "2021 - 2024",
      description:
        "Senior developer and squad leader for an enterprise agile meeting platform.",
      details: [
        "Built design system with Tailwind CSS, improving development speed and time to market",
        "Implemented engineering practices: PR automation, code review guidelines, and workflows",
        "Open source contributions to Relay DevTools and React i18n tooling",
      ],
      tags: [
        "Remote",
        "React",
        "TypeScript",
        "Node.js",
        "GraphQL",
        "Tailwind CSS",
      ],
    },
    {
      company: "Clevertech",
      url: "https://clevertech.biz",
      position: "Lead Android Developer → Full Stack Developer",
      period: "2015 - 2021",
      description:
        "Successfully transitioned from mobile to full-stack development while leading distributed teams.",
      details: [
        "Led frontend team at Evercast, building real-time platform supporting 30+ users per room with HD streaming and collaboration tools",
        "Developed offline-first Android app for DKMS, improving donor registration process",
        "Led development teams across multiple successful client projects",
      ],
      tags: ["Remote", "React", "TypeScript", "Node.js", "Android", "Kotlin"],
    },
    {
      company: "Jojo Mobile",
      url: "https://bsgroup.eu/",
      position: "Android Developer → Lead Android Developer",
      period: "2012 - 2015",
      description:
        "First Android developer, grew and led a team of 15+ engineers while establishing engineering culture.",
      details: [
        "Developed apps for major Polish companies including LOT, Polskie Radio, and Agora",
        "Built and mentored high-performing mobile development team",
      ],
      tags: ["On Site", "Android", "Java", "Kotlin"],
    },
    {
      company: "Nokia Siemens Networks",
      url: "https://www.nokia.com",
      position: "C/C++ Developer",
      period: "2010 - 2012",
      description:
        "Developed software for LTE base stations at enterprise scale, gaining strong fundamentals in software architecture, testing practices, and cross-team collaboration.",
      tags: ["On Site", "C/C++", "LTE", "Agile"],
    },
  ],
  skills: [
    "React/Next.js/Remix",
    "TypeScript",
    "Tailwind CSS",
    "Design Systems",
    "WebRTC",
    "WebSockets",
    "Node.js",
    "GraphQL",
    "Relay",
    "System Architecture",
    "Remote Team Leadership",
  ],
  sideProjects: [
    {
      name: "Monito",
      url: "https://monito.dev/",
      description:
        "Browser extension for debugging web applications. Includes taking screenshots, screen recording, E2E tests generation and generating bug reports",
      technologies: [
        "TypeScript",
        "Next.js",
        "Browser Extension",
        "PostgreSQL",
      ],
      active: true,
    },
    {
      name: "Consultly",
      url: "https://consultly.com/",
      description:
        "Platform for online consultations with real-time video meetings and scheduling",
      technologies: [
        "TypeScript",
        "Next.js",
        "Vite",
        "GraphQL",
        "WebRTC",
        "Tailwind CSS",
        "PostgreSQL",
        "Redis",
      ],
      active: true,
    },
    {
      name: "Minimalist CV",
      url: "https://github.com/BartoszJarocki/cv",
      description:
        "An open source minimalist, print friendly CV template with a focus on readability and clean design. >9k stars on GitHub",
      technologies: ["TypeScript", "Next.js", "Tailwind CSS"],
      active: true,
    },
  ],
};
