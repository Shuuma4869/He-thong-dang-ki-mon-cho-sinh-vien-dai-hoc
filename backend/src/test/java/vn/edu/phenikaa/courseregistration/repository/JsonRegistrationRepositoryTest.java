package vn.edu.phenikaa.courseregistration.repository.file;

import static org.assertj.core.api.Assertions.assertThat;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import vn.edu.phenikaa.courseregistration.model.Registration;
import vn.edu.phenikaa.courseregistration.model.RegistrationDetail;
import vn.edu.phenikaa.courseregistration.model.enums.RegistrationStatus;
import vn.edu.phenikaa.courseregistration.utils.JsonFileUtils;

class JsonRegistrationRepositoryTest {
    @TempDir
    Path dataDirectory;

    @Test
    void findByStudentIdReturnsStudentRegistrations() {
        JsonRegistrationRepository repository = createRepository();
        repository.save(registration("REG001", "SV001", "OOP101"));
        repository.save(registration("REG002", "SV002", "DBI101"));

        assertThat(repository.findByStudentId("SV001"))
            .extracting(Registration::getRegistrationId)
            .containsExactly("REG001");
    }

    @Test
    void findByStudentAndCourseReturnsMatchedRegistration() {
        JsonRegistrationRepository repository = createRepository();
        repository.save(registration("REG001", "SV001", "OOP101"));

        assertThat(repository.findByStudentAndCourse("SV001", "OOP101"))
            .get()
            .extracting(Registration::getRegistrationId)
            .isEqualTo("REG001");
    }

    @Test
    void saveUpdatesExistingRegistration() {
        JsonRegistrationRepository repository = createRepository();
        Registration registration = registration("REG001", "SV001", "OOP101");
        repository.save(registration);

        registration.setDetails(List.of(new RegistrationDetail("DBI101")));
        repository.save(registration);

        assertThat(repository.findByStudentAndCourse("SV001", "DBI101")).isPresent();
        assertThat(repository.findByStudentAndCourse("SV001", "OOP101")).isEmpty();
    }

    @Test
    void deleteRemovesCourseDetailAndCancelsEmptyRegistration() {
        JsonRegistrationRepository repository = createRepository();
        repository.save(registration("REG001", "SV001", "OOP101"));

        repository.delete("SV001", "OOP101");

        Registration registration = repository.findByStudentId("SV001").getFirst();
        assertThat(registration.getDetails()).isEmpty();
        assertThat(registration.getStatus()).isEqualTo(RegistrationStatus.CANCELLED);
    }

    private Registration registration(String registrationId, String studentId, String courseId) {
        return new Registration(
            registrationId,
            studentId,
            RegistrationStatus.ACTIVE,
            LocalDateTime.of(2026, 8, 8, 19, 40),
            List.of(new RegistrationDetail(courseId))
        );
    }

    private JsonRegistrationRepository createRepository() {
        JsonFileUtils jsonFileUtils = new JsonFileUtils(new ObjectMapper().findAndRegisterModules(), dataDirectory.toString());
        return new JsonRegistrationRepository(jsonFileUtils);
    }
}
