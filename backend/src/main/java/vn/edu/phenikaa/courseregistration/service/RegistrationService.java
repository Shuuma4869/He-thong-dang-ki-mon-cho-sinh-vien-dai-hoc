package vn.edu.phenikaa.courseregistration.service;

import org.springframework.stereotype.Service;
import vn.edu.phenikaa.courseregistration.interfaces.Registrable;

/** Service skeleton cho nghiệp vụ đăng ký môn học. */
@Service
public class RegistrationService implements Registrable {
    @Override
    public void register(String studentId, String courseId) {
        // TODO: Bổ sung rule đăng ký trong phase nghiệp vụ.
    }
}
