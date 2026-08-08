package vn.edu.phenikaa.courseregistration.interfaces;

import vn.edu.phenikaa.courseregistration.exception.BusinessException;
import vn.edu.phenikaa.courseregistration.validator.context.RegistrationValidationContext;

/**
 * Contract dùng chung cho các validator kiểm tra một quy tắc đăng ký môn học.
 *
 * <p>Nếu dữ liệu đăng ký không hợp lệ, validator phải ném {@link BusinessException}
 * phù hợp. Nếu hợp lệ, validator return bình thường. Contract không trả boolean
 * hoặc chuỗi lỗi.</p>
 */
public interface CourseValidator {
    /**
     * Kiểm tra context đăng ký học phần theo một rule cụ thể.
     *
     * @param context ngữ cảnh đăng ký đã được service chuẩn bị.
     */
    void validate(RegistrationValidationContext context);
}
