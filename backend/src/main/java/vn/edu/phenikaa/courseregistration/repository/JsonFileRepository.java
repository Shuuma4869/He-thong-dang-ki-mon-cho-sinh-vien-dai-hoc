package vn.edu.phenikaa.courseregistration.repository;

import java.util.List;

/** Repository abstraction cho lưu trữ JSON File IO. */
public interface JsonFileRepository<T> {
    List<T> findAll();

    void saveAll(List<T> items);
}
