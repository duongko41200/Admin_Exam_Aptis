# Tài Liệu Thiết Kế Database: Hệ Thống AI Chấm Điểm Writing

## Tổng Quan

Tài liệu này mô tả thiết kế database toàn diện cho Hệ Thống AI Chấm Điểm Writing dựa trên cấu trúc response `stampResult`. Thiết kế được tối ưu cho khả năng mở rộng, hỗ trợ đa người dùng và phân tích hiệu quả.

## Nguyên Tắc Thiết Kế Cốt Lõi

1. **Tách Biệt Mối Quan Tâm**: Bài nộp và kết quả được lưu trữ riêng biệt để có hiệu suất và tính linh hoạt tốt hơn
2. **Khả Năng Mở Rộng**: Các trường được đánh index và truy vấn được tối ưu để xử lý số lượng người dùng lớn
3. **Ưu Tiên Analytics**: Hỗ trợ sẵn có cho theo dõi tiến độ, chỉ số hiệu suất và thông tin chi tiết
4. **Tính Toàn Vẹn Dữ Liệu**: Xác thực toàn diện và quản lý mối quan hệ
5. **Tính Mở Rộng**: Các schema linh hoạt có thể điều chỉnh cho các cải tiến AI model trong tương lai

## Kiến Trúc Schema Database

### 1. Model WritingSubmission (Bài Nộp)

**Mục đích**: Lưu trữ bài viết gốc của người dùng trước khi xử lý AI  
**Collection**: `WritingSubmissions`

**Tính Năng Chính**:

- `writingId` duy nhất để theo dõi qua pipeline
- Metadata phong phú bao gồm thông tin thiết bị, thời gian làm bài, số lần thử lại
- Theo dõi trạng thái (bản nháp → đã nộp → đang xử lý → hoàn thành)
- Các trường phân tích (số từ, số câu, số đoạn văn)
- Khả năng xóa mềm
- Đánh index toàn diện cho hiệu suất

**Ví dụ Dữ Liệu**:

```javascript
{
  writingId: "abc-123-def-456",
  userId: ObjectId("674a1b2c3d4e5f6789012345"),
  assignmentId: ObjectId("674b2c3d4e5f6789012346"),
  part: 1,
  content: "Dear Sir, I am writing to express my opinion about the new library hours...",
  status: "completed",
  wordCount: 150,
  sentenceCount: 12,
  timeSpent: 1800, // 30 phút (tính bằng giây)
  metadata: {
    deviceInfo: {
      userAgent: "Chrome/91.0",
      platform: "Windows"
    },
    retryCount: 0
  },
  submittedAt: "2024-11-21T10:30:00Z"
}
```

**Mối Quan Hệ**:

- `userId` → User (Nhiều-đến-Một): Một user có thể có nhiều bài nộp
- `assignmentId` → Assignment (Nhiều-đến-Một): Một assignment có thể có nhiều bài nộp
- `writingId` → WritingResult (Một-đến-Một): Mỗi bài nộp có một kết quả

---

### 2. Model WritingResult (Kết Quả Chấm Điểm)

**Mục đích**: Lưu trữ kết quả phân tích AI hoàn chỉnh khớp với cấu trúc `stampResult`  
**Collection**: `WritingResults`

**Tính Năng Chính**:

- Phân tích điểm chi tiết (ngữ pháp, từ vựng, mạch lạc, hoàn thành nhiệm vụ, tổng thể)
- AI Score với đánh giá chi tiết và gợi ý cải thiện
- Phản hồi chi tiết toàn diện với phân loại vấn đề
- Kết quả xác thực định dạng
- Thông tin chi tiết RAG bao gồm bài viết tương tự và đề xuất
- Metadata xử lý và theo dõi hiệu suất

**Ví dụ Dữ Liệu**:

