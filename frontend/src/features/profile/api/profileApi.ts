import { requestApi } from '@/shared/api/httpClient';
import { API_ENDPOINTS } from '@/shared/constants/apiEndpoints';
import { ApiStudent, mapApiStudentToStudent, Student } from '@/features/profile/types/profile.types';

export const profileApi = {
  async getStudentById(studentId: string): Promise<Student> {
    const student = await requestApi<ApiStudent>(API_ENDPOINTS.STUDENT_BY_ID(studentId));
    return mapApiStudentToStudent(student);
  },
};
