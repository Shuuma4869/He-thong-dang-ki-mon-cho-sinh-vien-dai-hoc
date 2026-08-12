package vn.edu.phenikaa.courseregistration.repository.file;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Repository;
import vn.edu.phenikaa.courseregistration.model.Lecturer;
import vn.edu.phenikaa.courseregistration.repository.LecturerRepository;
import vn.edu.phenikaa.courseregistration.utils.JsonFileUtils;

/**
 * JSON repository cho giảng viên.
 */
@Repository
public class JsonLecturerRepository implements LecturerRepository {
    private static final String LECTURERS_FILE = "lecturers.json";

    private final JsonFileUtils jsonFileUtils;

    public JsonLecturerRepository(JsonFileUtils jsonFileUtils) {
        this.jsonFileUtils = jsonFileUtils;
    }

    @Override
    public Optional<Lecturer> findById(String lecturerId) {
        return findAll().stream()
            .filter(lecturer -> lecturer.getId().equalsIgnoreCase(lecturerId))
            .findFirst();
    }

    @Override
    public List<Lecturer> findAll() {
        return jsonFileUtils.readList(LECTURERS_FILE, Lecturer.class);
    }

    @Override
    public void save(Lecturer lecturer) {
        List<Lecturer> lecturers = new ArrayList<>(findAll());
        for (int index = 0; index < lecturers.size(); index++) {
            if (lecturers.get(index).getId().equalsIgnoreCase(lecturer.getId())) {
                lecturers.set(index, lecturer);
                jsonFileUtils.writeList(LECTURERS_FILE, lecturers);
                return;
            }
        }

        lecturers.add(lecturer);
        jsonFileUtils.writeList(LECTURERS_FILE, lecturers);
    }
}
