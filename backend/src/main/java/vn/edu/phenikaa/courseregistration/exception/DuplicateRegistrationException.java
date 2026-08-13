package vn.edu.phenikaa.courseregistration.exception;

/**
 * Lỗi khi sinh viên đăng ký trùng học phần đã có.
 */
public class DuplicateRegistrationException extends BusinessException {
    public static final String ERROR_CODE = "DUPLICATE_REGISTRATION";

    public DuplicateRegistrationException(String courseId) {
        super(ERROR_CODE, "Sinh viên đã đăng ký học phần: " + courseId);
    }
}
