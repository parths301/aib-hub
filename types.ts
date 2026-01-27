
export enum UserRole {
  VISITOR = 'VISITOR',
  CREATOR = 'CREATOR',
  ADMIN = 'ADMIN'
}

export type MembershipTier = 'BASE' | 'GOLD' | 'PLATINUM';

export interface PortfolioItem {
  id: string;
  type: 'image' | 'video' | 'sample';
  url: string;
  title: string;
}

export interface Creator {
  id: string;
  fullName: string;
  email: string;
  city: string;
  skills: string[]; // General skills
  purchasedTags: string[]; // Premium boosted tags
  bio: string;
  experience: string;
  profilePhoto: string;
  portfolio: PortfolioItem[];
  whatsapp: string;
  isFeatured: boolean;
  tier: MembershipTier;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface Job {
  id: string;
  title: string;
  city: string;
  requiredSkills: string[];
  description: string;
  contactEmail: string;
  whatsapp?: string;
  company: string;
  postedDate: string;
  budget: string; // Added field for offering amount
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  creatorId?: string;
}
