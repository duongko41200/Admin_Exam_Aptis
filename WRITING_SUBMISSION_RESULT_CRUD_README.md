# WritingSubmission & WritingResult CRUD API

Chức năng CRUD hoàn chỉnh cho WritingSubmission và WritingResult theo kiến trúc Layer (Router → Controller → Service → Repository).

## 🏗️ Cấu trúc Layer

### 1. Repository Layer
- **File**: `src/repositories/writingSubmissionResult.repo.js`
- **Chức năng**: Xử lý trực tiếp với database, truy vấn MongoDB
- **Classes**: `WritingSubmissionRepository`, `WritingResultRepository`

### 2. Service Layer  
- **File**: `src/services/writingSubmissionResult.service.js`
- **Chức năng**: Business logic, validation, error handling
- **Classes**: `WritingSubmissionService`, `WritingResultService`

### 3. Controller Layer
- **File**: `src/controllers/writingSubmissionResult.controller.js` 
- **Chức năng**: Xử lý HTTP requests/responses, gọi services
- **Classes**: `WritingSubmissionController`, `WritingResultController`

### 4. Router Layer
- **File**: `src/routes/writingSubmissionResult/index.js`
- **Chức năng**: Define API endpoints, middleware, authentication

## 📋 API Endpoints

### WritingSubmission APIs

#### Basic CRUD
```
POST   /v1/api/writing-workflow/submissions
GET    /v1/api/writing-workflow/submissions
GET    /v1/api/writing-workflow/submissions/writing/:writingId
GET    /v1/api/writing-workflow/submissions/:id
GET    /v1/api/writing-workflow/submissions/user/:userId
PUT    /v1/api/writing-workflow/submissions/writing/:writingId
DELETE /v1/api/writing-workflow/submissions/writing/:writingId
```

#### Processing Workflow
```
POST   /v1/api/writing-workflow/submissions/writing/:writingId/start-processing
POST   /v1/api/writing-workflow/submissions/writing/:writingId/complete-processing  
POST   /v1/api/writing-workflow/submissions/writing/:writingId/fail-processing
```

### WritingResult APIs

#### Basic CRUD
```
POST   /v1/api/writing-workflow/results
GET    /v1/api/writing-workflow/results
GET    /v1/api/writing-workflow/results/writing/:writingId
GET    /v1/api/writing-workflow/results/:id
PUT    /v1/api/writing-workflow/results/writing/:writingId
DELETE /v1/api/writing-workflow/results/writing/:writingId
```

#### Analytics
```
GET    /v1/api/writing-workflow/results/user/:userId/performance
GET    /v1/api/writing-workflow/results/score-range
```

### Combined Workflow APIs
```
GET    /v1/api/writing-workflow/workflow/writing/:writingId
POST   /v1/api/writing-workflow/workflow/submit-and-process
```

## 🔧 Sử dụng API

### 1. Tạo submission mới
```javascript
POST /v1/api/writing-workflow/submissions
Content-Type: application/json
Authorization: Bearer <token>

{
  "writingId": "676123abc456def789012345",
  "userId": "675987654321abcdef123456", 
  "part": 1,
  "content": "My writing content here...",
  "metadata": {
    "wordCount": 150,
    "timeSpent": 1800
  }
}
```

### 2. Lấy submissions với query
```javascript
GET /v1/api/writing-workflow/submissions?filter={"part":1}&range=[0,20]&sort=["createdAt","DESC"]
Authorization: Bearer <token>
```

### 3. Bắt đầu xử lý submission
```javascript
POST /v1/api/writing-workflow/submissions/writing/676123abc456def789012345/start-processing
Authorization: Bearer <token>
```

### 4. Tạo kết quả chấm điểm
```javascript
POST /v1/api/writing-workflow/results
Content-Type: application/json
Authorization: Bearer <token>

{
  "writingId": "676123abc456def789012345",
  "userId": "675987654321abcdef123456",
  "part": 1,
  "overallScore": 8.5,
  "detailedScores": {
    "taskResponse": 8.0,
    "coherenceCohesion": 8.5,
    "lexicalResource": 8.5,
    "grammarAccuracy": 9.0
  },
  "feedback": {
    "strengths": ["Good vocabulary usage", "Clear structure"],
    "improvements": ["Use more complex sentences"],
    "suggestions": ["Try using more linking words"]
  },
  "aiAnalysis": {
    "modelVersion": "gemini-1.5-pro",
    "confidence": 0.92,
    "processingTime": 3.5
  }
}
```

