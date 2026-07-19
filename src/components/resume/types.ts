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
  sideProjects: SideProject[];
}