```javascript
{
  writingId: "abc-123-def-456",
  userId: ObjectId("674a1b2c3d4e5f6789012345"),
  score: {
    grammar: 7.2,
    vocabulary: 9.0,
    coherence: 6.3,
    task_fulfillment: 7.9,
    overall: 7.6,
    Ai_Score: {
      score: 16,
      scoreWord: "B2",
      review: "Bài viết thể hiện khả năng sử dụng ngữ pháp, từ vựng và cấu trúc tốt, đạt các tiêu chí của cấp độ B2...",
      improve: "Để nâng cao chất lượng bài viết lên mức B2 mạnh...",
      suggestions: [
        "From my perspective, I would recommend that the club invite Van Gogh expert – Ms. Lisa Tran..."
      ]
    }
  },
  detailedFeedback: {
    task_achievement: {
      score: 7.9,
      feedback: "Good task achievement with adequate length and content."
    },
    commentDetail: {
      grammarIssues: [{
        sentence: "He go to school every day.",
        error: "go",
        correction: "goes",
        explanation: "Subject 'He' needs a verb in third person singular form."
      }],
      vocabularyIssues: [{
        word: "very big",
        issue: "Overly simple expression",
        suggestion: "enormous / massive / significant"
      }]
    }
  },
  processingTime: 24.915,
  submittedAt: "2024-11-21T10:30:00Z"
}
```

**Mối Quan Hệ**:

- `userId` → User (Nhiều-đến-Một): Một user có thể có nhiều kết quả
- `writingId` → WritingSubmission (Một-đến-Một): Mỗi kết quả thuộc về một bài nộp
- `assignmentId` → Assignment (Nhiều-đến-Một): Một assignment có thể có nhiều kết quả

---

### 3. Model UserProgress (Tiến Độ Người Dùng)

**Mục đích**: Theo dõi tiến độ người dùng toàn diện và cá nhân hóa  
**Collection**: `UserProgresses`

**Tính Năng Chính**:

- Theo dõi tiến độ theo từng phần (Writing Parts 1-4)
- Hệ thống cột mốc và thành tích
- Thông tin chi tiết học tập được tạo bởi AI
- Phân tích mô hình học tập
- Đặt mục tiêu và theo dõi
- Phân tích xu hướng hiệu suất
- Tùy chọn cá nhân hóa

**Ví dụ Dữ Liệu**:

```javascript
{
  userId: ObjectId("674a1b2c3d4e5f6789012345"),
  overallLevel: "INTERMEDIATE", // BEGINNER, ELEMENTARY, INTERMEDIATE, UPPER_INTERMEDIATE, ADVANCED
  totalPoints: 350,
  writingProgress: [
    {
      part: 1,
      currentLevel: "B1",
      averageScore: 7.2,
      bestScore: 8.5,
      recentScore: 7.8,
      totalSubmissions: 15,
      completedSubmissions: 14,
      currentStreak: 5, // 5 ngày liên tiếp
      longestStreak: 12,
      lastSubmissionDate: "2024-11-21T00:00:00Z",
      recurringIssues: [
        {
          issue: "Grammar consistency",
          frequency: 8,
          lastOccurred: "2024-11-20T00:00:00Z"
        }
      ],
      strengths: [
        {
          strength: "Strong vocabulary usage",
          confidence: 0.85,
          firstIdentified: "2024-11-01T00:00:00Z"
        }
      ]
    }
  ],
  milestones: [
    {
      type: "FIRST_SUBMISSION",
      title: "Bài Writing Đầu Tiên",
      description: "Hoàn thành bài Writing Part 1 đầu tiên!",
      achievedAt: "2024-11-01T00:00:00Z",
      part: 1,
      badgeIcon: "🎯",
      points: 10
    },
    {
      type: "SCORE_MILESTONE",
      title: "Đạt Điểm 8.0",
      description: "Lần đầu đạt điểm 8.0 trong Writing Part 1",
      achievedAt: "2024-11-15T00:00:00Z",
      threshold: { score: 8.0 },
      badgeIcon: "⭐",
      points: 25
    }
  ],
  studyPatterns: {
    preferredTimeOfDay: [14, 15, 16], // 2-4 PM
    averageSessionDuration: 45, // phút
    weeklyFrequency: 4.2,
    mostActiveDay: "WEDNESDAY"
  }
}
```

