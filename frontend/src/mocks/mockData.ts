import { UniversityNotification } from '@/features/notifications/types/notification.types';

export const SEMESTERS = [
  'Học kỳ 1 - Năm học 2026-2027',
  'Học kỳ 2 - Năm học 2025-2026',
  'Học kỳ Hè - Năm học 2025-2026',
];

export const NOTIFICATIONS_MOCK: UniversityNotification[] = [
  {
    id: 'notif-1',
    title: 'Mở đăng ký học phần kỳ 1',
    summary: 'Sinh viên có thể đăng ký học phần theo kế hoạch đào tạo trong thời gian nhà trường công bố.',
    content: 'Cổng đăng ký học phần đã mở cho học kỳ 1 năm học 2026-2027. Sinh viên cần kiểm tra lịch học, số tín chỉ và điều kiện đăng ký trước khi xác nhận.',
    category: 'Đăng ký',
    createdAt: '10/08/2026',
    isRead: false,
  },
  {
    id: 'notif-2',
    title: 'Kiểm tra thời khóa biểu sau khi đăng ký',
    summary: 'Sau mỗi lần đăng ký hoặc hủy đăng ký, sinh viên nên mở lại thời khóa biểu để kiểm tra lịch học.',
    content: 'Thời khóa biểu được hệ thống tính từ các học phần đang đăng ký. Nếu có thay đổi về đăng ký, sinh viên nên kiểm tra lại lịch học trước khi kết thúc phiên làm việc.',
    category: 'Thời khóa biểu',
    createdAt: '09/08/2026',
    isRead: false,
  },
  {
    id: 'notif-3',
    title: 'Cập nhật hồ sơ sinh viên',
    summary: 'Một số thông tin hồ sơ được đồng bộ từ dữ liệu sinh viên của hệ thống.',
    content: 'Sinh viên cần báo với phòng đào tạo nếu phát hiện thông tin cá nhân hoặc lớp hành chính chưa chính xác.',
    category: 'Hồ sơ',
    createdAt: '08/08/2026',
    isRead: true,
  },
];
