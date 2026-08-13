package vn.edu.phenikaa.courseregistration.exception;

/**
 * Lỗi khi không tìm thấy đăng ký học phần cần thao tác.
 */
public class RegistrationNotFoundException extends BusinessException {
    public static final String ERROR_CODE = "REGISTRATION_NOT_FOUND";

    public RegistrationNotFoundException(String studentId, String courseId) {
        super(ERROR_CODE, "Không tìm thấy đăng ký của sinh viên " + studentId + " với học phần " + courseId);
    }
}
