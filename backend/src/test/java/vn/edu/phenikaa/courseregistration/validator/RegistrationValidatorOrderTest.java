package vn.edu.phenikaa.courseregistration.validator;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import vn.edu.phenikaa.courseregistration.interfaces.CourseValidator;

@SpringBootTest
class RegistrationValidatorOrderTest {
    @Autowired
    private List<CourseValidator> validators;

    @Test
    void springInjectsCourseValidatorsInBusinessPriorityOrder() {
        assertThat(validators)
            .extracting(validator -> validator.getClass().getSimpleName())
            .containsExactly(
                "CourseExistenceValidator",
                "DuplicateCourseValidator",
                "CapacityValidator",
                "CreditLimitValidator",
                "ScheduleConflictValidator"
            );
    }
}
