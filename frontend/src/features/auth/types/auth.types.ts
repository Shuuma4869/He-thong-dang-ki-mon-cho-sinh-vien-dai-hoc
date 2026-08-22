import { Student } from '@/features/profile/types/profile.types';

export interface LoginFormState {
  studentId: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginRequest {
  studentId: string;
  password: string;
}

export type LoginResponse = Student;
