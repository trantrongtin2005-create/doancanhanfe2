export const profileData = {
  about: {
    name: "Trần Trọng Tín",
    title: "Fullstack / Frontend Developer Intern",
    subtitle: "Tạo dựng giải pháp Web hiện đại với trải nghiệm tối ưu",
    mssv: "23211TT2568",
    school: "Cao Đẳng Công Nghệ Thủ Đức (TDC)",
    location: "Thành phố Thủ Đức, TP. Hồ Chí Minh",
    phone: "0792 354 674",
    email: "trantrongtin2005@gmail.com",
    facebook: "https://www.facebook.com/tin.tran.131410",
    github: "https://github.com/trantrongtin2005-create",
    mission: "Xây dựng các sản phẩm web hiện đại — nơi thiết kế, hiệu năng và trải nghiệm người dùng hòa làm một. Tôi không chỉ viết code, tôi kiến tạo những trải nghiệm số mượt mà và trực quan.",
    objective: "Là sinh viên chuyên ngành Công nghệ thông tin nhiệt huyết, tôi đang tìm kiếm cơ hội thực tập vị trí Frontend hoặc Fullstack Developer. Mục tiêu của tôi là áp dụng kiến thức ReactJS, Node.js, và Laravel vào thực tế, đóng góp giá trị cho dự án thực tế và học hỏi từ các lập trình viên chuyên nghiệp để phát triển chuyên môn sâu sắc hơn.",
    stats: [
      { label: "Năm Học", value: "Năm 3" },
      { label: "Dự Án Hoàn Thành", value: "6+" },
      { label: "Điểm Rèn Luyện / GPA", value: "Khá - Giỏi" },
      { label: "Mức Sẵn Sàng", value: "100%" }
    ]
  },
  skills: {
    frontend: [
      { name: "HTML5 / CSS3", level: 85 },
      { name: "JavaScript (ES6+)", level: 80 },
      { name: "ReactJS / Vite", level: 75 },
      { name: "TailwindCSS", level: 85 }
    ],
    backend: [
      { name: "Node.js / Express", level: 65 },
      { name: "PHP / Laravel", level: 70 },
      { name: "RESTful API / JSON", level: 80 },
      { name: "SQL (MySQL) / MongoDB", level: 70 }
    ],
    tools: [
      { name: "Git / GitHub", level: 80 },
      { name: "VS Code", level: 90 },
      { name: "Figma (Design UI)", level: 70 },
      { name: "Postman / Thunder Client", level: 75 }
    ],
    softSkills: [
      { name: "Tư duy logic & Thuật toán", level: 85 },
      { name: "Làm việc nhóm (Teamwork)", level: 80 },
      { name: "Khả năng chịu áp lực", level: 75 },
      { name: "Tự học & Nghiên cứu mới", level: 90 }
    ]
  },
  projects: [
    {
      id: "socialap",
      title: "SocialAp - Social Network",
      description: "Hệ thống mạng xã hội nhóm hoàn chỉnh được xây dựng trên mô hình MVC backend vững chắc. Tích hợp tính năng đăng bài viết, bình luận đa cấp, hệ thống thông báo thời gian thực, lưu trữ hình ảnh và phân quyền người dùng chặt chẽ.",
      techStack: ["PHP", "Laravel", "MySQL", "JavaScript", "Bootstrap", "Git"],
      githubUrl: "https://github.com/canh990/DoAn_BE2_NhomJ/",
      liveUrl: "https://github.com/canh990/DoAn_BE2_NhomJ/",
      category: "Fullstack",
      imageColor: "from-blue-600 to-indigo-700"
    },
    {
      id: "teshstore",
      title: "TeshStore - E-Commerce",
      description: "Trang web thương mại điện tử chuyên nghiệp cung cấp thiết bị công nghệ. Hỗ trợ giỏ hàng động, thanh toán hóa đơn, tìm kiếm và lọc sản phẩm tối ưu, giao diện responsive mượt mà và trang quản trị dashboard cho admin.",
      techStack: ["HTML5", "CSS3", "JavaScript", "PHP", "MySQL", "Responsive"],
      githubUrl: "https://github.com/trantrongtin2005-create",
      liveUrl: "https://doanmonhoc.id.vn/",
      category: "Frontend",
      imageColor: "from-purple-600 to-pink-600"
    },
    {
      id: "taskmanager",
      title: "Smart Task Manager",
      description: "Ứng dụng quản lý công việc và kế hoạch cá nhân. Cho phép người dùng tạo các bảng Kanban, phân loại mức độ ưu tiên, đặt lịch nhắc nhở, và theo dõi trực quan hiệu suất làm việc hàng ngày.",
      techStack: ["ReactJS", "Node.js", "Express", "MongoDB", "TailwindCSS", "Framer Motion"],
      githubUrl: "https://github.com/trantrongtin2005-create",
      liveUrl: "https://github.com/trantrongtin2005-create",
      category: "Fullstack",
      imageColor: "from-emerald-500 to-teal-700"
    },
    {
      id: "weatherapp",
      title: "Real-time Weather Forecast",
      description: "Ứng dụng dự báo thời tiết toàn cầu tích hợp OpenWeather API. Hiển thị thông tin chi tiết nhiệt độ, độ ẩm, tốc độ gió, chỉ số UV và thay đổi giao diện động (hình ảnh và tone màu neon) tùy thuộc vào điều kiện thời tiết thực tế của địa điểm tìm kiếm.",
      techStack: ["ReactJS", "Vite", "TailwindCSS", "OpenWeather API", "REST API"],
      githubUrl: "https://github.com/trantrongtin2005-create",
      liveUrl: "https://github.com/trantrongtin2005-create",
      category: "Frontend",
      imageColor: "from-cyan-500 to-blue-600"
    }
  ],
  education: [
    {
      role: "Sinh Viên Công Nghệ Thông Tin",
      institution: "Cao Đẳng Công Nghệ Thủ Đức (TDC)",
      duration: "2023 - Hiện Tại",
      description: "Học tập nền tảng khoa học máy tính, cấu trúc dữ liệu và giải thuật. Chuyên sâu về Phát triển phần mềm & Thiết kế Web Fullstack. GPA luôn duy trì ở mức xuất sắc trong các môn chuyên ngành lập trình."
    },
    {
      role: "Xây dựng Đồ án Cơ sở Ngành",
      institution: "TDC Project",
      duration: "2024",
      description: "Phát triển dự án TeshStore (Thương mại điện tử công nghệ), trực tiếp đảm nhận thiết kế cơ sở dữ liệu MySQL, phát triển giao diện responsive và xây dựng các chức năng xử lý giỏ hàng phía server bằng PHP."
    },
    {
      role: "Đồ án Chuyên ngành & Làm việc Nhóm",
      institution: "TDC Team Project",
      duration: "2025",
      description: "Hợp tác xây dựng dự án SocialAp (Mạng xã hội học đường). Áp dụng quy trình Git Flow, giải quyết xung đột code chuyên nghiệp, và xây dựng hệ thống thông báo đa kênh, bảo mật thông tin tài khoản qua mã hóa."
    },
    {
      role: "Thực tập sinh & Tốt nghiệp",
      institution: "Doanh nghiệp & Trường học",
      duration: "2026 (Hiện tại)",
      description: "Hoàn thiện chương trình đào tạo, tích cực trau dồi các công nghệ ReactJS, Next.js và TailwindCSS mới nhất. Tìm kiếm môi trường doanh nghiệp thực tế để cống hiến năng lực lập trình và chính thức gia nhập ngành."
    }
  ]
};
