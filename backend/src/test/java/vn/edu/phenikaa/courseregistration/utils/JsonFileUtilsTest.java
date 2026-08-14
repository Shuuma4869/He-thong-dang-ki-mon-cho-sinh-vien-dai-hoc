package vn.edu.phenikaa.courseregistration.utils;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import vn.edu.phenikaa.courseregistration.model.Student;

class JsonFileUtilsTest {
    @TempDir
    Path dataDirectory;

    @Test
    void readListReturnsEmptyListWhenFileDoesNotExist() {
        JsonFileUtils jsonFileUtils = jsonFileUtils();

        assertThat(jsonFileUtils.readList("students.json", Student.class)).isEmpty();
    }

    @Test
    void writeListAndReadListRoundTripUtf8Data() {
        JsonFileUtils jsonFileUtils = jsonFileUtils();
        Student student = new Student("SV001", "Nguyễn Minh An", "CNTT-K16A", "Công nghệ thông tin", 10);

        jsonFileUtils.writeList("students.json", List.of(student));

        assertThat(jsonFileUtils.readList("students.json", Student.class))
            .singleElement()
            .satisfies(found -> {
                assertThat(found.getId()).isEqualTo("SV001");
                assertThat(found.getFullName()).isEqualTo("Nguyễn Minh An");
                assertThat(found.getMaxCredits()).isEqualTo(10);
            });
    }

    @Test
    void writeListTreatsNullAsEmptyArray() {
        JsonFileUtils jsonFileUtils = jsonFileUtils();

        jsonFileUtils.writeList("students.json", null);

        assertThat(jsonFileUtils.readList("students.json", Student.class)).isEmpty();
    }

    @Test
    void readListReturnsEmptyListForEmptyArray() throws Exception {
        Files.writeString(dataDirectory.resolve("students.json"), "[]", StandardCharsets.UTF_8);
        JsonFileUtils jsonFileUtils = jsonFileUtils();

        assertThat(jsonFileUtils.readList("students.json", Student.class)).isEmpty();
    }

    @Test
    void readListThrowsWhenJsonIsMalformed() throws Exception {
        Files.writeString(dataDirectory.resolve("students.json"), "[", StandardCharsets.UTF_8);
        JsonFileUtils jsonFileUtils = jsonFileUtils();

        assertThatThrownBy(() -> jsonFileUtils.readList("students.json", Student.class))
            .isInstanceOf(IllegalStateException.class)
            .hasMessageContaining("students.json");
    }

    @Test
    void rejectsPathTraversalFileName() {
        JsonFileUtils jsonFileUtils = jsonFileUtils();

        assertThatThrownBy(() -> jsonFileUtils.readList("../students.json", Student.class))
            .isInstanceOf(IllegalArgumentException.class);
    }

    private JsonFileUtils jsonFileUtils() {
        return new JsonFileUtils(new ObjectMapper().findAndRegisterModules(), dataDirectory.toString());
    }
}