**Mối Quan Hệ**:

- `userId` → User (Một-đến-Một): Mỗi user có một bản ghi tiến độ duy nhất

---

### 4. Model AIAnalytics (Phân Tích AI)

**Mục đích**: Phân tích toàn hệ thống và giám sát hiệu suất  
**Collection**: `AIAnalytics`

**Tính Năng Chính**:

- Theo dõi chỉ số hiệu suất
- Ghi log lỗi và giám sát
- Kết quả kiểm thử A/B
- Phân tích sử dụng tính năng
- Theo dõi chi phí cho dịch vụ AI
- Chỉ số chất lượng và thông tin chi tiết
- Khả năng phân tích xu hướng

**Ví dụ Dữ Liệu**:

```javascript
{
  date: "2024-11-21T00:00:00Z",
  period: "DAILY",
  usage: {
    totalSubmissions: 1250,
    successfulProcessing: 1230,
    failedProcessing: 20,
    uniqueUsers: 340,
    byPart: [
      {
        part: 1,
        submissions: 400,
        avgScore: 7.2,
        avgProcessingTime: 23.5 // giây
      },
      {
        part: 2,
        submissions: 300,
        avgScore: 6.8,
        avgProcessingTime: 21.2
      }
    ],
    byLevel: [
      {
        level: "B1",
        userCount: 150,
        avgScore: 6.5,
        improvementRate: 0.15 // 15% cải thiện
      },
      {
        level: "B2",
        userCount: 120,
        avgScore: 7.8,
        improvementRate: 0.08
      }
    ]
  },
  quality: {
    averageScoreAccuracy: 0.89, // độ chính xác chấm điểm
    feedbackRelevanceScore: 0.92, // độ liên quan của feedback
    userSatisfactionRate: 0.87, // tỷ lệ hài lòng của user
    geminiApiUptime: 0.99, // thời gian hoạt động API
    chromaDbUptime: 0.98
  },
  costs: {
    geminiApiCalls: 1250,
    embeddingCalls: 1230,
    estimatedCost: 12.50 // USD
  },
  errors: [
    {
      errorType: "GEMINI_API_ERROR",
      errorMessage: "Rate limit exceeded",
      severity: "MEDIUM",
      timestamp: "2024-11-21T14:30:00Z",
      resolved: true
    }
  ],
  insights: [
    {
      type: "PERFORMANCE_TREND",
      description: "Thời gian xử lý tăng 15% trong tuần qua",
      impact: "NEGATIVE",
      confidence: 0.85,
      actionRequired: true,
      priority: "HIGH"
    }
  ]
}
```

## Tính Năng Mở Rộng

### Chiến Lược Đánh Index

```javascript
// Indexes được tối ưu hiệu suất
{ userId: 1, createdAt: -1 }        // Truy vấn timeline của user
{ writingId: 1 }                    // Tìm kiếm submission duy nhất
{ assignmentId: 1, userId: 1 }      // Truy vấn theo assignment
{ "score.overall": -1, createdAt: -1 } // Truy vấn bảng xếp hạng
{ part: 1, createdAt: -1 }          // Phân tích theo phần
{ status: 1 }                       // Lọc theo trạng thái
```

### Pipelines Tổng Hợp

- **Phân Tích User**: Chỉ số tiến độ được tính toán trước
- **Bảng Xếp Hạng**: Truy vấn xếp hạng hiệu quả
- **Phân Tích Xu Hướng**: Theo dõi hiệu suất theo thời gian
- **Phân Tích Chi Phí**: Giám sát sử dụng dịch vụ AI

## Hỗ Trợ Đa Người Dùng

### Cách Ly User

