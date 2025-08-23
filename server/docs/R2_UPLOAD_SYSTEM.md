# Cloudflare R2 File Upload System

## 📋 **Overview**

Hệ thống upload file sử dụng Cloudflare R2 với đầy đủ chức năng CRUD, được thiết kế clean, scalable và dễ bảo trì.

## 🏗️ **Architecture**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend UI   │───▶│  R2 Controller  │───▶│   R2 Service    │
│   (React App)   │    │  (Express API)  │    │  (Business Log) │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │   Multer MW     │    │   R2 Config     │
                       │ (File Handler)  │    │ (AWS S3 Client) │
                       └─────────────────┘    └─────────────────┘
                                                        │
                                                        ▼
                                             ┌─────────────────┐
                                             │ Cloudflare R2   │
                                             │   (Storage)     │
                                             └─────────────────┘
```

## 🔧 **Setup Instructions**

### 1. **Environment Configuration**

Thêm vào file `.env`:

```bash
# Cloudflare R2 Configuration
R2_ACCOUNT_ID=your_account_id_here
R2_ACCESS_KEY_ID=your_access_key_here
R2_SECRET_ACCESS_KEY=your_secret_access_key_here
R2_BUCKET_NAME=aptis-files
R2_PUBLIC_URL=https://your-bucket-name.your-subdomain.r2.cloudflarestorage.com
```

### 2. **Cloudflare R2 Setup**

1. Đăng nhập vào Cloudflare Dashboard
2. Vào phần R2 Object Storage
3. Tạo bucket mới với tên `aptis-files`
4. Tạo R2 Token với quyền:
   - Object Read
   - Object Write
   - Object Delete
5. Cấu hình Custom Domain (optional)

### 3. **Install Dependencies**

```bash
cd server
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

## 📂 **File Structure**

```
server/src/
├── configs/
│   └── r2.config.js         # R2 configuration & client setup
├── services/
│   └── r2.service.js        # Core R2 operations (CRUD)
├── controllers/
│   └── r2.controller.js     # HTTP request handlers
├── routes/
│   └── r2/
│       └── index.js         # API endpoints
└── utils/
    └── fileValidation.js    # File validation utilities
```

## 🎯 **API Endpoints**

### **Upload Operations**

```http
# Upload single file
POST /v1/api/r2/upload/single
Content-Type: multipart/form-data
Body:
  - file: [File]
  - fileType: "listening" | "speaking" | "reading" | "writing" | "general"

# Upload multiple files
POST /v1/api/r2/upload/multiple
Content-Type: multipart/form-data
Body:
  - files: [File[]] (max 10 files)
  - fileType: "listening" | "speaking" | "reading" | "writing" | "general"
```

### **File Management**

```http
# Get file info
GET /v1/api/r2/file/info/:key

# Generate presigned URL
GET /v1/api/r2/file/presigned/:key?expiresIn=3600

# Delete file
DELETE /v1/api/r2/file/:key

# Delete multiple files
DELETE /v1/api/r2/files/multiple
Body: { "keys": ["file1.jpg", "file2.mp3"] }

# List files
GET /v1/api/r2/files/list?prefix=listening/2024&maxKeys=100

# Copy file
POST /v1/api/r2/file/copy
Body: {
  "sourceKey": "old/path/file.jpg",
  "destinationKey": "new/path/file.jpg"
}
```

## 💡 **Usage Examples**

### **Frontend Upload (React)**

```javascript
// Single file upload
const uploadSingleFile = async (file, fileType = "general") => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("fileType", fileType);

  const response = await fetch("/v1/api/r2/upload/single", {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await response.json();
};

// Multiple files upload
const uploadMultipleFiles = async (files, fileType = "general") => {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));
  formData.append("fileType", fileType);

  const response = await fetch("/v1/api/r2/upload/multiple", {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await response.json();
};
```

### **Backend Integration**

```javascript
// In your existing controllers
import r2Service from "../services/r2.service.js";

// Upload file trong listening controller
const result = await r2Service.uploadFile(
  fileBuffer,
  originalName,
  mimeType,
  "listening"
);

if (result.success) {
  // Save file URL to database
  const fileUrl = result.data.url;
  const fileKey = result.data.key;
}
```

## 🗂️ **File Organization**

Files được tự động tổ chức theo cấu trúc:

```
bucket/
├── listening/
│   ├── 2024/
│   │   ├── 01/
│   │   │   ├── 1640995200000_a1b2c3d4_audio_file.mp3
│   │   │   └── 1640995300000_e5f6g7h8_image_file.jpg
│   │   └── 02/
│   └── 2025/
├── speaking/
├── reading/
├── writing/
└── general/
```

## 🔒 **Security Features**

1. **File Type Validation**: Chỉ cho phép các file type được định nghĩa
2. **File Size Limits**: 100MB per file
3. **Authentication**: Requires valid JWT token
4. **Unique Filenames**: Timestamp + hash để tránh conflict
5. **Presigned URLs**: Temporary access links với expiration

## 📊 **Response Format**

### Success Response

```json
{
  "success": true,
  "message": "File uploaded successfully!",
  "metadata": {
    "key": "listening/2024/01/1640995200000_a1b2c3d4_audio.mp3",
    "filename": "1640995200000_a1b2c3d4_audio.mp3",
    "originalName": "audio.mp3",
    "url": "https://your-bucket.r2.cloudflarestorage.com/listening/2024/01/1640995200000_a1b2c3d4_audio.mp3",
    "size": 1024000,
    "mimeType": "audio/mpeg",
    "fileType": "listening",
    "etag": "\"9bb58f26192e4ba00f01e2e7b136bbd8\"",
    "uploadedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Upload failed",
  "error": "File type not allowed"
}
```

## 🚀 **Scaling Considerations**

1. **CDN Integration**: R2 có thể integrate với Cloudflare CDN
2. **Batch Operations**: Support upload/delete multiple files
3. **Background Processing**: Có thể add job queue cho large files
4. **Monitoring**: Add logging và metrics
5. **Backup Strategy**: Cross-region replication

## 🔧 **Maintenance**

### **Environment Variables Checklist**

- [ ] R2_ACCOUNT_ID
- [ ] R2_ACCESS_KEY_ID
- [ ] R2_SECRET_ACCESS_KEY
- [ ] R2_BUCKET_NAME
- [ ] R2_PUBLIC_URL

### **Monitoring Points**

- Upload success rate
- File size distribution
- Storage usage
- API response times
- Error rates by file type

## 📝 **Migration Guide**

### **From Cloudinary to R2**

1. Update environment variables
2. Replace Cloudinary calls với R2 service
3. Update file URLs trong database
4. Test upload/download functionality
5. Update frontend components

Hệ thống này cung cấp foundation mạnh mẽ cho file management, có thể mở rộng theo nhu cầu của project.
