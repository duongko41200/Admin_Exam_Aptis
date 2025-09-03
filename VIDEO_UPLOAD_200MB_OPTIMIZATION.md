# Video Upload Optimization - Fixed for 200MB Files

## Vấn đề

Upload video 200MB bị chậm và timeout trong server upload mode.

## Các cải thiện đã thực hiện

### 1. Client Side (Frontend)

#### **ApiService Timeout & Progress**

- ✅ Tăng timeout từ 50s lên 10 phút (600,000ms)
- ✅ Thêm timeout riêng 30 phút cho file uploads
- ✅ Bổ sung `onUploadProgress` callback cho tracking real-time
- ✅ Hiển thị stage upload ("Đang nén video...", "Đang upload video...")

#### **VideoUpload Component**

- ✅ Cải thiện progress display với stage information
- ✅ Thêm CircularProgress indicator
- ✅ Better error handling và progress calculation
- ✅ Auto-clear upload stage sau 2 giây

### 2. Server Side (Backend)

#### **Express App Configuration**

- ✅ Tăng payload limits lên 50MB
- ✅ Tăng parameterLimit cho large requests
- ✅ Optimize body-parser cho large files

#### **Multer Configuration**

- ✅ Thêm fields và parts limits
- ✅ Cải thiện file filter validation

#### **Video Upload Service**

- ✅ Giảm multipartThreshold từ 50MB → 20MB (ưu tiên multipart sớm hơn)
- ✅ Tối ưu part size cho 200MB: 8MB parts (thay vì 10-15MB)
- ✅ Tăng concurrency: 20 uploads song song (thay vì 15)
- ✅ Tăng retry attempts: 5 lần (thay vì 3)
- ✅ Tăng timeout per part: 2 phút (thay vì 1 phút)

#### **Compression Optimization**

- ✅ Target compression ratio 35% cho file > 200MB
- ✅ Tăng CRF từ 23 → 28 để nén mạnh hơn
- ✅ Better bitrate calculation based on target size
- ✅ Enhanced progress tracking

### 3. Upload Strategy cho 200MB Files

#### **Multipart Upload Plan**

```
File 200MB → ~25 parts × 8MB each
├── Compression: 200MB → ~70MB (65% reduction)
├── Upload: 70MB / 25 parts = 2.8MB average per part
├── Concurrency: 20 parts song song
└── Estimated time: 2-3 phút total
```

#### **Progress Stages**

1. **Validation** (1s): File validation
2. **Compression** (20s): Video compression 200MB → 70MB
3. **Multipart Init** (2s): Initialize upload
4. **Upload Parts** (60-90s): Upload 25 parts concurrently
5. **Complete** (2s): Finalize upload

### 4. Testing & Debugging

#### **Test Endpoints**

- `GET /api/video/test/config` - Check upload configuration
- `POST /api/video/test/progress` - Simulate upload estimation

#### **Monitoring Tools**

- Browser Network tab shows real progress
- Console logs với detailed upload metrics
- Progress callbacks với stage information

## Kết quả mong đợi

### **200MB Video Upload**

- ⏱️ **Thời gian**: 2-3 phút (thay vì timeout)
- 📦 **Compression**: 200MB → ~70MB
- 🚀 **Method**: Multipart với 25 parts
- 📊 **Progress**: Real-time với stage display
- 🔄 **Reliability**: 5 retry attempts per part

### **Performance Improvements**

- 🎯 **No more timeouts** cho files < 500MB
- 📈 **Better compression** với target ratios
- ⚡ **Faster uploads** với optimal part sizes
- 🔧 **Better error handling** và retry logic

## Sử dụng

### **Server Upload (Recommended cho 200MB)**

```javascript
const compressionOptions = {
  enableCompression: true,
  crf: 28,
  preset: "medium",
  targetCompressionRatio: 0.35,
};

const [result, error] = await VideoService.uploadVideoWithProgress(
  file,
  userId,
  compressionOptions,
  (progress) => {
    console.log(`${progress.stage}: ${progress.percent}%`);
  }
);
```

### **Direct Upload (Alternative)**

- Sử dụng khi server upload vẫn chậm
- Upload trực tiếp lên R2 không qua server
- Bỏ qua compression nhưng nhanh hơn

## Troubleshooting

### **Nếu vẫn chậm**

1. Kiểm tra network speed
2. Thử direct upload method
3. Giảm compression quality (tăng CRF)
4. Kiểm tra server resources

### **Debug Commands**

```bash
# Check upload config
curl -X GET http://localhost:3333/v1/api/video/test/config

# Test progress estimation
curl -X POST http://localhost:3333/v1/api/video/test/progress \
  -H "Content-Type: application/json" \
  -d '{"fileSize": 209715200}'
```
