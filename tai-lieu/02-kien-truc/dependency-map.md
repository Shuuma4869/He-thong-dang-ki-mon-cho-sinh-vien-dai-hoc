# Dependency map

## Backend

| Tầng | Phụ thuộc vào | Không phụ thuộc |
|---|---|---|
| Controller | Service, DTO | File JSON, repository file |
| Service | Repository interface, validator, mapper/model | `JsonFileUtils`, đường dẫn file |
| Validator | Validation context, model, exception | Controller, file IO |
| Repository interface | Model | File implementation |
| Json repository | `JsonFileUtils`, model | Controller, UI |
| Utility | Jackson, `Path`, UTF-8 | Business rule |

## Frontend

| Tầng | Phụ thuộc vào |
|---|---|
| Page/component | feature API, shared UI, types |
| Feature API | `requestApi`, endpoint constants, mapper |
| shared API | `fetch`, `ApiError`, app constants |
| Mock | Notifications/semester local demo |

