package vn.edu.phenikaa.courseregistration.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import vn.edu.phenikaa.courseregistration.dto.response.ApiErrorResponse;

/**
 * Bộ xử lý lỗi dùng chung cho REST API.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {
    private static final String INTERNAL_ERROR_CODE = "INTERNAL_SERVER_ERROR";
    private static final String VALIDATION_ERROR_CODE = "VALIDATION_ERROR";

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ApiErrorResponse> handleBusinessException(BusinessException exception) {
        return ResponseEntity
                .badRequest()
                .body(ApiErrorResponse.of(exception.getMessage(), exception.getErrorCode()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleValidationException(MethodArgumentNotValidException exception) {
        String message = exception.getBindingResult().getFieldErrors().stream()
                .findFirst()
                .map(fieldError -> fieldError.getDefaultMessage())
                .orElse("Du lieu request khong hop le.");

        return ResponseEntity
                .badRequest()
                .body(ApiErrorResponse.of(message, VALIDATION_ERROR_CODE));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleUnexpectedException(Exception exception) {
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiErrorResponse.of("Lỗi hệ thống. Vui lòng thử lại sau.", INTERNAL_ERROR_CODE));
    }
}
