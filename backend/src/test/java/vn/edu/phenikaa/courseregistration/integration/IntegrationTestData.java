package vn.edu.phenikaa.courseregistration.integration;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;

final class IntegrationTestData {
    private static final String[] FILE_NAMES = {
        "courses.json",
        "lecturers.json",
        "students.json",
        "registrations.json"
    };

    private IntegrationTestData() {
    }

    static void reset(Path dataDirectory) throws IOException {
        Files.createDirectories(dataDirectory);
        for (String fileName : FILE_NAMES) {
            copyFixture(dataDirectory, fileName);
        }
    }

    private static void copyFixture(Path dataDirectory, String fileName) throws IOException {
        String resourceName = "/integration-data/" + fileName;
        try (InputStream input = IntegrationTestData.class.getResourceAsStream(resourceName)) {
            if (input == null) {
                throw new IllegalStateException("Missing integration test fixture: " + resourceName);
            }
            Files.copy(input, dataDirectory.resolve(fileName), StandardCopyOption.REPLACE_EXISTING);
        }
    }
}
