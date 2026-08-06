package vn.edu.phenikaa.courseregistration.utils;

import java.nio.file.Path;

/** Tiện ích đường dẫn cho JSON File IO. */
public final class FilePathUtils {
    private FilePathUtils() {
    }

    public static Path dataPath(String fileName) {
        return Path.of("..", "data", fileName).normalize();
    }
}
