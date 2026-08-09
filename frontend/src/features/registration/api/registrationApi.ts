import { mapCourseResponse } from '@/features/courses/utils/courseMappers';
import {
  RegistrationRequest,
  RegistrationResponse,
  RegistrationSummary,
} from '@/features/registration/types/registration.types';
import { requestApi } from '@/shared/api/httpClient';
import { API_ENDPOINTS } from '@/shared/constants/apiEndpoints';

export const registrationApi = {
  async getRegistrations(studentId: string): Promise<RegistrationSummary> {
    const response = await requestApi<RegistrationResponse>(API_ENDPOINTS.REGISTRATIONS(studentId));
    return mapRegistrationResponse(response);
  },

  async registerCourse(studentId: string, courseId: string): Promise<RegistrationSummary> {
    const request: RegistrationRequest = { courseId };
    const response = await requestApi<RegistrationResponse>(API_ENDPOINTS.REGISTER_COURSE(studentId), {
      method: 'POST',
      body: JSON.stringify(request),
    });

    return mapRegistrationResponse(response);
  },

  async cancelCourse(studentId: string, courseId: string): Promise<RegistrationSummary> {
    const response = await requestApi<RegistrationResponse>(
      API_ENDPOINTS.CANCEL_REGISTRATION(studentId, courseId),
      { method: 'DELETE' }
    );

    return mapRegistrationResponse(response);
  },
};

function mapRegistrationResponse(response: RegistrationResponse): RegistrationSummary {
  return {
    registrationId: response.registrationId,
    studentId: response.studentId,
    status: response.status,
    registeredAt: response.registeredAt,
    courses: response.courses.map(mapCourseResponse),
    totalCredits: response.totalCredits,
  };
}
