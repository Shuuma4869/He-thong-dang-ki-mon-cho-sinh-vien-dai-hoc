package vn.edu.phenikaa.courseregistration.exception;

/**
 * Lỗi khi lịch học của học phần mới bị trùng với học phần đã đăng ký.
 */
public class ScheduleConflictException extends BusinessException {
    public static final String ERROR_CODE = "SCHEDULE_CONFLICT";

    public ScheduleConflictException(String courseId, String conflictedCourseId) {
        super(ERROR_CODE, "Học phần " + courseId + " bị trùng lịch với học phần " + conflictedCourseId);
    }
}
