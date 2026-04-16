# BÁO CÁO CHI TIẾT DỰ ÁN CUỐI KHÓA: MỘC-ECOPURE

---

## 1. GIỚI THIỆU ĐỀ TÀI VÀ THÀNH VIÊN NHÓM

### 1.1 Đề tài dự án
**Tên dự án:** Mộc-EcoPure E-Commerce.
**Lĩnh vực:** Thương mại điện tử chuyên biệt về thời trang bền vững (Eco-friendly Fashion).
**Mục tiêu:** Xây dựng một nền tảng mua sắm hiện đại, tinh tế, truyền tải thông điệp bảo vệ môi trường thông qua các sản phẩm vải hữu cơ và quy trình sản xuất thủ công.

### 1.2 Thành viên nhóm
*   **Trưởng nhóm:** Lương Nhật Hào.
*   **Thành viên:** (Danh sách các thành viên tham gia xây dựng Frontend, Backend và Database).

---

## 2. CÁCH TẠO SERVER VÀ KẾT NỐI VỚI MONGODB

### 2.1 Khởi tạo Server (NodeJS & Express)
Server được xây dựng bằng framework **ExpressJS** với các bước chính:
*   Sử dụng `express()` để khởi tạo ứng dụng.
*   Sử dụng middleware `body-parser` để xử lý dữ liệu JSON và URL-encoded với giới hạn dung lượng lên đến 50MB (phục vụ việc upload ảnh base64).
*   Thiết lập **CORS** để cho phép Frontend tương tác với Backend qua các URL khác nhau.
*   Tích hợp **Socket.io** trên môi trường local để hỗ trợ tương tác thời gian thực.

### 2.2 Kết nối MongoDB (Mongoose)
Nhóm sử dụng thư viện **Mongoose** để quản lý kết nối và định nghĩa cấu trúc dữ liệu:
*   **URI Connection:** Dữ liệu kết nối được lưu trong file `MyConstants.js` (hoặc biến môi trường `.env`). Hệ thống tự động phân biệt giữa kết nối **MongoDB Atlas (Cloud)** và **MongoDB Local**.
*   **Cơ chế Singleton:** Sử dụng biến `cached` để lưu trữ kết nối, tránh việc khởi tạo lại kết nối nhiều lần khi Serverless function (như trên Vercel) được triệu gọi.
*   **Hàm `connectDB`:** Hàm bất đồng bộ (async/await) để đảm bảo kết nối thành công trước khi Server xử lý các yêu cầu API.

---

## 3. GIỚI THIỆU DATABASE CỦA NHÓM
Cơ sở dữ liệu được thiết kế theo dạng phi quan hệ (NoSQL) với 5 Collections chính:

1.  **Categories (Danh mục):** Lưu tên danh mục và mối quan hệ cha-con (`parentId`) để tạo menu đa cấp.
2.  **Products (Sản phẩm):** Lưu thông tin tên, giá, hình ảnh, ngày tạo, liên kết tới danh mục và danh sách các biến thể (size/số lượng tồn kho).
3.  **Customers (Khách hàng):** Lưu thông tin tài khoản (username/password), thông tin cá nhân (name, phone, email) và trạng thái kích hoạt tài khoản.
4.  **Orders (Đơn hàng):** Lưu thông tin ngày đặt, tổng tiền, trạng thái (PENDING/APPROVED/CANCELED), thông tin khách hàng và danh sách sản phẩm trong giỏ hàng.
5.  **Banners (Poster):** Lưu thông tin nội dung quảng cáo động trên trang chủ (Title, Description, Image, Link).

---

## 4. NHỮNG CHỨC NĂNG API ĐÃ VIẾT

Hệ thống API được phân chia rõ ràng thành các module:

