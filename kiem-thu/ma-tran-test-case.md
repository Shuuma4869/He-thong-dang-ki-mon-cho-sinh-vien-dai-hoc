# Ma trận test case

| Module | Test class | Nhóm case |
|---|---|---|
| Auth | `AuthServiceTest`, `AuthControllerTest` | success, not found, blank request |
| Student | `StudentServiceTest`, `StudentControllerTest` | profile success, not found |
| Course | `CourseServiceTest`, `CourseControllerTest` | list, detail, search, not found, lecturer missing |
| Repository | `Json*RepositoryTest` | find all, find by id, save |
| Registration | `RegistrationServiceTest`, `RegistrationControllerTest` | register, cancel, validation fail, summary |
| Validator | `*ValidatorTest`, `RegistrationValidatorOrderTest` | thứ tự validator, boundary, negative case |
| Timetable | `TimetableServiceTest`, `TimetableControllerTest` | empty, multiple, cancelled excluded |
| Utility | `JsonFileUtilsTest` | missing, empty, malformed, UTF-8, round trip |

