# API response

Response thành công thống nhất:

```json
{
  "success": true,
  "message": "Thong diep thanh cong",
  "data": {}
}
```

Class tương ứng: `dto/response/ApiResponse.java`.

Frontend đọc envelope qua `requestApi` trong `frontend/src/shared/api/httpClient.ts`.

