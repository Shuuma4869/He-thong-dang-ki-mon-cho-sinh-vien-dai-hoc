package vn.edu.phenikaa.courseregistration.exception;

/** Exception nghiệp vụ dùng cho các rule đăng ký sau này. */
public class BusinessException extends RuntimeException {
    public BusinessException(String message) {
        super(message);
    }
}
