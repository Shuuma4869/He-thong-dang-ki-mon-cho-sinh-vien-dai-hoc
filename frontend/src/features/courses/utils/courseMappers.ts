import {
  BackendDayOfWeek,
  ClassSchedule,
  Course,
  CourseResponse,
  CourseScheduleResponse,
} from '@/features/courses/types/course.types';

const DAY_META: Record<BackendDayOfWeek, { number: number; label: string }> = {
  MONDAY: { number: 2, label: 'Thứ Hai' },
  TUESDAY: { number: 3, label: 'Thứ Ba' },
  WEDNESDAY: { number: 4, label: 'Thứ Tư' },
  THURSDAY: { number: 5, label: 'Thứ Năm' },
  FRIDAY: { number: 6, label: 'Thứ Sáu' },
  SATURDAY: { number: 7, label: 'Thứ Bảy' },
  SUNDAY: { number: 8, label: 'Chủ Nhật' },
};

const PERIODS = [
  { number: 1, start: '07:00', end: '07:45' },
  { number: 2, start: '07:50', end: '08:35' },
  { number: 3, start: '08:40', end: '09:25' },
  { number: 4, start: '09:35', end: '10:20' },
  { number: 5, start: '10:25', end: '11:10' },
  { number: 6, start: '11:15', end: '12:00' },
  { number: 7, start: '13:00', end: '13:45' },
  { number: 8, start: '13:50', end: '14:35' },
  { number: 9, start: '14:40', end: '15:25' },
  { number: 10, start: '15:35', end: '16:20' },
  { number: 11, start: '16:25', end: '17:10' },
  { number: 12, start: '17:15', end: '18:00' },
];

export function mapCourseResponse(response: CourseResponse): Course {
  return {
    id: response.courseId,
    code: response.courseId,
    name: response.courseName,
    lecturer: response.lecturer.fullName,
    lecturerId: response.lecturerId,
    credits: response.credits,
    schedules: response.schedules.map(mapScheduleResponse),
    enrolled: response.currentCapacity,
    capacity: response.maxCapacity,
    status: response.currentCapacity >= response.maxCapacity ? 'Da day' : 'Con cho',
  };
}

export function mapScheduleResponse(response: CourseScheduleResponse): ClassSchedule {
  const startTime = formatTime(response.startTime);
  const endTime = formatTime(response.endTime);
  const periodNumbers = getPeriodNumbers(startTime, endTime);
  const dayMeta = DAY_META[response.dayOfWeek];

  return {
    dayOfWeek: dayMeta.number,
    dayLabel: dayMeta.label,
    periods: `${startTime} - ${endTime}`,
    periodNumbers,
    room: response.room,
    shift: getShift(startTime),
    startTime,
    endTime,
  };
}

function formatTime(time: string): string {
  return time.slice(0, 5);
}

function getPeriodNumbers(startTime: string, endTime: string): number[] {
  const startMinutes = toMinutes(startTime);
  const endMinutes = toMinutes(endTime);

  return PERIODS
    .filter((period) => toMinutes(period.start) < endMinutes && toMinutes(period.end) > startMinutes)
    .map((period) => period.number);
}

function toMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function getShift(startTime: string): string {
  const hour = Number(startTime.slice(0, 2));
  if (hour < 12) return 'Sang';
  if (hour < 18) return 'Chieu';
  return 'Toi';
}
