# BÁO CÁO ĐỒ ÁN: XÂY DỰNG HỆ THỐNG THƯƠNG MẠI ĐIỆN TỬ SHOPQUANAO

## 1. GIỚI THIỆU ĐỀ TÀI VÀ THÀNH VIÊN NHÓM

### Giới thiệu đề tài
Đề tài tập trung vào việc xây dựng một website bán lẻ quần áo thời trang hiện đại, hỗ trợ đầy đủ các tính năng từ quản lý sản phẩm cho đến quy trình đặt hàng và thanh toán trực tuyến. Hệ thống được thiết kế với hai phân hệ chính:
- **Trang khách hàng:** Nơi người dùng xem sảm phẩm, quản lý giỏ hàng và đặt hàng.
- **Trang Admin:** Dành cho quản trị viên quản lý danh mục, sản phẩm, đơn hàng và các chiến dịch banner.

### Thành viên nhóm
1. **Lương Nhật Hào** - MSSV: (Cập nhật MSSV) - Vai trò: Full-stack Developer, Trưởng nhóm.
2. (Cập nhật tên thành viên) - MSSV: (Cập nhật MSSV) - Vai trò: (Cập nhật vai trò)
3. (Cập nhật tên thành viên) - MSSV: (Cập nhật MSSV) - Vai trò: (Cập nhật vai trò)

---

## 2. TRÌNH BÀY CÁCH TẠO SERVER VÀ KẾT NỐI MONGODB

### Khởi tạo Server
Server được xây dựng dựa trên nền tảng **Node.js** và framework **Express**. Các bước thực hiện bao gồm:
- Sử dụng `express` để quản lý các request và routing.
- Cấu hình `body-parser` để xử lý dữ liệu JSON và `cors` để hỗ trợ truy cập từ các origin khác nhau.
- Tích hợp `dotenv` để quản lý bảo mật các biến môi trường như cổng kết nối và chuỗi kết nối Database.

### Kết nối MongoDB
Nhóm sử dụng thư viện **Mongoose** để tương tác với cơ sở dữ liệu MongoDB Atlas. 
- **Cấu hình kết nối:** Được thực hiện tại `server/utils/MongooseUtil.js`.
- **Cơ chế:** Sử dụng hàm `mongoose.connect(uri)` với chuỗi kết nối chứa thông tin định danh (User/Password).
- **Kết nối bền vững:** Được thiết lập trong entry point của server để đảm bảo dữ liệu luôn sẵn sàng trước khi xử lý request.

---

## 3. GIỚI THIỆU DATABASE CỦA NHÓM

Hệ thống sử dụng MongoDB (NoSQL) với các Collection chính được định nghĩa trong `server/models/Models.js`:
- **Categories:** Lưu trữ thông tin danh mục sản phẩm.
- **Products:** Lưu trữ thông tin chi tiết sản phẩm (tên, giá, hình ảnh, kích thước, số lượng tồn).
- **Customers:** Lưu trữ thông tin tài khoản người dùng, email kích hoạt và trạng thái hoạt động.
- **Orders:** Lưu trữ thông tin đơn hàng, danh sách sản phẩm, địa chỉ giao hàng và trạng thái thanh toán.
- **Banners:** Lưu trữ các chiến dịch quảng cáo hiển thị tại trang chủ.

---

## 4. NHỮNG CHỨC NĂNG API ĐÃ VIẾT

Nhóm đã triển khai hệ thống RESTful API toàn diện tại thư mục `server/api/`:
- **Customer API:** 
    - Lấy danh sách sản phẩm theo danh mục, sản phẩm mới, sản phẩm tìm kiếm.
    - Đăng ký (gửi mã kích hoạt qua email), Đăng nhập, Quản lý thông tin cá nhân.
    - Thêm/Xóa sản phẩm vào giỏ hàng.
- **Admin API:** 
    - Quản lý CRUD (Thêm, Đọc, Sửa, Xóa) cho Danh mục, Sản phẩm, Banner.
    - Quản lý và cập nhật trạng thái đơn hàng (Duyệt/Hủy).
    - Quản lý danh sách khách hàng.
- **Payment API:** 
    - Tích hợp tạo mã QR thanh toán tự động (VietQR).
    - API kiểm tra xác nhận thanh toán thành công.

---

## 5. KIẾN THỨC VỀ REACTJS ĐÃ ÁP DỤNG

Nhóm đã sử dụng ReactJS để phát triển hai ứng dụng Single Page Application (SPA) với các kiến thức nâng cao:
- **Class Components & Lifecycle:** Sử dụng `componentDidMount`, `componentWillUnmount` để quản lý việc fetch dữ liệu và kết nối Socket.
- **React Router:** Sử dụng `react-router-dom` để điều hướng trang mà không cần tải lại trình duyệt.
- **Context API:** Sử dụng `MyContext` để quản lý trạng thái chung (Global State) như thông tin đăng nhập và giỏ hàng.
- **Axios:** Thư viện gọi API chính với cấu hình header `x-access-token` để xác thực người dùng.
- **State Management:** Quản lý dữ liệu động trong component như form input, danh sách sản phẩm và trạng thái tải trang (loading).

---

## 6. CHỨC NĂNG ỨNG DỤNG ĐÃ LÀM ĐƯỢC

1. **Giao diện người dùng hiện đại:** Sử dụng CSS cao cấp với hiệu ứng Glassmorphism và layout Adidas-style.
2. **Hệ thống Banner động:** Admin có thể upload ảnh banner trực tiếp để thay đổi diện mạo trang chủ (Hero section).
3. **Quản lý kho hàng chuyên sâu:** Hỗ trợ quản lý sản phẩm theo kích thước (Size) và số lượng tồn kho từng loại.
4. **Quy trình Thanh toán tối ưu:** 
    - Hệ thống tính phí ship động.
    - Tích hợp thanh toán QR ngân hàng tự động.
    - Xác nhận đơn hàng qua Email Marketing.
5. **Trang Quản trị thông minh:** 
    - Dashboard thống kê trực quan.
    - Hệ thống tìm kiếm và lọc dữ liệu nâng cao.
    - Hỗ trợ xem trước (Preview) hình ảnh sản phẩm ngay khi đăng tải.
6. **Deploy:** Ứng dụng đã được deploy hoàn chỉnh lên Vercel để sử dụng trực tuyến.
