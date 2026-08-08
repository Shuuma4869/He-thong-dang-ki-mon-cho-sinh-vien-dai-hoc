package vn.edu.phenikaa.courseregistration.exception;

/**
 * Exception chuẩn cho lỗi nghiệp vụ có thể hiển thị qua REST API.
 */
public class BusinessException extends RuntimeException {
    private final String errorCode;

    public BusinessException(String errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }

    public BusinessException(String errorCode, String message, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
    }

    public String getErrorCode() {
        return errorCode;
    }
}
