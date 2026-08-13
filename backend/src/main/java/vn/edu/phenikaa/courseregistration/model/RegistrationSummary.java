package vn.edu.phenikaa.courseregistration.model;

import java.util.List;

/**
 * Composition cho phieu dang ky active kem danh sach hoc phan da resolve.
 */
public record RegistrationSummary(Registration registration, List<CourseWithLecturer> courses) {
}
