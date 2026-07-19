import type { ResumeData } from "../types";

// Placeholder content — replace with Shine's real details.
export const shine: ResumeData = {
  profile: {
    name: "Shine",
    description:
      "Creative developer crafting delightful, accessible web experiences.",
    location: "Oxford, United Kingdom",
    locationUrl: "https://www.google.com/maps/place/Oxford",
    about:
      "Designer-engineer hybrid focused on building polished user interfaces, design systems, and expressive interactions. Passionate about typography, motion, and shipping products people love to use.",
  },
  contactLinks: [
    {
      label: "Personal website",
      href: "https://example.com",
      icon: "/cv/icons/browser.png",
      external: true,
    },
    {
      label: "Send email",
      href: "mailto:hello@example.com",
      icon: "/cv/icons/mail.png",
    },
    {
      label: "GitHub profile",
      href: "https://github.com",
      icon: "/cv/icons/github.png",
      external: true,
    },
    {
      label: "LinkedIn profile",
      href: "https://www.linkedin.com",
      icon: "/cv/icons/linkedin.png",
      external: true,
    },
  ],
  workExperience: [
    {
      company: "Studio Placeholder",
      url: "https://example.com",
      position: "Senior Product Designer & Developer",
      period: "2023 - Present",
      description:
        "Leading design and frontend development for client products across web and mobile.",
      details: [
        "Built and maintained a multi-brand design system used across five products",
        "Prototyped and shipped interactive marketing experiences with strong Core Web Vitals",
      ],
      tags: ["Remote", "Design Systems", "React", "TypeScript", "Figma"],
    },
    {
      company: "Acme Web Co",
      url: "https://example.com",
      position: "Frontend Developer",
      period: "2020 - 2023",
      description:
        "Developed accessible, high-performance interfaces for e-commerce and SaaS clients.",
      tags: ["Hybrid", "Next.js", "Tailwind CSS", "Accessibility"],
    },
  ],
  skills: [
    "UI/UX Design",
    "React/Next.js",
    "TypeScript",
    "Design Systems",
    "Figma",
    "Motion Design",
    "Accessibility",
    "SCSS/Tailwind CSS",
  ],
  sideProjects: [
    {
      name: "Palette Play",
      url: "https://example.com",
      description:
        "A small tool for generating accessible color palettes with live WCAG contrast checks",
      technologies: ["TypeScript", "React", "Vite"],
      active: true,
    },
    {
      name: "Type Scale Studio",
      url: "https://example.com",
      description:
        "Interactive playground for building fluid typographic scales and exporting CSS variables",
      technologies: ["TypeScript", "Next.js", "CSS"],
    },
  ],
};
