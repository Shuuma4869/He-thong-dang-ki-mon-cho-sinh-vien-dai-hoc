package vn.edu.phenikaa.courseregistration.data;

import static org.assertj.core.api.Assertions.assertThat;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.junit.jupiter.api.Test;
import vn.edu.phenikaa.courseregistration.model.Course;
import vn.edu.phenikaa.courseregistration.model.Lecturer;
import vn.edu.phenikaa.courseregistration.model.Registration;
import vn.edu.phenikaa.courseregistration.model.Schedule;
import vn.edu.phenikaa.courseregistration.model.Student;
import vn.edu.phenikaa.courseregistration.model.enums.RegistrationStatus;

class DemoDataIntegrityTest {
    private static final String DEMO_STUDENT_ID = "23010690";
    private static final List<String> BASELINE_COURSES = List.of("OOP101", "WEB201", "DSA102", "DBS202", "SE204");

    private final ObjectMapper objectMapper = new ObjectMapper().findAndRegisterModules();

    @Test
    void demoJsonDataContainsFortyCoursesAndLockedDemoStudent() throws Exception {
        List<Student> students = readJson("students.json", new TypeReference<>() {
        });
        List<Lecturer> lecturers = readJson("lecturers.json", new TypeReference<>() {
        });
        List<Course> courses = readJson("courses.json", new TypeReference<>() {
        });
        List<Registration> registrations = readJson("registrations.json", new TypeReference<>() {
        });

        assertThat(courses).hasSize(40);
        assertThat(courses).extracting(Course::getCourseId).doesNotHaveDuplicates();
        assertThat(lecturers).hasSize(10);

        Set<String> lecturerIds = lecturers.stream().map(Lecturer::getId).collect(Collectors.toSet());
        assertThat(courses).allSatisfy(course -> {
            assertThat(course.getLecturerId()).isIn(lecturerIds);
            assertThat(course.getCredits()).isBetween(1, 5);
            assertThat(course.getCurrentCapacity()).isLessThanOrEqualTo(course.getMaxCapacity());
            assertThat(course.getSchedules()).isNotEmpty();
            assertThat(course.getSchedules()).allSatisfy(schedule -> {
                assertThat(schedule.getDayOfWeek()).isNotNull();
                assertThat(schedule.getStartTime()).isBefore(schedule.getEndTime());
                assertThat(schedule.getRoom()).isNotBlank();
            });
        });

        Student demoStudent = students.stream()
            .filter(student -> DEMO_STUDENT_ID.equals(student.getId()))
            .findFirst()
            .orElseThrow();

        assertThat(demoStudent.getFullName()).isEqualTo("Nguyễn Trọng Tuấn");
        assertThat(demoStudent.getClassName()).isEqualTo("CNTT7 - K17");
        assertThat(demoStudent.getMajor()).isEqualTo("Công nghệ thông tin");
        assertThat(demoStudent.getMaxCredits()).isEqualTo(18);

        Map<String, Course> courseById = courses.stream()
            .collect(Collectors.toMap(Course::getCourseId, Function.identity()));
        Registration demoRegistration = registrations.stream()
            .filter(registration -> DEMO_STUDENT_ID.equals(registration.getStudentId()))
            .filter(registration -> registration.getStatus() == RegistrationStatus.ACTIVE)
            .findFirst()
            .orElseThrow();

        List<String> registeredCourseIds = demoRegistration.getDetails().stream()
            .map(detail -> detail.getCourseId())
            .toList();
        assertThat(registeredCourseIds).containsExactlyElementsOf(BASELINE_COURSES);

        int totalCredits = registeredCourseIds.stream()
            .map(courseById::get)
            .mapToInt(Course::getCredits)
            .sum();

        assertThat(totalCredits).isEqualTo(15);
        assertThatNoScheduleConflict(registeredCourseIds, courseById);

        assertThat(courseById.get("AI301").getCurrentCapacity()).isEqualTo(courseById.get("AI301").getMaxCapacity());
        assertThat(hasConflict(courseById.get("NET203"), registeredCourseIds, courseById)).isTrue();
        assertThat(totalCredits + courseById.get("CLOUD301").getCredits()).isGreaterThan(demoStudent.getMaxCredits());
        assertThat(totalCredits + courseById.get("UX205").getCredits()).isLessThanOrEqualTo(demoStudent.getMaxCredits());
        assertThat(hasConflict(courseById.get("UX205"), registeredCourseIds, courseById)).isFalse();
    }

    private <T> T readJson(String fileName, TypeReference<T> typeReference) throws Exception {
        Path dataPath = resolveDataDirectory().resolve(fileName);
        return objectMapper.readValue(dataPath.toFile(), typeReference);
    }

    private Path resolveDataDirectory() {
        Path rootData = Path.of("data");
        if (Files.isDirectory(rootData)) {
            return rootData;
        }
        return Path.of("..", "data");
    }

    private static void assertThatNoScheduleConflict(List<String> registeredCourseIds, Map<String, Course> courseById) {
        Map<String, Course> visited = new HashMap<>();
        for (String courseId : registeredCourseIds) {
            Course course = courseById.get(courseId);
            assertThat(course).as("course " + courseId).isNotNull();
            assertThat(hasConflict(course, visited.keySet().stream().toList(), visited)).isFalse();
            visited.put(courseId, course);
        }
    }

    private static boolean hasConflict(
        Course requestedCourse,
        List<String> registeredCourseIds,
        Map<String, Course> courseById
    ) {
        for (String courseId : registeredCourseIds) {
            Course registeredCourse = courseById.get(courseId);
            if (registeredCourse == null) {
                continue;
            }
            for (Schedule requestedSchedule : requestedCourse.getSchedules()) {
                for (Schedule registeredSchedule : registeredCourse.getSchedules()) {
                    if (isOverlapping(requestedSchedule, registeredSchedule)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    private static boolean isOverlapping(Schedule left, Schedule right) {
        if (left.getDayOfWeek() != right.getDayOfWeek()) {
            return false;
        }
        LocalTime leftStart = left.getStartTime();
        LocalTime leftEnd = left.getEndTime();
        LocalTime rightStart = right.getStartTime();
        LocalTime rightEnd = right.getEndTime();
        return leftStart.isBefore(rightEnd) && leftEnd.isAfter(rightStart);
    }
}
