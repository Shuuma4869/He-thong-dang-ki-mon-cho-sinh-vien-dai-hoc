package vn.edu.phenikaa.courseregistration.repository.file;

import java.util.List;
import org.springframework.stereotype.Repository;
import vn.edu.phenikaa.courseregistration.model.Course;
import vn.edu.phenikaa.courseregistration.repository.JsonFileRepository;
import vn.edu.phenikaa.courseregistration.utils.JsonFileUtils;

/** Repository JSON skeleton cho học phần; chỉ phụ trách đọc/ghi file qua JsonFileUtils. */
@Repository
public class FileCourseRepository implements JsonFileRepository<Course> {
    private static final String COURSES_FILE = "courses.json";

    private final JsonFileUtils jsonFileUtils;

    public FileCourseRepository(JsonFileUtils jsonFileUtils) {
        this.jsonFileUtils = jsonFileUtils;
    }

    @Override
    public List<Course> findAll() {
        return jsonFileUtils.readList(COURSES_FILE, Course.class);
    }

    @Override
    public void saveAll(List<Course> items) {
        jsonFileUtils.writeList(COURSES_FILE, items);
    }
}
