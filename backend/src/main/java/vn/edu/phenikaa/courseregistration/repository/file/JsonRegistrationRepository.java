package vn.edu.phenikaa.courseregistration.repository.file;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Repository;
import vn.edu.phenikaa.courseregistration.model.Registration;
import vn.edu.phenikaa.courseregistration.model.RegistrationDetail;
import vn.edu.phenikaa.courseregistration.model.enums.RegistrationStatus;
import vn.edu.phenikaa.courseregistration.repository.RegistrationRepository;
import vn.edu.phenikaa.courseregistration.utils.JsonFileUtils;

/**
 * JSON repository cho đăng ký học phần.
 */
@Repository
public class JsonRegistrationRepository implements RegistrationRepository {
    private static final String REGISTRATIONS_FILE = "registrations.json";

    private final JsonFileUtils jsonFileUtils;

    public JsonRegistrationRepository(JsonFileUtils jsonFileUtils) {
        this.jsonFileUtils = jsonFileUtils;
    }

    @Override
    public List<Registration> findByStudentId(String studentId) {
        return findAll().stream()
            .filter(registration -> registration.getStudentId().equals(studentId))
            .toList();
    }

    @Override
    public Optional<Registration> findByStudentAndCourse(String studentId, String courseId) {
        return findByStudentId(studentId).stream()
            .filter(registration -> hasCourse(registration, courseId))
            .findFirst();
    }

    @Override
    public void save(Registration registration) {
        List<Registration> registrations = new ArrayList<>(findAll());
        for (int index = 0; index < registrations.size(); index++) {
            if (registrations.get(index).getRegistrationId().equals(registration.getRegistrationId())) {
                registrations.set(index, registration);
                jsonFileUtils.writeList(REGISTRATIONS_FILE, registrations);
                return;
            }
        }

        registrations.add(registration);
        jsonFileUtils.writeList(REGISTRATIONS_FILE, registrations);
    }

    @Override
    public void delete(String studentId, String courseId) {
        List<Registration> registrations = new ArrayList<>(findAll());
        for (Registration registration : registrations) {
            if (registration.getStudentId().equals(studentId)) {
                registration.getDetails().removeIf(detail -> detail.getCourseId().equals(courseId));
                if (registration.getDetails().isEmpty()) {
                    registration.setStatus(RegistrationStatus.CANCELLED);
                }
            }
        }

        jsonFileUtils.writeList(REGISTRATIONS_FILE, registrations);
    }

    private List<Registration> findAll() {
        return jsonFileUtils.readList(REGISTRATIONS_FILE, Registration.class);
    }

    private boolean hasCourse(Registration registration, String courseId) {
        return registration.getDetails().stream()
            .map(RegistrationDetail::getCourseId).anyMatch(courseId::equals);
    }
}
