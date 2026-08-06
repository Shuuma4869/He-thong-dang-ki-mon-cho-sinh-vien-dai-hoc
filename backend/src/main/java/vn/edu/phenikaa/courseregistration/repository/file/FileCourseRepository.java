package vn.edu.phenikaa.courseregistration.repository.file;

import java.util.Collections;
import java.util.List;
import org.springframework.stereotype.Repository;
import vn.edu.phenikaa.courseregistration.model.Course;
import vn.edu.phenikaa.courseregistration.repository.JsonFileRepository;

/** Repository file skeleton; chưa đọc/ghi JSON thật trong starter. */
@Repository
public class FileCourseRepository implements JsonFileRepository<Course> {
    @Override
    public List<Course> findAll() {
        return Collections.emptyList();
    }

    @Override
    public void saveAll(List<Course> items) {
        // TODO: Cài đặt ghi JSON sau khi khóa schema.
    }
}
