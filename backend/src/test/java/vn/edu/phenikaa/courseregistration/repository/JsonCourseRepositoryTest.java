package vn.edu.phenikaa.courseregistration.repository.file;

import static org.assertj.core.api.Assertions.assertThat;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.nio.file.Path;
import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import vn.edu.phenikaa.courseregistration.model.Course;
import vn.edu.phenikaa.courseregistration.model.Schedule;
import vn.edu.phenikaa.courseregistration.utils.JsonFileUtils;

class JsonCourseRepositoryTest {
    @TempDir
    Path dataDirectory;

    @Test
    void findAllReturnsEmptyListWhenFileDoesNotExist() {
        JsonCourseRepository repository = createRepository();

        assertThat(repository.findAll()).isEmpty();
    }

    @Test
    void saveAndFindByIdPreservesSchedule() {
        JsonCourseRepository repository = createRepository();
        Course course = oopCourse();

        repository.save(course);

        assertThat(repository.findById("OOP101"))
            .get()
            .satisfies(found -> {
                assertThat(found.getCourseName()).isEqualTo("Lap trinh huong doi tuong");
                assertThat(found.getSchedules()).hasSize(1);
                assertThat(found.getSchedules().getFirst().getDayOfWeek()).isEqualTo(DayOfWeek.MONDAY);
                assertThat(found.getSchedules().getFirst().getStartTime()).isEqualTo(LocalTime.of(7, 30));
            });
    }

    @Test
    void searchMatchesCourseIdAndCourseName() {
        JsonCourseRepository repository = createRepository();
        repository.save(oopCourse());
        repository.save(new Course("DBI101", "Co so du lieu", 3, "GV002", 50, 0, List.of()));

        assertThat(repository.search("oop")).extracting(Course::getCourseId).containsExactly("OOP101");
        assertThat(repository.search("du lieu")).extracting(Course::getCourseId).containsExactly("DBI101");
        assertThat(repository.search("khong co")).isEmpty();
    }

    @Test
    void searchReturnsAllCoursesWhenKeywordIsBlank() {
        JsonCourseRepository repository = createRepository();
        repository.save(oopCourse());
        repository.save(new Course("DBI101", "Co so du lieu", 3, "GV002", 50, 0, List.of()));

        assertThat(repository.search("   "))
            .extracting(Course::getCourseId)
            .containsExactly("OOP101", "DBI101");
    }

    private Course oopCourse() {
        return new Course(
            "OOP101",
            "Lap trinh huong doi tuong",
            3,
            "GV001",
            60,
            20,
            List.of(new Schedule(DayOfWeek.MONDAY, LocalTime.of(7, 30), LocalTime.of(9, 30), "A101"))
        );
    }

    private JsonCourseRepository createRepository() {
        JsonFileUtils jsonFileUtils = new JsonFileUtils(new ObjectMapper().findAndRegisterModules(), dataDirectory.toString());
        return new JsonCourseRepository(jsonFileUtils);
    }
}
