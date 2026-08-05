import { Student, Course, UniversityNotification } from '../types';

export const INITIAL_STUDENT: Student = {
  id: '21010045',
  name: 'Nguyễn Văn A',
  avatarUrl: '',
  className: 'CNTT-K16',
  major: 'Công nghệ Thông tin',
  faculty: 'Khoa Công nghệ Thông tin',
  cohort: '2021 - 2025',
  email: '21010045@st.phenikaa-uni.edu.vn',
  phone: '0987 654 321',
  dob: '15/08/2003',
  gender: 'Nam',
  cpa: 3.52,
  gpaPrevious: 3.68,
  creditsPassed: 88,
  totalCreditsRequired: 132,
};

export const SEMESTERS = [
  'Học kỳ 1 - Năm học 2026-2027',
  'Học kỳ 2 - Năm học 2025-2026',
  'Học kỳ Hè - Năm học 2025-2026',
];

export const FACULTIES = [
  'Tất cả Khoa',
  'Khoa Công nghệ Thông tin',
  'Khoa Điện - Điện tử',
  'Khoa Kinh tế và Kinh doanh',
  'Khoa Khoa học Cơ bản',
  'Khoa Ngoại ngữ',
  'Khoa Dược & Khoa học Sức khỏe',
];

export const COURSES_MOCK: Course[] = [
  // --- KHOA CÔNG NGHỆ THÔNG TIN ---
  {
    id: 'INT3101_01',
    code: 'INT3101',
    name: 'Lập trình Web nâng cao',
    lecturer: 'TS. Trịnh Văn Minh',
    credits: 3,
    schedules: [
      {
        dayOfWeek: 2, // Thứ 2
        periods: 'Tiết 1 - 3 (07:00 - 09:25)',
        periodNumbers: [1, 2, 3],
        room: 'P.302 - Tòa A2',
        shift: 'Sáng',
      },
    ],
    enrolled: 42,
    capacity: 50,
    status: 'Còn chỗ',
    faculty: 'Khoa Công nghệ Thông tin',
    prerequisite: 'INT1008 - Nhập môn Lập trình',
    description: 'Học phần cung cấp kiến thức phát triển ứng dụng Web hiện đại với React, TypeScript, RESTful API và tối ưu hóa hiệu năng frontend.',
    classGroup: 'Nhóm 01 - Lớp LT+TH',
  },
  {
    id: 'INT3105_02',
    code: 'INT3105',
    name: 'Cơ sở dữ liệu nâng cao',
    lecturer: 'PGS. TS. Nguyễn Hoàng Long',
    credits: 3,
    schedules: [
      {
        dayOfWeek: 2, // Thứ 2
        periods: 'Tiết 4 - 6 (09:35 - 12:00)',
        periodNumbers: [4, 5, 6],
        room: 'P.405 - Tòa A1',
        shift: 'Sáng',
      },
    ],
    enrolled: 48,
    capacity: 50,
    status: 'Còn chỗ',
    faculty: 'Khoa Công nghệ Thông tin',
    prerequisite: 'INT2003 - Cơ sở dữ liệu',
    description: 'Nghiên cứu kiến trúc RDBMS, indexing, query optimization, NoSQL, phân tán và an toàn dữ liệu doanh nghiệp.',
    classGroup: 'Nhóm 02 - Lớp LT',
  },
  {
    id: 'INT3202_01',
    code: 'INT3202',
    name: 'Hệ quản trị Cơ sở dữ liệu',
    lecturer: 'ThS. Lê Thị Thu Hà',
    credits: 3,
    schedules: [
      {
        dayOfWeek: 3, // Thứ 3
        periods: 'Tiết 1 - 3 (07:00 - 09:25)',
        periodNumbers: [1, 2, 3],
        room: 'P.201 - Tòa A2',
        shift: 'Sáng',
      },
    ],
    enrolled: 50,
    capacity: 50,
    status: 'Đã đầy',
    faculty: 'Khoa Công nghệ Thông tin',
    prerequisite: 'INT2003 - Cơ sở dữ liệu',
    description: 'Thiết kế hệ thống lưu trữ, lập trình Stored Procedures, Triggers, Backup/Recovery và quản trị SQL Server/PostgreSQL.',
    classGroup: 'Nhóm 01 - Lớp LT',
  },
  {
    id: 'INT3301_01',
    code: 'INT3301',
    name: 'Trí tuệ nhân tạo & Học máy',
    lecturer: 'TS. Nguyễn Anh Tuấn',
    credits: 4,
    schedules: [
      {
        dayOfWeek: 3, // Thứ 3
        periods: 'Tiết 7 - 9 (13:00 - 15:25)',
        periodNumbers: [7, 8, 9],
        room: 'P.501 - Tòa A2',
        shift: 'Chiều',
      },
    ],
    enrolled: 38,
    capacity: 45,
    status: 'Còn chỗ',
    faculty: 'Khoa Công nghệ Thông tin',
    prerequisite: 'MATH1012 - Đại số tuyến tính',
    description: 'Các thuật toán học có giám sát (Supervised), không giám sát (Unsupervised), Mạng Nơ-ron nhân tạo và ứng dụng thực tế.',
    classGroup: 'Nhóm 01 - Lớp LT+BT',
  },
  {
    id: 'INT3404_01',
    code: 'INT3404',
    name: 'Phân tích & Thiết kế Hệ thống',
    lecturer: 'TS. Phạm Minh Tuấn',
    credits: 3,
    schedules: [
      {
        dayOfWeek: 4, // Thứ 4
        periods: 'Tiết 1 - 3 (07:00 - 09:25)',
        periodNumbers: [1, 2, 3],
        room: 'P.304 - Tòa A1',
        shift: 'Sáng',
      },
    ],
    enrolled: 32,
    capacity: 45,
    status: 'Còn chỗ',
    faculty: 'Khoa Công nghệ Thông tin',
    prerequisite: 'INT1008 - Nhập môn CNTT',
    description: 'Phương pháp luận UML, phân tích yêu cầu phần mềm, kiến trúc Microservices và thiết kế giao diện UI/UX doanh nghiệp.',
    classGroup: 'Nhóm 01 - Lớp LT',
  },
  {
    id: 'INT3501_01',
    code: 'INT3501',
    name: 'An toàn & Bảo mật Thông tin',
    lecturer: 'TS. Đỗ Tiến Dũng',
    credits: 3,
    schedules: [
      {
        dayOfWeek: 6, // Thứ 6
        periods: 'Tiết 1 - 3 (07:00 - 09:25)',
        periodNumbers: [1, 2, 3],
        room: 'P.305 - Tòa A2',
        shift: 'Sáng',
      },
    ],
    enrolled: 39,
    capacity: 45,
    status: 'Còn chỗ',
    faculty: 'Khoa Công nghệ Thông tin',
    prerequisite: 'INT2005 - Mạng máy tính',
    description: 'Mật mã học cơ bản, an ninh mạng, phòng ngừa tấn công OWASP Top 10, quản lý khóa và chứng chỉ số SSL/TLS.',
    classGroup: 'Nhóm 01 - Lớp LT',
  },
  {
    id: 'INT3110_01',
    code: 'INT3110',
    name: 'Lập trình Đa nền tảng Di động',
    lecturer: 'ThS. Trần Quốc Bảo',
    credits: 3,
    schedules: [
      {
        dayOfWeek: 5, // Thứ 5
        periods: 'Tiết 4 - 6 (09:35 - 12:00)',
        periodNumbers: [4, 5, 6],
        room: 'Lab 203 - Tòa A2',
        shift: 'Sáng',
      },
    ],
    enrolled: 29,
    capacity: 40,
    status: 'Còn chỗ',
    faculty: 'Khoa Công nghệ Thông tin',
    prerequisite: 'INT3101 - Lập trình Web',
    description: 'Xây dựng ứng dụng di động đa nền tảng iOS & Android với React Native/Flutter, quản lý state và tích hợp Push Notification.',
    classGroup: 'Nhóm 01 - Lớp TH',
  },
  {
    id: 'INT3308_01',
    code: 'INT3308',
    name: 'Khai phá Dữ liệu & Dữ liệu lớn (Big Data)',
    lecturer: 'TS. Hà Quang Thụ',
    credits: 3,
    schedules: [
      {
        dayOfWeek: 7, // Thứ 7
        periods: 'Tiết 1 - 3 (07:00 - 09:25)',
        periodNumbers: [1, 2, 3],
        room: 'P.402 - Tòa A2',
        shift: 'Sáng',
      },
    ],
    enrolled: 35,
    capacity: 45,
    status: 'Còn chỗ',
    faculty: 'Khoa Công nghệ Thông tin',
    prerequisite: 'INT2003 - Cơ sở dữ liệu',
    description: 'Tổng quan công nghệ xử lý dữ liệu lớn Apache Spark, Hadoop MapReduce, quy trình ETL và phân tích xu hướng dự báo.',
    classGroup: 'Nhóm 01 - Lớp LT',
  },
  {
    id: 'INT3205_01',
    code: 'INT3205',
    name: 'Điện toán Đám mây & DevOps',
    lecturer: 'ThS. Nguyễn Văn Hải',
    credits: 3,
    schedules: [
      {
        dayOfWeek: 2, // Thứ 2
        periods: 'Tiết 7 - 9 (13:00 - 15:25)',
        periodNumbers: [7, 8, 9],
        room: 'Lab 301 - Tòa A2',
        shift: 'Chiều',
      },
    ],
    enrolled: 30,
    capacity: 40,
    status: 'Còn chỗ',
    faculty: 'Khoa Công nghệ Thông tin',
    prerequisite: 'INT2005 - Mạng máy tính',
    description: 'Triển khai ứng dụng trên Google Cloud Platform/AWS, Docker Containerization, Kubernetes và đường ống CI/CD tự động.',
    classGroup: 'Nhóm 01 - Lớp LT+TH',
  },
  {
    id: 'INT3012_01',
    code: 'INT3012',
    name: 'Cấu trúc Dữ liệu & Thuật toán',
    lecturer: 'PGS. TS. Lê Hoàng Sơn',
    credits: 4,
    schedules: [
      {
        dayOfWeek: 4, // Thứ 4
        periods: 'Tiết 7 - 9 (13:00 - 15:25)',
        periodNumbers: [7, 8, 9],
        room: 'P.102 - Tòa A1',
        shift: 'Chiều',
      },
    ],
    enrolled: 60,
    capacity: 60,
    status: 'Đã đầy',
    faculty: 'Khoa Công nghệ Thông tin',
    prerequisite: 'INT1008 - Nhập môn Lập trình',
    description: 'Cấu trúc cây, đồ thị, bảng băm, các thuật toán sắp xếp, tìm kiếm và tối ưu hóa thời gian chạy O(n).',
    classGroup: 'Nhóm 01 - Lớp LT',
  },

  // --- KHOA ĐIỆN - ĐIỆN TỬ ---
  {
    id: 'ECE2102_01',
    code: 'ECE2102',
    name: 'Kỹ thuật Vi xử lý & Vi điều khiển',
    lecturer: 'TS. Bùi Văn Nam',
    credits: 3,
    schedules: [
      {
        dayOfWeek: 4, // Thứ 4
        periods: 'Tiết 4 - 6 (09:35 - 12:00)',
        periodNumbers: [4, 5, 6],
        room: 'Lab 102 - Tòa B1',
        shift: 'Sáng',
      },
    ],
    enrolled: 28,
    capacity: 40,
    status: 'Còn chỗ',
    faculty: 'Khoa Điện - Điện tử',
    prerequisite: 'ECE1001 - Mạch điện tử',
    description: 'Kiến trúc ARM Cortex, lập trình C nhúng, các chuẩn giao tiếp UART, SPI, I2C và ứng dụng IoT.',
    classGroup: 'Nhóm 01 - Lớp TH',
  },
  {
    id: 'ECE3108_01',
    code: 'ECE3108',
    name: 'Hệ thống Nhúng & Mạng Cảm biến IoT',
    lecturer: 'TS. Dương Văn Thông',
    credits: 3,
    schedules: [
      {
        dayOfWeek: 3, // Thứ 3
        periods: 'Tiết 4 - 6 (09:35 - 12:00)',
        periodNumbers: [4, 5, 6],
        room: 'Lab 201 - Tòa B1',
        shift: 'Sáng',
      },
    ],
    enrolled: 22,
    capacity: 35,
    status: 'Còn chỗ',
    faculty: 'Khoa Điện - Điện tử',
    prerequisite: 'ECE2102 - Vi xử lý',
    description: 'Xây dựng mạng cảm biến không dây Zigbee/LoRaWAN, thu thập dữ liệu thời gian thực và quản lý năng lượng hệ thống nhúng.',
    classGroup: 'Nhóm 01 - Lớp LT+TH',
  },
  {
    id: 'ECE2201_01',
    code: 'ECE2201',
    name: 'Thiết kế Mạch Điện tử Số',
    lecturer: 'ThS. Ngô Văn Khánh',
    credits: 3,
    schedules: [
      {
        dayOfWeek: 5, // Thứ 5
        periods: 'Tiết 1 - 3 (07:00 - 09:25)',
        periodNumbers: [1, 2, 3],
        room: 'P.301 - Tòa B1',
        shift: 'Sáng',
      },
    ],
    enrolled: 34,
    capacity: 45,
    status: 'Còn chỗ',
    faculty: 'Khoa Điện - Điện tử',
    prerequisite: 'Không có',
    description: 'Đại số Boole, tổng hợp mạch tổ hợp và mạch tuần tự, mô phỏng thiết kế chip trên ngôn ngữ Verilog/VHDL.',
    classGroup: 'Nhóm 01 - Lớp LT',
  },

  // --- KHOA KINH TẾ VÀ KINH DOANH ---
  {
    id: 'BUS2001_02',
    code: 'BUS2001',
    name: 'Quản trị Học & Lãnh đạo',
    lecturer: 'ThS. Vũ Thị Ngọc Bích',
    credits: 2,
    schedules: [
      {
        dayOfWeek: 5, // Thứ 5
        periods: 'Tiết 1 - 2 (07:00 - 08:35)',
        periodNumbers: [1, 2],
        room: 'P.101 - Tòa C2',
        shift: 'Sáng',
      },
    ],
    enrolled: 45,
    capacity: 60,
    status: 'Còn chỗ',
    faculty: 'Khoa Kinh tế và Kinh doanh',
    prerequisite: 'Không có',
    description: 'Tổng quan về hoạch định, tổ chức, lãnh đạo và kiểm tra trong tổ chức hiện đại. Phát triển kỹ năng làm việc nhóm.',
    classGroup: 'Nhóm 02 - Lớp LT',
  },
  {
    id: 'BUS3102_01',
    code: 'BUS3102',
    name: 'Marketing Kỹ thuật số (Digital Marketing)',
    lecturer: 'TS. Nguyễn Thị Mai Hương',
    credits: 3,
    schedules: [
      {
        dayOfWeek: 6, // Thứ 6
        periods: 'Tiết 4 - 6 (09:35 - 12:00)',
        periodNumbers: [4, 5, 6],
        room: 'P.202 - Tòa C2',
        shift: 'Sáng',
      },
    ],
    enrolled: 52,
    capacity: 55,
    status: 'Còn chỗ',
    faculty: 'Khoa Kinh tế và Kinh doanh',
    prerequisite: 'BUS1001 - Nguyên lý Marketing',
    description: 'Xây dựng chiến dịch SEO, Facebook/Google Ads, Content Marketing và đo lường chuyển đổi ROI thương mại điện tử.',
    classGroup: 'Nhóm 01 - Lớp LT',
  },
  {
    id: 'BUS2005_01',
    code: 'BUS2005',
    name: 'Tài chính Doanh nghiệp',
    lecturer: 'PGS. TS. Đặng Văn Vinh',
    credits: 3,
    schedules: [
      {
        dayOfWeek: 3, // Thứ 3
        periods: 'Tiết 7 - 9 (13:00 - 15:25)',
        periodNumbers: [7, 8, 9],
        room: 'P.303 - Tòa C2',
        shift: 'Chiều',
      },
    ],
    enrolled: 40,
    capacity: 50,
    status: 'Còn chỗ',
    faculty: 'Khoa Kinh tế và Kinh doanh',
    prerequisite: 'BUS1002 - Nguyên lý Kế toán',
    description: 'Phân tích báo cáo tài chính, định giá tài sản, dòng tiền dự án đầu tư NPV/IRR và quản trị rủi ro nguồn vốn.',
    classGroup: 'Nhóm 01 - Lớp LT',
  },
  {
    id: 'BUS3201_01',
    code: 'BUS3201',
    name: 'Quản trị Chuỗi Cung ứng & Logistics',
    lecturer: 'TS. Phạm Anh Tuấn',
    credits: 3,
    schedules: [
      {
        dayOfWeek: 2, // Thứ 2
        periods: 'Tiết 4 - 6 (09:35 - 12:00)',
        periodNumbers: [4, 5, 6],
        room: 'P.104 - Tòa C2',
        shift: 'Sáng',
      },
    ],
    enrolled: 38,
    capacity: 45,
    status: 'Còn chỗ',
    faculty: 'Khoa Kinh tế và Kinh doanh',
    prerequisite: 'BUS2001 - Quản trị học',
    description: 'Quản lý kho hàng, vận tải quốc tế, mô hình tồn kho Just-In-Time và ứng dụng công nghệ trong chuỗi cung ứng toàn cầu.',
    classGroup: 'Nhóm 01 - Lớp LT',
  },

  // --- KHOA NGOẠI NGỮ ---
  {
    id: 'ENG1003_05',
    code: 'ENG1003',
    name: 'Tiếng Anh Chuyên ngành CNTT 2',
    lecturer: 'ThS. Hoàng Thị Phương',
    credits: 3,
    schedules: [
      {
        dayOfWeek: 5, // Thứ 5
        periods: 'Tiết 7 - 9 (13:00 - 15:25)',
        periodNumbers: [7, 8, 9],
        room: 'P.402 - Tòa A2',
        shift: 'Chiều',
      },
    ],
    enrolled: 30,
    capacity: 35,
    status: 'Còn chỗ',
    faculty: 'Khoa Ngoại ngữ',
    prerequisite: 'ENG1002 - Tiếng Anh Chuyên ngành 1',
    description: 'Rèn luyện kỹ năng đọc hiểu tài liệu kỹ thuật, viết tài liệu API, giao tiếp và thuyết trình dự án công nghệ bằng tiếng Anh.',
    classGroup: 'Nhóm 05 - Lớp LT',
  },
  {
    id: 'ENG2004_01',
    code: 'ENG2004',
    name: 'Tiếng Anh Thương mại (Business English)',
    lecturer: 'ThS. Nguyễn Thu Trang',
    credits: 3,
    schedules: [
      {
        dayOfWeek: 4, // Thứ 4
        periods: 'Tiết 4 - 6 (09:35 - 12:00)',
        periodNumbers: [4, 5, 6],
        room: 'P.201 - Tòa A2',
        shift: 'Sáng',
      },
    ],
    enrolled: 32,
    capacity: 40,
    status: 'Còn chỗ',
    faculty: 'Khoa Ngoại ngữ',
    prerequisite: 'ENG1001 - Tiếng Anh B2',
    description: 'Kỹ năng soạn thảo email doanh nghiệp, đàm phán hợp đồng, phỏng vấn xin việc và giao tiếp kinh doanh quốc tế.',
    classGroup: 'Nhóm 01 - Lớp LT',
  },
  {
    id: 'JPN1001_01',
    code: 'JPN1001',
    name: 'Tiếng Nhật Sơ cấp 1 (Japanese N5)',
    lecturer: 'ThS. Tanaka Kenji',
    credits: 3,
    schedules: [
      {
        dayOfWeek: 7, // Thứ 7
        periods: 'Tiết 4 - 6 (09:35 - 12:00)',
        periodNumbers: [4, 5, 6],
        room: 'P.103 - Tòa A2',
        shift: 'Sáng',
      },
    ],
    enrolled: 25,
    capacity: 30,
    status: 'Còn chỗ',
    faculty: 'Khoa Ngoại ngữ',
    prerequisite: 'Không có',
    description: 'Bảng chữ cái Hiragana, Katakana, chữ Hán Kanji cơ bản và cấu trúc câu giao tiếp tiếng Nhật hàng ngày.',
    classGroup: 'Nhóm 01 - Lớp LT',
  },

  // --- KHOA KHOA HỌC CƠ BẢN ---
  {
    id: 'MATH1015_01',
    code: 'MATH1015',
    name: 'Xác suất Thống kê',
    lecturer: 'PGS. TS. Trần Văn Bình',
    credits: 3,
    schedules: [
      {
        dayOfWeek: 6, // Thứ 6
        periods: 'Tiết 4 - 6 (09:35 - 12:00)',
        periodNumbers: [4, 5, 6],
        room: 'Hội trường A1-101',
        shift: 'Sáng',
      },
    ],
    enrolled: 85,
    capacity: 90,
    status: 'Còn chỗ',
    faculty: 'Khoa Khoa học Cơ bản',
    prerequisite: 'MATH1010 - Giải tích 1',
    description: 'Lý thuyết xác suất, biến ngẫu nhiên, đại lượng ngẫu nhiên, kiểm định giả thuyết và ước lượng tham số trong kỹ thuật.',
    classGroup: 'Nhóm 01 - Lớp LT',
  },
  {
    id: 'MATH1010_02',
    code: 'MATH1010',
    name: 'Giải tích Toán học 1',
    lecturer: 'TS. Lê Đức Thanh',
    credits: 3,
    schedules: [
      {
        dayOfWeek: 2, // Thứ 2
        periods: 'Tiết 7 - 9 (13:00 - 15:25)',
        periodNumbers: [7, 8, 9],
        room: 'P.202 - Tòa A1',
        shift: 'Chiều',
      },
    ],
    enrolled: 75,
    capacity: 80,
    status: 'Còn chỗ',
    faculty: 'Khoa Khoa học Cơ bản',
    prerequisite: 'Không có',
    description: 'Giới hạn dãy số, hàm số, đạo hàm, vi phân, tích phân xác định và ứng dụng trong khoa học tính toán.',
    classGroup: 'Nhóm 02 - Lớp LT',
  },
  {
    id: 'PHY1001_01',
    code: 'PHY1001',
    name: 'Vật lý Đại cương 1 (Cơ & Nhiệt)',
    lecturer: 'TS. Trịnh Xuân Việt',
    credits: 3,
    schedules: [
      {
        dayOfWeek: 3, // Thứ 3
        periods: 'Tiết 4 - 6 (09:35 - 12:00)',
        periodNumbers: [4, 5, 6],
        room: 'P.301 - Tòa A1',
        shift: 'Sáng',
      },
    ],
    enrolled: 58,
    capacity: 60,
    status: 'Còn chỗ',
    faculty: 'Khoa Khoa học Cơ bản',
    prerequisite: 'Không có',
    description: 'Các định luật Động lực học Newton, bảo toàn năng lượng, mô-men động lượng, nhiệt động lực học và ứng dụng kỹ thuật.',
    classGroup: 'Nhóm 01 - Lớp LT',
  },

  // --- KHOA DƯỢC & KHOA HỌC SỨC KHỎE ---
  {
    id: 'PHA1001_01',
    code: 'PHA1001',
    name: 'Hóa Dược Đại cương & Lý thuyết Dược học',
    lecturer: 'GS. TS. Nguyễn Minh Đức',
    credits: 3,
    schedules: [
      {
        dayOfWeek: 4, // Thứ 4
        periods: 'Tiết 7 - 9 (13:00 - 15:25)',
        periodNumbers: [7, 8, 9],
        room: 'Lab Dược - Tòa B2',
        shift: 'Chiều',
      },
    ],
    enrolled: 26,
    capacity: 35,
    status: 'Còn chỗ',
    faculty: 'Khoa Dược & Khoa học Sức khỏe',
    prerequisite: 'Không có',
    description: 'Cấu trúc hóa học các nhóm hoạt chất dược dụng, mối liên quan giữa cấu trúc và tác dụng sinh học của thuốc.',
    classGroup: 'Nhóm 01 - Lớp LT+TH',
  },
  {
    id: 'PHA2002_01',
    code: 'PHA2002',
    name: 'Dược lý học Lâm sàng (Clinical Pharmacology)',
    lecturer: 'TS. DS. Phạm Thị Lan',
    credits: 3,
    schedules: [
      {
        dayOfWeek: 6, // Thứ 6
        periods: 'Tiết 7 - 9 (13:00 - 15:25)',
        periodNumbers: [7, 8, 9],
        room: 'P.102 - Tòa B2',
        shift: 'Chiều',
      },
    ],
    enrolled: 31,
    capacity: 35,
    status: 'Còn chỗ',
    faculty: 'Khoa Dược & Khoa học Sức khỏe',
    prerequisite: 'PHA1001 - Hóa Dược',
    description: 'Cơ chế tác dụng, chỉ định, chống chỉ định, tương tác thuốc và quản lý dược lâm sàng trong bệnh viện.',
    classGroup: 'Nhóm 01 - Lớp LT',
  }
];

