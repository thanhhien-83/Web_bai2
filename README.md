# Web_bai2
Bài tập 02: Lập trình web.
==============================
NGÀY GIAO: 19/10/2025
==============================
DEADLINE: 26/10/2025
==============================
1. Sử dụng github để ghi lại quá trình làm, tạo repo mới, để truy cập public, edit file `readme.md`:
   chụp ảnh màn hình (CTRL+Prtsc) lúc đang làm, paste vào file `readme.md`, thêm mô tả cho ảnh.
2. NỘI DUNG BÀI TẬP:
2.1. Cài đặt Apache web server:
- Vô hiệu hoá IIS: nếu iis đang chạy thì mở cmd quyền admin để chạy lệnh: iisreset /stop
- Download apache server, giải nén ra ổ D, cấu hình các file:
  + D:\Apache24\conf\httpd.conf
  + D:Apache24\conf\extra\httpd-vhosts.conf
  để tạo website với domain: fullname.com
  code web sẽ đặt tại thư mục: `D:\Apache24\fullname` (fullname ko dấu, liền nhau)
- sử dụng file `c:\WINDOWS\SYSTEM32\Drivers\etc\hosts` để fake ip 127.0.0.1 cho domain này
  ví dụ sv tên là: `Đỗ Duy Cốp` thì tạo website với domain là fullname ko dấu, liền nhau: `doduycop.com`
- thao tác dòng lệnh trên file `D:\Apache24\bin\httpd.exe` với các tham số `-k install` và `-k start` để cài đặt và khởi động web server apache.
2.2. Cài đặt nodejs và nodered => Dùng làm backend:
- Cài đặt nodejs:
  + download file `https://nodejs.org/dist/v20.19.5/node-v20.19.5-x64.msi`  (đây ko phải bản mới nhất, nhưng ổn định)
  + cài đặt vào thư mục `D:\nodejs`
