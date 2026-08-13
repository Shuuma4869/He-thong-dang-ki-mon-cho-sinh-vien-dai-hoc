# Tổng quan unit test

Backend có 22 test class và 98 test đang pass ở vòng kiểm tra gần nhất.

Công cụ:

- JUnit 5.
- Mockito.
- MockMvc.
- AssertJ.
- `@TempDir` cho test File IO.

Quy ước viết test:

- Tên test mô tả hành vi.
- Bố cục Arrange / Act / Assert.
- Mock dependency ngoài class đang test.
- Kiểm tra cả success, negative, boundary và regression case.