- Tất cả collections đều tham chiếu đúng `userId`
- Phân tách dữ liệu theo từng user
- Sẵn sàng cho kiểm soát truy cập theo vai trò

### Xử Lý Đồng Thời

- Theo dõi trạng thái ngăn chặn race conditions
- Cập nhật nguyên tử cho tính toán điểm
- Khóa lạc quan cho cập nhật tiến độ

### Quyền Riêng Tư Dữ Liệu

- Xóa mềm để tuân thủ GDPR
- Phân tách dữ liệu cá nhân
- Khả năng audit trail

## Khả Năng Phân Tích

### Chỉ Số Thời Gian Thực

- Theo dõi tiến độ cá nhân từng user
- Giám sát hiệu suất hệ thống
- Theo dõi tỷ lệ lỗi
- Chỉ số chất lượng

### Phân Tích Lịch Sử

- Xu hướng cải thiện điểm số
- Phân tích mẫu sử dụng
- Tỷ lệ áp dụng tính năng
- Thông tin tối ưu hóa chi phí

### Sẵn Sàng Phân Tích Dự Đoán

- Thu thập dữ liệu toàn diện cho ML models
- Điểm dữ liệu nhận dạng mẫu
- Theo dõi hành vi người dùng
- Khả năng dự đoán hiệu suất

## Tối Ưu Hóa Hiệu Suất

### Tối Ưu Truy Vấn

- Indexes ghép chiến lược
- Tối ưu hóa aggregation pipeline
- Virtual population cho dữ liệu liên quan
- Hỗ trợ phân trang hiệu quả

### Chiến Lược Cache

- Cache tính toán phức tạp
- Tính toán trước chỉ số tiến độ
- Cache kết quả phân tích
- Materialized views cho bảng xếp hạng

### Quản Lý Vòng Đời Dữ Liệu

- Dọn dẹp tự động dữ liệu cũ
- Chiến lược lưu trữ cho dữ liệu lịch sử
- Chính sách lưu giữ chỉ số hiệu suất
- Phân tầng lưu trữ tiết kiệm chi phí

## Điểm Tích Hợp

### Tích Hợp Hệ Thống Hiện Có

```javascript
// Tích hợp User Model
userSchema.virtual("progress", {
  ref: "UserProgress",
  localField: "_id",
  foreignField: "userId",
  justOne: true,
});

// Tích hợp Assignment Model
assignmentSchema.virtual("submissions", {
  ref: "WritingSubmission",
  localField: "_id",
  foreignField: "assignmentId",
});
```

### Tích Hợp Dịch Vụ AI

- Lưu trữ kết quả Gemini API
- Vector embeddings ChromaDB
- Luồng dữ liệu RAG pipeline
- Tích hợp scoring pipeline

## Giám Sát và Khả Năng Quan Sát

### Chỉ Số Sức Khỏe

- Theo dõi thời gian hoạt động hệ thống
- Tình trạng dịch vụ AI
- Giám sát thời gian xử lý
- Cảnh báo tỷ lệ lỗi

### Chỉ Số Kinh Doanh

- Theo dõi sự tương tác của người dùng
- Tỷ lệ sử dụng tính năng
- Đo lường kết quả học tập
- Phân tích tác động doanh thu

## Cân Nhắc Bảo Mật

### Bảo Vệ Dữ Liệu

- Mã hóa các trường nhạy cảm
- Cơ chế kiểm soát truy cập
- Audit logging
- Chính sách lưu giữ dữ liệu

### Bảo Mật API

- Hỗ trợ giới hạn tốc độ
- Tích hợp xác thực
- Kiểm tra phân quyền
- Xác thực đầu vào

## Khả Năng Mở Rộng Tương Lai

### Tiến Hóa Schema

- Các trường metadata linh hoạt
- Hỗ trợ document có phiên bản
- Tương thích ngược
- Chiến lược migration

### Hỗ Trợ Tính Năng Mới

