# Web_bai2


•	2.1 Apache:
o	Tắt IIS: iisreset /stop.
o	Giải nén Apache vào D:\Apache24, chỉnh httpd.conf và extra\httpd-vhosts.conf để DocumentRoot = D:\Apache24\fullname, ServerName = fullname.com.
o	Sửa file hosts: thêm "127.0.0.1 fullname.com".
o	Cài service và khởi động: D:\Apache24\bin\httpd.exe -k install && D:\Apache24\bin\httpd.exe -k start.
o	Kiểm tra: mở http://fullname.com; xem D:\Apache24\logs\error.log; dùng netstat -ano | findstr :80 nếu port bị chiếm.
Hình 1:  
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/5a6da29b-7ed0-4969-9481-e9dc6e74156b" />  

•	2.2 Node.js & Node-RED:
o	Cài Node.js vào D:\nodejs (dùng bản ổn định đề nghị).
o	Cài Node-RED: npm install -g --unsafe-perm node-red --prefix "D:\nodejs\nodered".
o	Tạo run-nodered.cmd với PATH fix và lệnh chạy red.js; dùng nssm để tạo service: nssm install a1-nodered "D:\nodejs\nodered\run-nodered.cmd" và nssm start a1-nodered.
o	Kiểm tra: mở http://localhost:1880; nếu service lỗi, chạy run-nodered.cmd tay để debug.
Hình 2: 
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/62c4a70d-2aa3-4df2-a63e-60d5d2b9c9f4" />  

•	2.3 MSSQL:
o	Tạo database và bảng demo, chèn dữ liệu mẫu (bao gồm tiếng Việt và ký tự đặc biệt).
o	Bật TCP/IP trong SQL Server Configuration Manager và mở port 1433 nếu cần (firewall).
o	Ghi lại ip, port, username, password, db_name, table_name để dùng trong Node-RED.
o	Kiểm tra: dùng SSMS hoặc sqlcmd chạy SELECT để xác nhận dữ liệu.
Hình 3: 
<img width="976" height="588" alt="image" src="https://github.com/user-attachments/assets/aaa1171d-0728-49b5-8372-6698d6fdd71c" />  

•	2.4 Cài node trên Node-RED & adminAuth:
o	Cài các node cần thiết: node-red-contrib-mssql-plus, node-red-node-mysql, node-red-contrib-telegrambot, node-red-contrib-moment, node-red-contrib-influxdb, node-red-contrib-duckdns, node-red-contrib-cron-plus.
o	Bật adminAuth trong D:\nodejs\nodered\work\settings.js bằng password đã mã hóa (tạo hash bằng tool được chỉ dẫn).
o	Restart service nssm restart a1-nodered và kiểm tra yêu cầu login.
Hình 4:   
<img width="852" height="568" alt="image" src="https://github.com/user-attachments/assets/941499e5-e950-441e-81f3-50c31023e9b7" />  

•	2.5 Tạo API trên Node-RED:
o	Thiết kế flow: http in (GET /timkiem) → function (lấy/validate q) → MSSQL (parameterized query) → http response (status 200, Content-Type: application/json).
o	Function node: validate input, gán params; MSSQL: dùng parameterized để tránh SQL injection.
o	Kiểm tra: truy cập http://localhost:1880/timkiem?q=... và bật debug node giữa các bước.
Hình 5:   
<img width="1864" height="823" alt="image" src="https://github.com/user-attachments/assets/a018245e-a5c5-43c0-84a0-1e71380b4c2b" />  

•	2.6 Front-end:
o	Đặt index.html, fullname.css, fullname.js trong D:\Apache24\fullname (fullname là tên bạn, viết liền không dấu).
o	fullname.js dùng fetch('/timkiem?q=...') hoặc fetch('http://fullname.com/timkiem?q=...') để lấy JSON, render DOM, xử lý loading và lỗi.
o	Nếu front-end và Node-RED khác domain/port thì xử lý CORS hoặc phục vụ cùng domain.
Hình 6:  
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/8be76f6a-d979-4960-8c5b-a65d486bd662" />  

Hình 7:  
<img width="1712" height="862" alt="image" src="https://github.com/user-attachments/assets/c132e4c4-4665-460d-99d1-9877baf9364c" />
