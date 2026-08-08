import { requestApi } from '@/shared/api/httpClient';
import { API_ENDPOINTS } from '@/shared/constants/apiEndpoints';
import { ApiStudent, mapApiStudentToStudent } from '@/features/profile/types/profile.types';
import { LoginRequest, LoginResponse } from '@/features/auth/types/auth.types';

export const authApi = {
  async login(request: LoginRequest): Promise<LoginResponse> {
    const student = await requestApi<ApiStudent>(API_ENDPOINTS.AUTH_LOGIN, {
      method: 'POST',
      body: JSON.stringify(request),
    });

    return mapApiStudentToStudent(student);
  },
};
