import type { User as SupabaseUser } from '@supabase/supabase-js'

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: Date;
}

// Extend Supabase User type
export type AuthUser = SupabaseUser

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  title: string;
  description: string;
  options: PollOption[];
  totalVotes: number;
  createdAt: Date;
  endsAt?: Date;
  isActive: boolean;
  allowMultipleVotes: boolean;
  createdBy: User;
  hasVoted?: boolean;
  userVotes?: string[]; // Option IDs user has voted for
}

export interface CreatePollData {
  title: string;
  description: string;
  options: string[];
  endsAt?: Date;
  allowMultipleVotes: boolean;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
