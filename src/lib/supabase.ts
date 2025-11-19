import { createClient } from '@supabase/supabase-js';

// Replace these with your actual Supabase project URL and anon key
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Property {
  id: string;
  title: string;
  description: string;
  image: string;
  price?: number;
  location: string;
  property_type: 'Agricultural' | 'Solar Projects' | 'Commercial' | 'Residential' | 'Industrial';
  size?: string;
  features: string[];
  is_featured: boolean;
  is_premium: boolean;
  status: 'Available' | 'Sold' | 'Pending' | 'Under Construction';
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  is_active: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Certification {
  id: string;
  title: string;
  description: string;
  image: string;
  issuer: string;
  issue_date: string;
  expiry_date?: string;
  verification_url?: string;
  is_active: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Neighborhood {
  id: string;
  name: string;
  description: string;
  image: string;
  location: string;
  highlights: string[];
  is_popular: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface PropertyType {
  id: string;
  name: string;
  description: string;
  icon: string;
  features: string[];
  is_active: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Portfolio {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  location: string;
  completion_date?: string;
  is_premium: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface FeaturedProject {
  id: string;
  title: string;
  description: string;
  image: string;
  bg_gradient: string;
  features: string[];
  stats: { [key: string]: string };
  type: string;
  is_featured: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  company_name: string;
  description: string;
  logo: string;
  contact_info: {
    phone: string;
    email: string;
    address: string;
    website?: string;
  };
  social_media: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Settings {
  id: string;
  site_title: string;
  site_description: string;
  site_logo: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  social_media: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  seo_settings: {
    meta_title?: string;
    meta_description?: string;
    meta_keywords?: string;
  };
  theme_settings: {
    primary_color: string;
    secondary_color: string;
    accent_color: string;
  };
  created_at: string;
  updated_at: string;
}

export interface ResidentialProperty {
  id: string;
  title: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  type: string;
  features: string[];
  image: string;
  description: string;
  price?: number;
  status: 'Available' | 'Sold' | 'Pending';
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}
