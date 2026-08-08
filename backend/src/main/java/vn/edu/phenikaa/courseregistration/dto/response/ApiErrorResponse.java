package vn.edu.phenikaa.courseregistration.dto.response;

import java.time.Instant;

/**
 * Response chuẩn cho lỗi REST API.
 */
public class ApiErrorResponse {
    private boolean success;
    private String message;
    private String errorCode;
    private Instant timestamp;

    public ApiErrorResponse() {
    }

    public ApiErrorResponse(boolean success, String message, String errorCode, Instant timestamp) {
        this.success = success;
        this.message = message;
        this.errorCode = errorCode;
        this.timestamp = timestamp;
    }

    public static ApiErrorResponse of(String message, String errorCode) {
        return new ApiErrorResponse(false, message, errorCode, Instant.now());
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getErrorCode() {
        return errorCode;
    }

    public void setErrorCode(String errorCode) {
        this.errorCode = errorCode;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }
}
