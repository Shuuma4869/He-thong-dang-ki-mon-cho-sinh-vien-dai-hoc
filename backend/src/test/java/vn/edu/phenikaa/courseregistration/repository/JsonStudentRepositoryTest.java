package vn.edu.phenikaa.courseregistration.repository.file;

import static org.assertj.core.api.Assertions.assertThat;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.nio.file.Path;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import vn.edu.phenikaa.courseregistration.model.Student;
import vn.edu.phenikaa.courseregistration.utils.JsonFileUtils;

class JsonStudentRepositoryTest {
    @TempDir
    Path dataDirectory;

    @Test
    void findAllReturnsEmptyListWhenFileDoesNotExist() {
        JsonStudentRepository repository = createRepository();

        assertThat(repository.findAll()).isEmpty();
    }

    @Test
    void saveCreatesAndUpdatesStudent() {
        JsonStudentRepository repository = createRepository();
        Student student = new Student("SV001", "Nguyen Van A", "CNTT1", "Cong nghe thong tin", 18);

        repository.save(student);

        assertThat(repository.findById("SV001"))
            .get()
            .extracting(Student::getFullName)
            .isEqualTo("Nguyen Van A");

        student.setFullName("Nguyen Van A Updated");
        repository.save(student);

        assertThat(repository.findAll()).hasSize(1);
        assertThat(repository.findById("SV001"))
            .get()
            .extracting(Student::getFullName)
            .isEqualTo("Nguyen Van A Updated");
    }

    private JsonStudentRepository createRepository() {
        JsonFileUtils jsonFileUtils = new JsonFileUtils(new ObjectMapper().findAndRegisterModules(), dataDirectory.toString());
        return new JsonStudentRepository(jsonFileUtils);
    }
}
