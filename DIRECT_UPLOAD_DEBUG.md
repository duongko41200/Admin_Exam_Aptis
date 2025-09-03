# Direct Upload Debug Guide

## Các bước troubleshooting

### 1. Kiểm tra R2 Configuration

```bash
# Kiểm tra environment variables
echo $R2_ACCOUNT_ID
echo $R2_ACCESS_KEY_ID
echo $R2_SECRET_ACCESS_KEY
echo $R2_BUCKET_NAME
```

### 2. Test R2 Connection

```bash
# Call test endpoint
curl -X GET http://localhost:3333/v1/api/video/test-r2 \
  -H "Authorization: your-token" \
  -H "x-client-id: your-client-id" \
  -H "x-api-key: your-api-key"
```

### 3. Test Initialize Direct Upload

```bash
curl -X POST http://localhost:3333/v1/api/video/direct-upload/init \
  -H "Content-Type: application/json" \
  -H "Authorization: your-token" \
  -H "x-client-id: your-client-id" \
  -H "x-api-key: your-api-key" \
  -d '{
    "fileName": "test.mp4",
    "fileSize": 10485760,
    "userId": "test-user",
    "partCount": 2
  }'
```

### 4. Các lỗi thường gặp

#### "Failed to initialize direct upload"

- Kiểm tra R2 credentials
- Kiểm tra bucket name
- Kiểm tra network connection

#### "R2 client not initialized"

- Restart server
- Kiểm tra imports trong service

#### "Missing required fields"

- Kiểm tra request body
- Validate fileName, fileSize

### 5. Debug logs cần chú ý

#### Server side:

```
🔧 Initializing VideoUploadService...
✅ VideoUploadService initialized: { bucketName: 'aptis-files', hasClient: true, hasConfig: true }
🔧 Generating direct upload URLs: { fileName: 'test.mp4', fileSize: 10485760, userId: 'test-user', options: { partCount: 2 } }
📊 Upload plan: { key: 'videos/2025/09/1725345600000_a1b2c3d4_test.mp4', totalParts: 2, fileSize: 10485760 }
🔧 Creating multipart upload command...
✅ Multipart upload created: UPLOAD_ID_HERE
🔧 Generating presigned URLs for 2 parts...
✅ Generated signed URL for part 1/2
✅ Generated signed URL for part 2/2
✅ Generated 2 presigned URLs
```

#### Client side:

```
🔧 Calling initializeDirectUpload API: { fileName: 'test.mp4', fileSize: 10485760, userId: 'test-user', partCount: 2 }
📡 API Response: { success: true, data: { uploadId: '...', key: '...', presignedUrls: [...] } }
✅ Initialize direct upload successful: { uploadId: '...', key: '...', presignedUrls: [...] }
📦 Direct upload initialized: UPLOAD_ID_HERE
⬆️ Uploading part 1/2
⬆️ Uploading part 2/2
🔗 Completing direct multipart upload...
✅ Direct upload completed: https://r2-domain.com/videos/2025/09/file.mp4
```

### 6. Expected file structure after upload

```
R2 Bucket: aptis-files
├── videos/
│   └── 2025/
│       └── 09/
│           └── 1725345600000_a1b2c3d4_filename.mp4
```

### 7. Test với file nhỏ trước

- Dùng file < 50MB để test
- Check console logs từng bước
- Verify presigned URLs được tạo
- Test upload từng part
