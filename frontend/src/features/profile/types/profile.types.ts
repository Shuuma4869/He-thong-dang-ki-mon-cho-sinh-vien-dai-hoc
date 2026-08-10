export interface ApiStudent {
  studentId: string;
  fullName: string;
  className: string;
  major: string;
  maxCredits: number;
}

export interface Student {
  id: string;
  name: string;
  className: string;
  major: string;
  maxCredits: number;
  avatarUrl?: string;
  faculty?: string;
  cohort?: string;
  email?: string;
  phone?: string;
  dob?: string;
  gender?: string;
  cpa?: number;
  gpaPrevious?: number;
  creditsPassed?: number;
  totalCreditsRequired?: number;
}

export function mapApiStudentToStudent(apiStudent: ApiStudent): Student {
  return {
    id: apiStudent.studentId,
    name: apiStudent.fullName,
    className: apiStudent.className,
    major: apiStudent.major,
    maxCredits: apiStudent.maxCredits,
  };
}
