export interface Experience {
  id: string;
  role: string;
  company: string;
  location: string;
  dates: string;
  description: string[];
  tags: string[];
  link?: string;
}

export interface Volunteering {
  id: string;
  role: string;
  organization: string;
  dates: string;
  description: string;
  achievements: string[];
  featured?: boolean;
  iconName?: string;
  image?: string;
  link?: string;
  logoUrl?: string;
}

export interface TravelLocation {
  id: string;
  destination: string;
  country: string;
  dates: string;
  description: string;
  highlights: string[];
  image: string;
  images?: string[];
  visitedCountryCode: string; // ISO 3-letter code, e.g., 'USA', 'AUS', 'VNM', 'ARG'
  stateCode?: string;         // E.g., 'US-CA', 'AU-NSW' for drill-down mapping
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credentialId?: string;
  link?: string;
}

export interface HomeData {
  heroName: string;
  heroSubtitle: string;
  aboutLabel: string;
  aboutHeadline: string;
  aboutParagraphs: string[];
  metaBasedIn: string;
  metaRole: string;
  metaSkills: string;
  galleryTravelTitle: string;
  galleryTravelDescription: string;
  galleryTravelImage: string;
  galleryVolunteeringTitle: string;
  galleryVolunteeringDescription: string;
  galleryVolunteeringImage: string;
  heroImage: string;
  blockedTabs?: {
    home?: boolean;
    work?: boolean;
    projects?: boolean;
    travel?: boolean;
    volunteering?: boolean;
  };
  certifications?: Certification[];
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  techStack: string[];
  link?: string;
  githubUrl?: string;
  status: 'completed' | 'wip';
  iconName?: string;
  imageUrl?: string;
  lastUpdated?: string;
}
