# Hướng dẫn triển khai Node.js/Next.js lên VPS Ubuntu

## Mục lục

1. Tạo và cấu hình SSH Key
2. Truy cập VPS và tạo user mới
3. Thêm SSH Key cho user mới
4. Cài đặt Node.js và NVM
5. Cấu hình Git trên VPS
6. Deploy dự án Node.js/Next.js
7. Cấu hình domain và Nginx
8. Cài đặt SSL với Certbot
9. Kích hoạt HTTP/2
10. Tổng kết

---

## 1. Tạo và cấu hình SSH Key

### 1.1. Tạo SSH Key trên máy cá nhân

Nếu đã có SSH Key, bỏ qua bước này.

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

- Email dùng để gắn nhãn cho SSH Key.
- Khi được hỏi tên file, nhấn Enter để dùng mặc định.
- Khi được hỏi passphrase, có thể bỏ qua bằng cách nhấn Enter.

### 1.2. Lấy nội dung public key

- Mở file `.pub` bằng Notepad hoặc lệnh:
  ```bash
  cat ~/.ssh/id_ed25519.pub
  ```

---

## 2. Truy cập VPS và tạo user mới

### 2.1. Truy cập VPS bằng SSH

```bash
ssh root@ip_address
```

- Nếu dùng file private key khác mặc định:
  ```bash
  ssh -i /path/to/your/id_rsa root@ip_address

  #ex: ssh -i /mnt/c/Users/hp/Downloads/CS-Linux-20250916211320414.pem root@103.57.223.211 -p 24700
  ```

### 2.2. Tạo user mới và cấp quyền sudo

```bash
adduser username
usermod -aG sudo username
```

- Đổi `username` thành tên user mong muốn.
 #### * Nếu muốn chuyển sang quyền user lần sau vào thì chỉ cần:
```bash
ssh username@id_address -p port
## ssh duong@103.57.223.211 -p  24700
```


### 2.3. Chuyển sang user mới

```bash
su - username
```

---

## 3. Thêm SSH Key cho user mới

🥈Thêm ssh key ở máy cá nhân vào user mới tạo trên VPS
Hiện tại thì chúng ta truy cập vào VPS với user root thì không cần nhập mật khẩu, nhưng với user mới tạo thì cần phải nhập. Điều này không cần thiết và cũng không an toàn. Chúng ta có thể truy cập không cần nhập mật khẩu tương tự với root.

Vậy nên chúng ta cần thêm ssh key vào user mới tạo, còn user root thì nó đã tự động được thêm lúc deploy VPS rồi.

🚀Cách 1 thì chúng ta công cụ ssh-copy-id (cái ssh-copy-id này đã cài sẵn trên git bash, các máy linux, mac workstation thì có thể cài theo hướng dẫn này)

Thay thế ~/.ssh/id_rsa.pub thành đường dẫn public key anh em, root@192.0.2.123 thành username và ip address tương ứng.

```bash
ssh-copy-id -i ~/.ssh/id_rsa.pub root@192.0.2.123

# ex:

```

### 3.1. Tạo thư mục và file SSH

```bash
mkdir ~/.ssh
sudo touch ~/.ssh/authorized_keys
sudo nano ~/.ssh/authorized_keys
```

- Dán public key vào file, lưu lại.

---

## 4. Cài đặt Node.js và NVM

### 4.1. Cập nhật hệ thống

```bash
sudo apt-get update
sudo apt-get upgrade
```

### 4.2. Cài đặt NVM

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```

- Đăng xuất và đăng nhập lại để dùng NVM.

### 4.3. Cài Node.js

```bash
nvm install 21      # Hoặc phiên bản mong muốn
nvm install node    # Phiên bản mới nhất
node -v             # Kiểm tra version
```

---

## 5. Cấu hình Git trên VPS

### 5.1. Tạo SSH Key trên VPS (nếu cần)

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
cat ~/.ssh/id_ed25519.pub
```

- Thêm public key vào Github.

### 5.2. Clone repo về VPS

```bash
git clone git@github.com:usernameGithub/repoName.git
```

---

## 6. Deploy dự án Node.js/Next.js

