# Hướng dẫn cài đặt

Clone repository:

```powershell
git clone <repo-url>
cd <thu-muc-du-an>
```

Nên đặt dự án trong thư mục không dấu tiếng Việt nếu máy gặp lỗi classpath hoặc tool cũ không hỗ trợ Unicode path tốt.

Cài frontend dependency:

```powershell
cd frontend
npm install
cd ..
```

Backend dependency được Maven Wrapper tải khi chạy lệnh build/test lần đầu.

