package vn.edu.phenikaa.courseregistration.repository.file;

import static org.assertj.core.api.Assertions.assertThat;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.nio.file.Path;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import vn.edu.phenikaa.courseregistration.model.Lecturer;
import vn.edu.phenikaa.courseregistration.utils.JsonFileUtils;

class JsonLecturerRepositoryTest {
    @TempDir
    Path dataDirectory;

    @Test
    void saveAndFindByIdReturnsLecturer() {
        JsonLecturerRepository repository = createRepository();
        Lecturer lecturer = new Lecturer("GV001", "Tran Thi B", "Khoa Cong nghe thong tin");

        repository.save(lecturer);

        assertThat(repository.findById("GV001"))
            .get()
            .extracting(Lecturer::getFullName)
            .isEqualTo("Tran Thi B");
    }

    private JsonLecturerRepository createRepository() {
        JsonFileUtils jsonFileUtils = new JsonFileUtils(new ObjectMapper().findAndRegisterModules(), dataDirectory.toString());
        return new JsonLecturerRepository(jsonFileUtils);
    }
}
