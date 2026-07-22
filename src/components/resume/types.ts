export interface ContactLink {
  label: string;
  href: string;
  icon: string;
  external?: boolean;
}

export interface WorkExperience {
  company: string;
  url: string;
  position: string;
  period: string;
  location?: string;
  description: string;
  details?: string[];
  tags: string[];
}

export interface SideProject {
  name: string;
  url: string;
  description: string;
  technologies: string[];
  active?: boolean;
}

export interface Education {
  institution: string;
  period: string;
  degree: string;
}

export interface Publication {
  title: string;
  authors: string;
  venue: string;
  period: string;
  status: string;
}

export interface Hackathon {
  title: string;
  result: string;
  period: string;
  location: string;
  project: string;
  description: string;
  highlights?: string[];
  linkedin: string;
  tags: string[];
}

export interface ResumeData {
  profile: {
    name: string;
    description: string;
    location: string;
    locationUrl: string;
    about: string;
    image?: string;
  };
  contactLinks: ContactLink[];
  workExperience: WorkExperience[];
  skills: string[];
  skillCategories?: Record<string, string[]>;
  sideProjects: SideProject[];
  education?: Education[];
  publications?: Publication[];
  hackathons?: Hackathon[];
}