- Cài đặt nodered:
  + chạy cmd, vào thư mục `D:\nodejs`, chạy lệnh `npm install -g --unsafe-perm node-red --prefix "D:\nodejs\nodered"`
  + download file: https://nssm.cc/release/nssm-2.24.zip
    giải nén được file nssm.exe
    copy nssm.exe vào thư mục `D:\nodejs\nodered\`
  + tạo file "D:\nodejs\nodered\run-nodered.cmd" với nội dung (5 dòng sau):
@echo off
REM fix path
set PATH=D:\nodejs;%PATH%
REM Run Node-RED
node "D:\nodejs\nodered\node_modules\node-red\red.js" -u "D:\nodejs\nodered\work" %*
  + mở cmd, chuyển đến thư mục: `D:\nodejs\nodered`
  + cài đặt service `a1-nodered` bằng lệnh: nssm.exe install a1-nodered "D:\nodejs\nodered\run-nodered.cmd"
  + chạy service `a1-nodered` bằng lệnh: `nssm start a1-nodered`
2.3. Tạo csdl tuỳ ý trên mssql (sql server 2022), nhớ các thông số kết nối: ip, port, username, password, db_name, table_name
2.4. Cài đặt thư viện trên nodered:
- truy cập giao diện nodered bằng url: http://localhost:1880
- cài đặt các thư viện: node-red-contrib-mssql-plus, node-red-node-mysql, node-red-contrib-telegrambot, node-red-contrib-moment, node-red-contrib-influxdb, node-red-contrib-duckdns, node-red-contrib-cron-plus
- Sửa file `D:\nodejs\nodered\work\settings.js` : 
  tìm đến chỗ adminAuth, bỏ comment # ở đầu dòng (8 dòng), thay chuỗi mã hoá mật khẩu bằng chuỗi mới
    adminAuth: {
        type: "credentials",
        users: [{
            username: "admin",
            password: "chuỗi_mã_hoá_mật_khẩu",
            permissions: "*"
        }]
    },   
   với mã hoá mật khẩu có thể thiết lập bằng tool: https://tms.tnut.edu.vn/pw.php
- chạy lại nodered bằng cách: mở cmd, vào thư mục `D:\nodejs\nodered` và chạy lệnh `nssm restart a1-nodered`
  khi đó nodered sẽ yêu cầu nhập mật khẩu mới vào được giao diện cho admin tại: http://localhost:1880
2.5. tạo api back-end bằng nodered:
- tại flow1 trên nodered, sử dụng node `http in` và `http response` để tạo api
- thêm node `MSSQL` để truy vấn tới cơ sở dữ liệu
- logic flow sẽ gồm 4 node theo thứ tự sau (thứ tự nối dây): 
  1. http in  : dùng GET cho đơn giản, URL đặt tuỳ ý, ví dụ: /timkiem
  2. function : để tiền xử lý dữ liệu gửi đến
  3. MSSQL: để truy vấn dữ liệu tới CSDL, nhận tham số từ node tiền xử lý
  4. http response: để phản hồi dữ liệu về client: Status Code=200, Header add : Content-Type = application/json
  có thể thêm node `debug` để quan sát giá trị trung gian.
- test api thông qua trình duyệt, ví dụ: http://localhost:1880/timkiem?q=thị
2.6. Tạo giao diện front-end:
- html form gồm các file : index.html, fullname.js, fullname.css
  cả 3 file này đặt trong thư mục: `D:\Apache24\fullname`
  nhớ thay fullname là tên của bạn, viết liền, ko dấu, chữ thường, vd tên là Đỗ Duy Cốp thì fullname là `doduycop`
  khi đó 3 file sẽ là: index.html, doduycop.js và doduycop.css
- index.html và fullname.css: trang trí tuỳ ý, có dấu ấn cá nhân, có form nhập được thông tin.
- fullname.js: lấy dữ liệu trên form, gửi đến api nodered đã làm ở bước 2.5, nhận về json, dùng json trả về để tạo giao diện phù hợp với kết quả truy vấn của bạn.
2.7. Nhận xét bài làm của mình:
- đã hiểu quá trình cài đặt các phần mềm và các thư viện như nào?
- đã hiểu cách sử dụng nodered để tạo api back-end như nào?
- đã hiểu cách frond-end tương tác với back-end ra sao?
==============================
TIÊU CHÍ CHẤM ĐIỂM:
1. y/c bắt buộc về thời gian: ko quá Deadline, quá: 0 điểm (ko có ngoại lệ)
2. cài đặt được apache và nodejs và nodered: 1đ
3. cài đặt được các thư viện của nodered: 1đ
4. nhập dữ liệu demo vào sql-server: 1đ
5. tạo được back-end api trên nodered, test qua url thành công: 1đ
6. tạo được front-end html css js, gọi được api, hiển thị kq: 1đ
7. trình bày độ hiểu về toàn bộ quá trình (mục 2.7): 5đ
==============================
GHI CHÚ:
1. yêu cầu trên cài đặt trên ổ D, nếu máy ko có ổ D có thể linh hoạt chuyển sang ổ khác, path khác.
2. có thể thực hiện trực tiếp trên máy tính windows, hoặc máy ảo
3. vì csdl là tuỳ ý: sv cần mô tả rõ db chứa dữ liệu gì, nhập nhiều dữ liệu test có nghĩa, json trả về sẽ có dạng như nào cũng cần mô tả rõ.
4. có thể xây dựng nhiều API cùng cơ chế, khác tính năng: như tìm kiếm, thêm, sửa, xoá dữ liệu trong DB.
5. bài làm phải có dấu ấn cá nhân, nghiêm cấm mọi hình thức sao chép, gian lận (sẽ cấm thi nếu bị phát hiện gian lận).
6. bài tập thực làm sẽ tốn nhiều thời gian, sv cần chứng minh quá trình làm: save file `readme.md` mỗi khoảng 15-30 phút làm : lịch sử sửa đổi sẽ thấy quá trình làm này!
7. nhắc nhẹ: github ko fake datetime được.
8. sv được sử dụng AI để tham khảo.
==============================
DEADLINE: 26/10/2025
=============================
## BÀI LÀM
# 2.1 Apache:  
o	Tắt IIS: iisreset /stop.  
o	Giải nén Apache vào E:\Apache24, chỉnh httpd.conf và extra\httpd-vhosts.conf để DocumentRoot = E:\Apache24\huathithanhhien, ServerName = huathithanhhien.com.  
o	Sửa file hosts: thêm "127.0.0.1 huathithanhhien.com".  
o	Cài service và khởi động: E:\Apache24\bin\httpd.exe -k install && E:\Apache24\bin\httpd.exe -k start.  
o	Kiểm tra: mở http://huathithanhhien.com; xem E:\Apache24\logs\error.log; dùng netstat -ano | findstr :80 nếu port bị chiếm.  
Hình 1:  
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/5a6da29b-7ed0-4969-9481-e9dc6e74156b" />  

# 2.2 Node.js & Node-RED:  
o	Cài Node.js vào E:\nodejs (dùng bản ổn định đề nghị).  
o	Cài Node-RED: npm install -g --unsafe-perm node-red --prefix "E:\nodejs\nodered".  
o	Tạo run-nodered.cmd với PATH fix và lệnh chạy red.js; dùng nssm để tạo service: nssm install a1-nodered "E:\nodejs\nodered\run-nodered.cmd" và nssm start a1-nodered.  
o	Kiểm tra: mở http://localhost:1880; nếu service lỗi, chạy run-nodered.cmd tay để debug.  
Hình 2:  
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/62c4a70d-2aa3-4df2-a63e-60d5d2b9c9f4" />  

# 2.3 MSSQL:  
o	Tạo database và bảng demo, chèn dữ liệu mẫu (bao gồm tiếng Việt và ký tự đặc biệt).  
o	Bật TCP/IP trong SQL Server Configuration Manager và mở port 1433 nếu cần (firewall).  
o	Ghi lại ip, port, username, password, db_name, table_name để dùng trong Node-RED.  
o	Kiểm tra: dùng SSMS hoặc sqlcmd chạy SELECT để xác nhận dữ liệu.  
Hình 3:  
<img width="852" height="568" alt="image" src="https://github.com/user-attachments/assets/941499e5-e950-441e-81f3-50c31023e9b7" />  

# 2.4 Cài node trên Node-RED & adminAuth:  
o	Cài các node cần thiết: node-red-contrib-mssql-plus, node-red-node-mysql, node-red-contrib-telegrambot, node-red-contrib-moment, node-red-contrib-influxdb, node-red-contrib-duckdns, node-red-contrib-cron-plus.  
o	Bật adminAuth trong E:\nodejs\nodered\work\settings.js bằng password đã mã hóa (tạo hash bằng tool được chỉ dẫn).  
o	Restart service nssm restart a1-nodered và kiểm tra yêu cầu login.  
Hình 4:   
<img width="976" height="588" alt="image" src="https://github.com/user-attachments/assets/aaa1171d-0728-49b5-8372-6698d6fdd71c" />  

# 2.5 Tạo API trên Node-RED:  
o	Thiết kế flow: http in (GET /timkiem) → function (lấy/validate q) → MSSQL (parameterized query) → http response (status 200, Content-Type: application/json).  
o	Function node: validate input, gán params; MSSQL: dùng parameterized để tránh SQL injection.  
o	Kiểm tra: truy cập http://localhost:1880/timkiem?q=... và bật debug node giữa các bước.  
Hình 5:   
<img width="1864" height="823" alt="image" src="https://github.com/user-attachments/assets/a018245e-a5c5-43c0-84a0-1e71380b4c2b" />  

Hình 6: 
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/8be76f6a-d979-4960-8c5b-a65d486bd662" />  

# 2.6 Front-end:  
o	Đặt index.html, huathithanhhien.css, huathithanhhien.js trong E:\Apache24\huathithanhhien (
o	huathithanhhien.js dùng fetch('/timkiem?q=...') hoặc fetch('http://huathithanhhien.com/timkiem?q=...') để lấy JSON, render DOM, xử lý loading và lỗi.  
o	Nếu front-end và Node-RED khác domain/port thì xử lý CORS hoặc phục vụ cùng domain.  
Hình 7:  
<img width="1712" height="862" alt="image" src="https://github.com/user-attachments/assets/c132e4c4-4665-460d-99d1-9877baf9364c" />  

# 2.7 Nhận xét về bài làm của bản thân:  
Đã nắm được quy trình cài đặt, cách tạo API bằng Node-RED và cách front-end tương tác với backend; đã ghi ảnh minh chứng và logs.  
•	Kiểm tra nhanh trước nộp:  
o	Mở frontend (huathithanhhien.com) — trang hiển thị; mở Node-RED (http://localhost:1880) — flow có thể chỉnh; test API /timkiem?q=... — trả JSON; SSMS show dữ liệu demo; chụp screenshots (Apache, Node-RED flow, SSMS, service list).  
•	Lỗi phổ biến & fix nhanh:  
o	Port 80 bị chiếm → iisreset /stop hoặc tìm process bằng netstat.  
o	Node-RED service không chạy → kiểm tra run-nodered.cmd/ PATH, chạy tay debug.  
o	MSSQL không kết nối → bật TCP/IP + mở firewall + kiểm tra user/password.  
o	Query trả rỗng hoặc lỗi encoding → kiểm tra tên table/column và charset UTF-8.  
•	Bảo mật & lưu ý:  
o	Không commit mật khẩu/credential vào repo; dùng password hash cho adminAuth.  
o	Cân nhắc HTTPS khi public và lưu secrets ngoài repo (env vars hoặc file config không commit).  

