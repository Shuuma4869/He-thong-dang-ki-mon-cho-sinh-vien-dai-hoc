import { useCallback, useEffect, useState } from 'react';
import { Course } from '@/features/courses/types/course.types';
import { courseApi } from '@/features/courses/api/courseApi';
import { timetableApi } from '@/features/timetable/api/timetableApi';
import { getApiErrorMessage } from '@/shared/api/apiError';

interface DashboardDataState {
  openCourses: Course[];
  timetableCourses: Course[];
  isLoading: boolean;
  errorMessage: string;
  refresh: () => Promise<void>;
}

export function useDashboardData(studentId: string): DashboardDataState {
  const [openCourses, setOpenCourses] = useState<Course[]>([]);
  const [timetableCourses, setTimetableCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const loadDashboardData = useCallback(async () => {
    if (!studentId) {
      setOpenCourses([]);
      setTimetableCourses([]);
      setErrorMessage('');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const [loadedCourses, loadedTimetable] = await Promise.all([
        courseApi.getCourses(),
        timetableApi.getTimetable(studentId),
      ]);

      setOpenCourses(loadedCourses);
      setTimetableCourses(loadedTimetable);
    } catch (error) {
      setOpenCourses([]);
      setTimetableCourses([]);
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      if (!studentId) {
        setOpenCourses([]);
        setTimetableCourses([]);
        setErrorMessage('');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setErrorMessage('');

      try {
        const [loadedCourses, loadedTimetable] = await Promise.all([
          courseApi.getCourses(),
          timetableApi.getTimetable(studentId),
        ]);

        if (isMounted) {
          setOpenCourses(loadedCourses);
          setTimetableCourses(loadedTimetable);
        }
      } catch (error) {
        if (isMounted) {
          setOpenCourses([]);
          setTimetableCourses([]);
          setErrorMessage(getApiErrorMessage(error));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      isMounted = false;
    };
  }, [studentId]);

  return {
    openCourses,
    timetableCourses,
    isLoading,
    errorMessage,
    refresh: loadDashboardData,
  };
}
