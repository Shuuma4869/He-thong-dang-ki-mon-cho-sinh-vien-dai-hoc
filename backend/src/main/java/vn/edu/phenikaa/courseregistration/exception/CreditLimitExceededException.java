package vn.edu.phenikaa.courseregistration.exception;

/**
 * Lỗi khi tổng số tín chỉ đăng ký vượt giới hạn của sinh viên.
 */
public class CreditLimitExceededException extends BusinessException {
    public static final String ERROR_CODE = "CREDIT_LIMIT_EXCEEDED";

    public CreditLimitExceededException(int totalCredits, int maxCredits) {
        super(ERROR_CODE, "Tổng số tín chỉ " + totalCredits + " vượt giới hạn " + maxCredits);
    }
}
