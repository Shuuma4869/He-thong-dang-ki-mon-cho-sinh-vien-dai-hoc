package vn.edu.phenikaa.courseregistration.utils;

import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.io.Reader;
import java.io.Writer;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * Tiện ích đọc/ghi JSON file dùng chung cho tầng repository/file.
 *
 * <p>Đây là điểm duy nhất được phép thao tác trực tiếp với file JSON. Controller,
 * service, model và frontend không được tự đọc/ghi file dữ liệu.</p>
 */
@Component
public class JsonFileUtils {
    private final ObjectMapper objectMapper;
    private final Path dataDirectory;

    public JsonFileUtils(
            ObjectMapper objectMapper,
            @Value("${app.data-dir:../data}") String dataDirectory
    ) {
        this.objectMapper = objectMapper;
        this.dataDirectory = Path.of(dataDirectory).toAbsolutePath().normalize();
    }

    /**
     * Đọc một file JSON dạng mảng thành danh sách model.
     *
     * @param fileName tên file nằm trong thư mục data cấu hình.
     * @param elementType kiểu phần tử trong danh sách.
     * @param <T> kiểu phần tử.
     * @return danh sách dữ liệu; trả về danh sách rỗng nếu file chưa tồn tại.
     */
    public <T> List<T> readList(String fileName, Class<T> elementType) {
        Path filePath = resolveDataFile(fileName);
        if (Files.notExists(filePath)) {
            return List.of();
        }

        JavaType listType = objectMapper.getTypeFactory()
                .constructCollectionType(List.class, elementType);

        try (Reader reader = Files.newBufferedReader(filePath, StandardCharsets.UTF_8)) {
            List<T> items = objectMapper.readValue(reader, listType);
            return items == null ? List.of() : items;
        } catch (IOException exception) {
            throw new IllegalStateException("Không thể đọc file JSON: " + fileName, exception);
        }
    }

    /**
     * Ghi danh sách model xuống file JSON dạng mảng.
     *
     * @param fileName tên file nằm trong thư mục data cấu hình.
     * @param items danh sách dữ liệu cần ghi.
     * @param <T> kiểu phần tử.
     */
    public <T> void writeList(String fileName, List<T> items) {
        Path filePath = resolveDataFile(fileName);

        try {
            Files.createDirectories(filePath.getParent());
            try (Writer writer = Files.newBufferedWriter(filePath, StandardCharsets.UTF_8)) {
                objectMapper.writerWithDefaultPrettyPrinter()
                        .writeValue(writer, items == null ? List.of() : items);
            }
        } catch (IOException exception) {
            throw new IllegalStateException("Không thể ghi file JSON: " + fileName, exception);
        }
    }

    private Path resolveDataFile(String fileName) {
        if (fileName == null || fileName.isBlank()) {
            throw new IllegalArgumentException("Tên file JSON không được rỗng.");
        }

        Path filePath = dataDirectory.resolve(fileName).normalize();
        if (!filePath.startsWith(dataDirectory)) {
            throw new IllegalArgumentException("Tên file JSON không hợp lệ: " + fileName);
        }

        return filePath;
    }
}