### 4.1 API Khách hàng (Customer)
*   **Auth:** `/api/customer/signup`, `/api/customer/login`, `/api/customer/active`.
*   **Product:** 
    *   Lấy sản phẩm mới nhất: `/api/customer/products/new`.
    *   Lấy sản phẩm bán chạy: `/api/customer/products/hot`.
    *   Lấy toàn bộ sản phẩm: `/api/customer/products`.
    *   Lấy theo danh mục: `/api/customer/products/category/:cid`.
    *   Tìm kiếm: `/api/customer/products/search/:keyword`.
*   **Category:** `/api/customer/categories/tree` (lấy dạng cây cho menu).
*   **Order:** Checkout đơn hàng (`/api/customer/checkout`) và xem lịch sử đơn hàng.
*   **Banner:** Lấy dữ liệu poster trang chủ (`/api/customer/banners`).

### 4.2 API Quản trị (Admin)
*   Quản lý danh mục (CRUD): `/api/admin/categories`.
*   Quản lý sản phẩm (CRUD): `/api/admin/products`.
*   Quản lý đơn hàng: Duyệt đơn, cập nhật trạng thái.
*   Quản lý Banner: Thêm/Sửa/Xóa poster trang chủ.

---

## 5. KIẾN THỨC REACTJS ĐÃ ÁP DỤNG

Nhóm đã sử dụng các kiến thức cốt lõi của ReactJS để xây dựng giao diện:

1.  **Vòng đời Component (Lifecycle):**
    *   Nhóm chủ yếu sử dụng `componentDidMount` trong Class Components để thực hiện các yêu cầu API ngay sau khi component được render lần đầu (ví dụ: lấy danh sách sản phẩm, banner).
    *   Sử dụng `componentDidUpdate` để phản hồi các thay đổi của `props` (ví dụ: khi người dùng chọn một danh mục khác trên URL, danh sách sản phẩm sẽ được fetch lại).
2.  **Hệ thống Router (React Router DOM):**
    *   Sử dụng `<BrowserRouter>`, `<Routes>` và `<Route>` để định nghĩa các đường dẫn như `/home`, `/product`, `/mycart`, `/login`...
    *   Sử dụng `useParams` (thông qua `withRouter` helper) để lấy ID sản phẩm hoặc ID danh mục từ URL.
3.  **Tương tác giao diện (Events):**
    *   **onClick:** Sử dụng để xử lý việc chọn sản phẩm, thêm vào giỏ hàng, chuyển trang, hoặc đóng mở dropdown.
    *   **onChange:** Sử dụng trong các form tìm kiếm và form nhập liệu (Login/Signup) để đồng bộ dữ liệu vào `state` của component.
    *   **onMouseEnter/onMouseLeave:** Sử dụng để tạo hiệu ứng menu đa cấp (Mega Menu) chuyên nghiệp.

---

## 6. NHỮNG CHỨC NĂNG ỨNG DỤNG ĐÃ LÀM ĐƯỢC

Dự án đã hoàn thành đầy đủ các chức năng của một website E-commerce thực thụ:

### 6.1 Phía Khách hàng (Customer Site)
*   Giao diện thiết kế theo concept **Premium Eco-brand** (màu trắng tinh khôi, bo góc mềm mại).
*   Hệ thống Menu đa cấp thông minh.
*   Banner động cho phép thay đổi Poster trang chủ linh hoạt.
*   Luồng mua hàng trọn gói: Chọn size -> Giỏ hàng -> Thanh toán qua VietQR.
*   Hệ thống xác thực: Đăng ký, đăng nhập và kích hoạt tài khoản qua Email.

### 6.2 Phía Quản trị (Admin Dashboard)
*   Thống kê và quản lý toàn bộ dữ liệu (Sản phẩm, Danh mục, Đơn hàng, Banner).
*   Tính năng upload và nén ảnh tự động để tối ưu dung lượng server.
*   Hệ thống duyệt đơn hàng chuyển đổi trạng thái (Chờ duyệt -> Đã duyệt).

---
**Dự án được xây dựng với sự tâm huyết để mang lại trải nghiệm mua sắm tốt nhất và truyền tải giá trị của sống xanh tới khách hàng.**
