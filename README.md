# React Bootstrap Dem

## Giới thiệu

Đây là dự án Frontend được xây dựng bằng **ReactJS** kết hợp với **React Bootstrap** và **Bootstrap Icons**.

Website gồm các thành phần:

- Header (Navbar)
- Banner (Carousel)
- User List (Table)
- Footer

Giao diện được thiết kế theo phong cách hiện đại, responsive và sử dụng các component của React Bootstrap.

---

## Công nghệ sử dụng

- ReactJS
- React Bootstrap
- Bootstrap 5
- Bootstrap Icons
- Axios (đã cài đặt)

---

## Cài đặt

### Bước 1: Clone project

```bash
git clone <repository-url>
```

Hoặc tải source code về máy.

---

### Bước 2: Di chuyển vào thư mục project

```bash
cd my-app
```

---

### Bước 3: Cài đặt các thư viện

```bash
npm install
```

Nếu thiếu thư viện:

```bash
npm install react-bootstrap bootstrap bootstrap-icons axios
```

---

## Chạy chương trình

Khởi động React:

```bash
npm start
```

Sau khi chạy thành công sẽ hiển thị:

```
Local: http://localhost:3000
```

Mở trình duyệt và truy cập:

```
http://localhost:3000
```

---

## Cấu trúc thư mục

```
src
│── App.js
│── Header.js
│── Banner.js
│── Content.js
│── Footer.js
│── App.css
│── index.js
```

---

## Chức năng

- Navbar sử dụng React Bootstrap.
- Banner Carousel tự động chuyển ảnh.
- Hỗ trợ thêm hoặc thay đổi ảnh banner chỉ bằng cách sửa URL trong mảng dữ liệu.
- Hiển thị bảng danh sách người dùng.
- Responsive trên nhiều kích thước màn hình.
- Sử dụng Bootstrap Icons cho các biểu tượng.

---

## Ghi chú

- Dự án hiện chỉ là **Frontend**, không yêu cầu chạy Backend.
- Dữ liệu hiển thị được khai báo trực tiếp trong project.
- Có thể dễ dàng tích hợp với API hoặc Backend trong tương lai.

---

## Tác giả

- Họ và tên: Trịnh Xuân Hồng Phong
- Môn học: ReactJS Framework