export const INITIAL_REGISTERED_IDS = [
  'INT3101_01', // Lập trình Web nâng cao (3 TC) - Thứ 2 Tiết 1-3
  'INT3404_01', // Phân tích & Thiết kế Hệ thống (3 TC) - Thứ 4 Tiết 1-3
  'BUS2001_02', // Quản trị Học & Lãnh đạo (2 TC) - Thứ 5 Tiết 1-2
  'INT3501_01', // An toàn & Bảo mật Thông tin (3 TC) - Thứ 6 Tiết 1-3
];

export const NOTIFICATIONS_MOCK: UniversityNotification[] = [
  {
    id: 'NOTIF_001',
    title: 'Thông báo mở hệ thống Đăng ký Học phần Học kỳ 1 (2026 - 2027)',
    summary: 'Phòng Đào tạo thông báo thời gian đăng ký học phần chính thức cho toàn thể sinh viên Khóa 14, 15, 16, 17.',
    content: 'Phòng Đào tạo Đại học Phenikaa trân trọng thông báo: Hệ thống đăng ký môn học trực tuyến bắt đầu mở từ 08:00 ngày 05/08/2026 đến 17:00 ngày 15/08/2026. Sinh viên chú ý kiểm tra số tín chỉ tối thiểu (12 TC) và tối đa (24 TC) trước khi xác nhận.',
    category: 'Đào tạo',
    createdAt: '05/08/2026 08:00',
    isRead: false,
    priority: 'Cao',
  },
  {
    id: 'NOTIF_002',
    title: 'Lịch nộp học phí và chính sách học bổng khuyến khích học tập K16',
    summary: 'Hướng dẫn nộp học phí qua cổng thanh toán QR Phenikaa Pay hoặc chuyển khoản ngân hàng BIDV.',
    content: 'Sinh viên hoàn thành nghĩa vụ học phí trước ngày 25/08/2026. Mọi thắc mắc về miễn giảm học phí vui lòng liên hệ Trung tâm Dịch vụ Sinh viên tại Tòa nhà A1.',
    category: 'Học phí',
    createdAt: '03/08/2026 14:15',
    isRead: false,
    priority: 'Bình thường',
  },
  {
    id: 'NOTIF_003',
    title: 'Thông báo cập nhật phòng học và giảng đường Tòa A2 từ tuần 02',
    summary: 'Một số học phần thực hành Khoa CNTT được di chuyển sang Lab công nghệ Tòa A2.',
    content: 'Để đảm bảo cơ sở vật chất trang thiết bị máy tính cấu hình cao, các lớp thực hành Cơ sở dữ liệu nâng cao và AI sẽ chuyển sang Lab 301 & Lab 302 Tòa A2.',
    category: 'Lịch học',
    createdAt: '01/08/2026 09:30',
    isRead: true,
    priority: 'Bình thường',
  },
  {
    id: 'NOTIF_004',
    title: 'Bảo trì hạ tầng Cổng thông tin Sinh viên Phenikaa Portal',
    summary: 'Hệ thống thực hiện bảo trì định kỳ vào 23:00 - 02:00 ngày 10/08/2026.',
    content: 'Trong thời gian bảo trì, các tính năng đăng ký môn học và tra cứu điểm sẽ tạm thời ngắt kết nối. Trân trọng cảm ơn sự hợp tác của sinh viên.',
    category: 'Hệ thống',
    createdAt: '28/07/2026 16:45',
    isRead: true,
    priority: 'Bình thường',
  },
];
