import { Student } from '@/features/profile/types/profile.types';

export const profileApi = {
  async getCurrentStudent(): Promise<Student> {
    throw new Error('API hồ sơ là skeleton, chưa kết nối backend.');
  },
};
