package vn.edu.phenikaa.courseregistration.service;

import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;
import vn.edu.phenikaa.courseregistration.exception.StudentNotFoundException;
import vn.edu.phenikaa.courseregistration.model.Course;
import vn.edu.phenikaa.courseregistration.model.Registration;
import vn.edu.phenikaa.courseregistration.model.RegistrationDetail;
import vn.edu.phenikaa.courseregistration.model.enums.RegistrationStatus;
import vn.edu.phenikaa.courseregistration.repository.CourseRepository;
import vn.edu.phenikaa.courseregistration.repository.RegistrationRepository;
import vn.edu.phenikaa.courseregistration.repository.StudentRepository;

/** Service doc thoi khoa bieu tu dang ky active cua sinh vien. */
@Service
public class TimetableService {
    private final StudentRepository studentRepository;
    private final RegistrationRepository registrationRepository;
    private final CourseRepository courseRepository;

    public TimetableService(
            StudentRepository studentRepository,
            RegistrationRepository registrationRepository,
            CourseRepository courseRepository
    ) {
        this.studentRepository = studentRepository;
        this.registrationRepository = registrationRepository;
        this.courseRepository = courseRepository;
    }

    public List<Course> findRegisteredCourses(String studentId) {
        studentRepository.findById(studentId)
                .orElseThrow(() -> new StudentNotFoundException(studentId));

        return registrationRepository.findByStudentId(studentId).stream()
                .filter(registration -> RegistrationStatus.ACTIVE == registration.getStatus())
                .flatMap(registration -> safeDetails(registration).stream())
                .map(RegistrationDetail::getCourseId)
                .map(courseRepository::findById)
                .flatMap(Optional::stream)
                .toList();
    }

    private List<RegistrationDetail> safeDetails(Registration registration) {
        if (registration.getDetails() == null) {
            return List.of();
        }
        return registration.getDetails();
    }
}