### 5. Lấy performance analytics
```javascript
GET /v1/api/writing-workflow/results/user/675987654321abcdef123456/performance?startDate=2024-01-01&endDate=2024-12-31&part=1
Authorization: Bearer <token>
```

### 6. Workflow hoàn chỉnh
```javascript
POST /v1/api/writing-workflow/workflow/submit-and-process
Content-Type: application/json
Authorization: Bearer <token>

{
  "submissionData": {
    "writingId": "676123abc456def789012345",
    "userId": "675987654321abcdef123456",
    "part": 1,
    "content": "My writing content...",
    "metadata": {
      "wordCount": 150,
      "timeSpent": 1800
    }
  }
}
```

## 🛡️ Middleware & Security

- **Authentication**: Tất cả routes yêu cầu Bearer token
- **Authorization**: Sử dụng `authenticationV2` middleware
- **Error Handling**: Async error handling với `asyncHandle`
- **Validation**: Input validation trong service layer
- **Rate Limiting**: Có thể thêm rate limiting cho processing endpoints

## 🚀 Tối ưu hiệu suất

### Database Optimization
- Index trên `writingId`, `userId`, `createdAt`
- Virtual population để tránh N+1 queries
- Pagination cho large datasets
- Aggregation pipeline cho analytics

### Caching Strategy
```javascript
// Có thể thêm Redis caching
const cachedResult = await Redis.get(`result:${writingId}`);
if (cachedResult) {
  return JSON.parse(cachedResult);
}
```

### Batch Operations
```javascript
// Repository hỗ trợ bulk operations
await WritingSubmissionRepository.bulkCreate(submissions);
await WritingResultRepository.bulkUpdate(updates);
```

## 📊 Monitoring & Logging

### Error Tracking
- Structured error logging
- Error categorization (validation, database, AI processing)
- Performance metrics tracking

### Analytics Queries
- User performance trends
- Score distribution analysis  
- Processing time optimization
- Success/failure rates

## 🔄 Workflow Examples

### Complete Writing Assessment Flow
1. **Submit**: POST `/submissions` → Create submission
2. **Process**: POST `/submissions/writing/:id/start-processing` → Update status
3. **Analyze**: AI processing (external service)
4. **Result**: POST `/results` → Store analysis results  
5. **Complete**: POST `/submissions/writing/:id/complete-processing` → Link result
6. **Retrieve**: GET `/workflow/writing/:id` → Get complete data

### Error Handling Flow
1. **Process fails**: POST `/submissions/writing/:id/fail-processing`
2. **Retry logic**: Automatic retry with exponential backoff
3. **Admin notification**: Alert for manual intervention
4. **User feedback**: Appropriate error message to user

## 🧪 Testing

### Unit Tests
```javascript
// Service layer testing
describe('WritingSubmissionService', () => {
  it('should create submission successfully', async () => {
    const result = await WritingSubmissionService.createSubmission(validData);
    expect(result.success).toBe(true);
  });
});
```

### Integration Tests  
```javascript
// API endpoint testing
describe('POST /submissions', () => {
  it('should return 201 with valid data', async () => {
    const response = await request(app)
      .post('/v1/api/writing-workflow/submissions')
      .send(validSubmission)
      .expect(201);
  });
});
```

## 📝 Code Quality Features

✅ **Clean Architecture**: Separation of concerns theo layers  
✅ **DRY Principle**: Tránh lặp code với shared utilities  
✅ **Error Handling**: Comprehensive error management  
✅ **Type Safety**: JSDoc comments cho better IDE support  
✅ **Performance**: Optimized queries và caching strategy  
✅ **Scalability**: Thiết kế cho high-volume processing  
✅ **Maintainability**: Clear structure và documentation