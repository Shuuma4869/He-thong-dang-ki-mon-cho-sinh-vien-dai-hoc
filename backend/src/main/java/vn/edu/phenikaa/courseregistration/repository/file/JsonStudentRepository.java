package vn.edu.phenikaa.courseregistration.repository.file;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Repository;
import vn.edu.phenikaa.courseregistration.model.Student;
import vn.edu.phenikaa.courseregistration.repository.StudentRepository;
import vn.edu.phenikaa.courseregistration.utils.JsonFileUtils;

/**
 * JSON repository cho sinh viên.
 */
@Repository
public class JsonStudentRepository implements StudentRepository {
    private static final String STUDENTS_FILE = "students.json";

    private final JsonFileUtils jsonFileUtils;

    public JsonStudentRepository(JsonFileUtils jsonFileUtils) {
        this.jsonFileUtils = jsonFileUtils;
    }

    @Override
    public Optional<Student> findById(String studentId) {
        return findAll().stream()
            .filter(student -> student.getId().equals(studentId))
            .findFirst();
    }

    @Override
    public List<Student> findAll() {
        return jsonFileUtils.readList(STUDENTS_FILE, Student.class);
    }

    @Override
    public void save(Student student) {
        List<Student> students = new ArrayList<>(findAll());
        for (int index = 0; index < students.size(); index++) {
            if (students.get(index).getId().equals(student.getId())) {
                students.set(index, student);
                jsonFileUtils.writeList(STUDENTS_FILE, students);
                return;
            }
        }

        students.add(student);
        jsonFileUtils.writeList(STUDENTS_FILE, students);
    }
}
