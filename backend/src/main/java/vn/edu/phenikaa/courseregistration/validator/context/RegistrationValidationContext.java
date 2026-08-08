package vn.edu.phenikaa.courseregistration.validator.context;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import vn.edu.phenikaa.courseregistration.exception.CourseNotFoundException;
import vn.edu.phenikaa.courseregistration.model.Course;
import vn.edu.phenikaa.courseregistration.model.Student;

/**
 * Ngữ cảnh dữ liệu dùng cho chuỗi validator đăng ký học phần.
 *
 * <p>Context chỉ mang dữ liệu đã được service chuẩn bị trước. Lớp này không đọc
 * repository, không đọc JSON, không chứa ObjectMapper và không là Spring bean.</p>
 */
public final class RegistrationValidationContext {
    private final Student student;
    private final String requestedCourseId;
    private final Optional<Course> requestedCourse;
    private final List<Course> registeredCourses;

    public RegistrationValidationContext(
            Student student,
            String requestedCourseId,
            Optional<Course> requestedCourse,
            List<Course> registeredCourses
    ) {
        this.student = Objects.requireNonNull(student, "student must not be null");
        if (requestedCourseId == null || requestedCourseId.isBlank()) {
            throw new IllegalArgumentException("requestedCourseId must not be blank");
        }
        this.requestedCourseId = requestedCourseId;
        this.requestedCourse = Objects.requireNonNull(requestedCourse, "requestedCourse must not be null");
        this.registeredCourses = List.copyOf(
                Objects.requireNonNull(registeredCourses, "registeredCourses must not be null")
        );
    }

    public Student getStudent() {
        return student;
    }

    public String getRequestedCourseId() {
        return requestedCourseId;
    }

    public Optional<Course> getRequestedCourse() {
        return requestedCourse;
    }

    public List<Course> getRegisteredCourses() {
        return registeredCourses;
    }

    public Course requireRequestedCourse() {
        return requestedCourse.orElseThrow(() -> new CourseNotFoundException(requestedCourseId));
    }
}