### 6.1. Cài đặt Yarn và PM2

```bash
npm install yarn -g
npm install pm2 -g
```

### 6.2. Cài đặt package và build dự án

```bash
cd repoName
yarn
yarn build      # Với Next.js
yarn start      # Chạy thử
```

### 6.3. Quản lý tiến trình với PM2

```bash
pm2 start --name=appName yarn -- start # start thay bang lenh chayj du an ( ex: dev)
### nếu tắt liên kết với window thì phải tải lại 
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt update
sudo apt install yarn

pm2 start yarn --name admin --cwd /mnt/c/Users/hp/Admin_Exam_Aptis/aptisUI -- dev
`



pm2 startup systemd # tu dong restart 

###### khi chay xong thi se chay them lenh de xuat neu loi chay lenh ben duoi
export PATH=$HOME/.nvm/versions/node/v22.19.0/bin:/usr/bin:/bin
sudo env PATH=$PATH pm2 startup systemd -u duongko113 --hp /home/duongko113

############################################################################
pm2 ls
pm2 save
pm2 startup
# Chạy lệnh được in ra để kích hoạt pm2 khi khởi động lại VPS
```

---

## 7. Cấu hình domain và Nginx

### 7.1. Trỏ domain về VPS

- Tạo bản ghi DNS:
  - `@ - A - ip_vps_address - 300`
  - `www - CNAME - domain.com - 300`

### 7.2. Cài đặt Nginx

```bash
sudo apt-get update && sudo apt-get install nginx
```

### 7.3. Cấu hình firewall

```bash
sudo apt update
sudo apt install ufw -y

sudo ufw allow 'Nginx Full'
sudo ufw allow ssh
sudo ufw enable
sudo systemctl enable ufw
```

### 7.4. Tạo file cấu hình Nginx cho domain

```bash
cd /etc/nginx/sites-available
sudo touch domain.com
sudo nano domain.com
```

- Ví dụ cấu hình reverse proxy:
  ```nginx
  server {
      listen 80;
      listen [::]:80;
      server_name domain.com www.domain.com;
      location / {
          proxy_pass http://localhost:3000;
          proxy_http_version 1.1;
          proxy_set_header Upgrade $http_upgrade;
          proxy_set_header Connection 'upgrade';
          proxy_set_header Host $host;
          proxy_cache_bypass $http_upgrade;
      }
  }
  ```
- Kích hoạt cấu hình:
  ```bash
  sudo ln -s /etc/nginx/sites-available/domain.com /etc/nginx/sites-enabled/
  sudo nginx -t
  sudo systemctl restart nginx
  ```

---

## 8. Cài đặt SSL với Certbot

### 8.1. Cài Certbot

```bash
sudo apt update
sudo apt install snapd
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot
```

### 8.2. Lấy chứng chỉ SSL

```bash
sudo certbot --nginx
```

- Làm theo hướng dẫn, chọn domain, nhập email.

### 8.3. Kiểm tra tự động gia hạn

```bash
sudo certbot renew --dry-run
```

---

## 9. Kích hoạt HTTP/2

- Mở file cấu hình Nginx cho domain:
  ```bash
  sudo nano /etc/nginx/sites-enabled/domain.com
  ```
- Thêm `http2` vào dòng `listen 443 ssl;`:
  ```
  listen 443 ssl http2;
  ```
- Kiểm tra và restart Nginx:
  ```bash
  sudo nginx -t
  sudo systemctl restart nginx
  ```

---

## 10. Tổng kết

Bạn đã hoàn thành việc triển khai ứng dụng Node.js/Next.js lên VPS Ubuntu, cấu hình domain, reverse proxy với Nginx, mã hóa HTTPS/SSL, và quản lý tiến trình với PM2. Khi cần cập nhật code, chỉ cần:

```bash
cd repoName && git pull && yarn build && pm2 restart appName
```

---

**Tham khảo thêm:**

- [NVM](https://github.com/nvm-sh/nvm)
- [PM2](https://pm2.keymetrics.io/)
- [Certbot](https://certbot.eff.org/instructions)
- [Nginx Docs](https://nginx.org/en/docs/)