- Kiến trúc plugin sẵn sàng
- Tích hợp AI model bổ sung
- Hỗ trợ tiêu chí chấm điểm mới
- Khả năng phân tích nâng cao

## Khuyến Nghị Triển Khai

### Giai Đoạn 1: Models Cốt Lõi

1. Deploy WritingSubmission và WritingResult models
2. Triển khai các hoạt động CRUD cơ bản
3. Thiết lập indexes cần thiết
4. Tạo dashboard giám sát

### Giai Đoạn 2: Analytics

1. Deploy UserProgress model
2. Triển khai logic tính toán tiến độ
3. Tạo pipelines phân tích
4. Thiết lập insights tự động

### Giai Đoạn 3: Tính Năng Nâng Cao

1. Deploy AIAnalytics model
2. Triển khai framework kiểm thử A/B
3. Thiết lập giám sát nâng cao
4. Tối ưu hóa hiệu suất

### Giai Đoạn 4: Tối Ưu Mở Rộng

1. Triển khai tầng cache
2. Thiết lập lưu trữ dữ liệu
3. Tính năng phân tích nâng cao
4. Tích hợp mô hình dự đoán

Thiết kế database này cung cấp nền tảng mạnh mẽ, có khả năng mở rộng cho Hệ Thống AI Chấm Điểm Writing đồng thời duy trì tính linh hoạt cho các cải tiến tương lai và hỗ trợ tối ưu hóa phân tích cũng như trải nghiệm người dùng toàn diện.

## Ví Dụ Sử Dụng Thực Tế

### Kịch Bản 1: Học Sinh Nộp Bài Writing

```javascript
// 1. Tạo submission
const submission = await WritingSubmission.create({
  writingId: "writing_123",
  userId: "student_001",
  part: 1,
  content: "Dear Manager, I would like to suggest...",
  assignmentId: "assignment_456",
});

// 2. Xử lý AI và tạo kết quả
const result = await WritingResult.create({
  writingId: "writing_123",
  userId: "student_001",
  score: {
    overall: 7.5,
    grammar: 7.0,
    vocabulary: 8.5,
    coherence: 7.0,
    task_fulfillment: 7.5,
  },
});

// 3. Cập nhật tiến độ học sinh
await UserProgress.updateAfterSubmission("student_001", result);
```

### Kịch Bản 2: Giáo Viên Xem Báo Cáo Lớp

```javascript
// Lấy báo cáo tổng quan lớp học
const classReport = await WritingResult.aggregate([
  {
    $match: {
      assignmentId: ObjectId("assignment_456"),
      createdAt: { $gte: startDate, $lte: endDate },
    },
  },
  {
    $group: {
      _id: "$userId",
      averageScore: { $avg: "$score.overall" },
      totalSubmissions: { $sum: 1 },
      latestScore: { $last: "$score.overall" },
    },
  },
  {
    $lookup: {
      from: "Users",
      localField: "_id",
      foreignField: "_id",
      as: "student",
    },
  },
]);
```

### Kịch Bản 3: Admin Giám Sát Hệ Thống

```javascript
// Dashboard metrics hàng ngày
const dailyMetrics = await AIAnalytics.findOne({
  date: today,
  period: "DAILY",
});

console.log(`
Hôm nay đã xử lý: ${dailyMetrics.usage.totalSubmissions} bài
Tỷ lệ thành công: ${(
  (dailyMetrics.usage.successfulProcessing /
    dailyMetrics.usage.totalSubmissions) *
  100
).toFixed(2)}%
Thời gian xử lý trung bình: ${
  dailyMetrics.performanceMetrics.find((m) => m.metric === "PROCESSING_TIME")
    ?.value
} giây
Chi phí ước tính: $${dailyMetrics.costs.estimatedCost}
`);
```

Thiết kế này đảm bảo hệ thống có thể xử lý hiệu quả từ vài trăm đến hàng triệu người dùng với khả năng mở rộng linh hoạt và phân tích chi tiết!
