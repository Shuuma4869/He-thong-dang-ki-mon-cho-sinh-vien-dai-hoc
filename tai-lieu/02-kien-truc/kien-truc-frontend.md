# Kien truc frontend

Frontend la ung dung React single-page dashboard, routing thu cong bang state tab trong `App`.

## Trang thai runtime sau F14

Da ket noi REST API that cho cac luong chinh:

- Auth demo va Profile.
- Course list/detail/search.
- Registration list/register/cancel.
- Timetable.
- Dashboard composition.

Dashboard sau F14 khong co backend dashboard endpoint rieng. Dashboard gom du lieu tu:

- `currentStudent` da dang nhap.
- Registration state do `App` load tu backend.
- `courseApi.getCourses()`.
- `timetableApi.getTimetable(studentId)`.

Notifications duoc giu o pham vi frontend demo/local state. Tinh nang nay chua co backend persistence.

## Nguyen tac frontend API

- Feature API phai di qua shared `requestApi`.
- Page/component khong goi `fetch` truc tiep.
- Frontend khong doc truc tiep `data/*.json`.
- Khong hard-code `SV001` trong runtime.
- Khong fallback sang mock cho cac flow da co API that.

## Cac man hinh chinh

- Dang nhap demo.
- Tong quan.
- Danh sach mon hoc.
- Mon da dang ky.
- Thoi khoa bieu.
- Thong bao demo/local.
- Ho so sinh vien.
