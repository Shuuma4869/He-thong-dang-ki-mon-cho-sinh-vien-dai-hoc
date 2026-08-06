import { Student } from '@/features/profile/types/profile.types';

export interface LoginRequest {
  studentId: string;
  password: string;
}

export type LoginResponse = Student;

export const authApi = {
  async login(_request: LoginRequest): Promise<LoginResponse> {
    throw new Error('API xác thực là skeleton, chưa kết nối backend.');
  },
};
