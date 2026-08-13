# Login flow

```text
Browser
-> LoginPage
-> authApi
-> requestApi/httpClient
-> AuthController
-> AuthService
-> StudentRepository
-> JsonStudentRepository
-> JsonFileUtils
-> data/students.json
-> StudentResponse
-> App authenticated state
```

