# Test Direct Upload Video Component

## Workflow cho Direct Upload

### 1. Chọn Direct Upload Method

- User chọn "Direct Upload" từ upload method selection
- UI hiển thị:
  - Input field "URL Video (sau khi upload)"
  - File selection area
  - Không có nút upload ban đầu

### 2. Chọn File

- User chọn file video
- UI hiển thị:
  - File info với preview
  - Input URL vẫn trống
  - Nút "Upload Video lên R2" xuất hiện
  - Status: "File đã chọn - Sẵn sàng upload"

### 3. Upload Process

- User nhấn nút "Upload Video lên R2"
- Progress bar hiển thị:
  - "Khởi tạo upload..." (5%)
  - "Đang upload file..." (5-90%)
  - "Hoàn thiện upload..." (90-100%)
- Status messages cập nhật theo tiến trình

### 4. Upload Complete

- URL video được tự động điền vào input "URL Video"
- Status: "✅ Direct Upload Hoàn Thành!"
- Video preview hiển thị từ URL đã upload
- Nút upload biến mất

### 5. Integration với Form

- Method `uploadVideo()` trả về URL từ input
- Method `hasFile()` kiểm tra có URL hoặc file
- Method `getVideoUrl()` trả về URL hiện tại

## Testing Checklist

### UI Tests

- [ ] Upload method selection hiển thị đúng
- [ ] Input URL hiển thị khi chọn Direct Upload
- [ ] File selection area hiển thị đúng
- [ ] Nút upload xuất hiện sau khi chọn file
- [ ] Progress bar hoạt động trong upload
- [ ] Status messages cập nhật đúng
- [ ] URL tự động điền sau upload
- [ ] Video preview hiển thị từ URL

### Functional Tests

- [ ] File validation hoạt động
- [ ] Upload process hoàn tất thành công
- [ ] Error handling khi upload fail
- [ ] Cleanup states khi remove file
- [ ] Integration với parent component

### API Tests

- [ ] `initializeDirectUpload` API call
- [ ] `uploadPartToR2` cho từng part
- [ ] `completeMultipartUpload` API call
- [ ] Error handling cho API failures

## Expected URLs Format

```
https://r2-bucket-url.com/videos/2025/09/1725345600000_a1b2c3d4_video_name.mp4
```

## Test Video Files

- Small: 10MB MP4 (1-2 parts)
- Medium: 50MB MP4 (5-6 parts)
- Large: 200MB MP4 (20-25 parts)

## Error Scenarios

- Network failure during upload
- Invalid file type
- File too large
- R2 service unavailable
- Partial upload completion
