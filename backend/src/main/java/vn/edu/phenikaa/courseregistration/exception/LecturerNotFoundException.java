package vn.edu.phenikaa.courseregistration.exception;

/**
 * Lỗi khi học phần tham chiếu tới giảng viên không tồn tại.
 */
public class LecturerNotFoundException extends BusinessException {
    public static final String ERROR_CODE = "LECTURER_NOT_FOUND";

    public LecturerNotFoundException(String lecturerId) {
        super(ERROR_CODE, "Khong tim thay giang vien: " + lecturerId);
    }

    public LecturerNotFoundException(String lecturerId, String courseId) {
        super(ERROR_CODE, "Khong tim thay giang vien " + lecturerId + " cho hoc phan: " + courseId);
    }
}
