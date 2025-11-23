# Tài Liệu Thiết Kế Database: Hệ Thống AI Chấm Điểm Writing

## Tổng Quan

Tài liệu này mô tả thiết kế database toàn diện cho Hệ Thống AI Chấm Điểm Writing dựa trên cấu trúc response `stampResult`. Thiết kế được tối ưu cho khả năng mở rộng, hỗ trợ đa người dùng và phân tích hiệu quả.

## Nguyên Tắc Thiết Kế Cốt Lõi

1. **Tách Biệt Mối Quan Tâm**: Bài nộp và kết quả được lưu trữ riêng biệt để có hiệu suất và tính linh hoạt tốt hơn
2. **Khả Năng Mở Rộng**: Các trường được đánh index và truy vấn được tối ưu để xử lý số lượng người dùng lớn
3. **Ưu Tiên Analytics**: Hỗ trợ sẵn có cho theo dõi tiến độ, chỉ số hiệu suất và thông tin chi tiết
4. **Tính Toàn Vẹn Dữ Liệu**: Xác thực toàn diện và quản lý mối quan hệ
5. **Tính Mở Rộng**: Các schema linh hoạt có thể điều chỉnh cho các cải tiến AI model trong tương lai

## Database Schema Architecture

### 1. WritingSubmission Model

**Purpose**: Stores original user writing submissions before AI processing
**Collection**: `WritingSubmissions`

**Key Features**:

- Unique `writingId` for tracking through the pipeline
- Rich metadata including device info, time spent, retry counts
- Status tracking (draft → submitted → processing → completed)
- Analytics fields (word count, sentence count, paragraph count)
- Soft delete capability
- Comprehensive indexing for performance

**Relationships**:

- `userId` → User (Many-to-One)
- `assignmentId` → Assignment (Many-to-One)
- `writingId` → WritingResult (One-to-One)

### 2. WritingResult Model

**Purpose**: Stores complete AI analysis results matching the `stampResult` structure
**Collection**: `WritingResults`

**Key Features**:

- Complete score breakdown (grammar, vocabulary, coherence, task_fulfillment, overall)
- AI Score with detailed review and improvement suggestions
- Comprehensive detailed feedback with issue categorization
- Format validation results
- RAG insights including similar writings and recommendations
- Processing metadata and performance tracking

**Relationships**:

- `userId` → User (Many-to-One)
- `writingId` → WritingSubmission (One-to-One)
- `assignmentId` → Assignment (Many-to-One)

### 3. UserProgress Model

**Purpose**: Comprehensive user progress tracking and personalization
**Collection**: `UserProgresses`

**Key Features**:

- Part-specific progress tracking (Writing Parts 1-4)
- Milestone and achievement system
- AI-generated learning insights
- Study pattern analysis
- Goal setting and tracking
- Performance trend analysis
- Personalization preferences

**Relationships**:

- `userId` → User (One-to-One)

### 4. AIAnalytics Model

**Purpose**: System-wide analytics and performance monitoring
**Collection**: `AIAnalytics`

**Key Features**:

- Performance metrics tracking
- Error logging and monitoring
- A/B testing results
- Feature usage analytics
- Cost tracking for AI services
- Quality metrics and insights
- Trend analysis capabilities

## Scalability Features

### Indexing Strategy

```javascript
// Performance-optimized indexes
{ userId: 1, createdAt: -1 }        // User timeline queries
{ writingId: 1 }                    // Unique submission lookup
{ assignmentId: 1, userId: 1 }      // Assignment-based queries
{ "score.overall": -1, createdAt: -1 } // Leaderboard queries
{ part: 1, createdAt: -1 }          // Part-specific analytics
{ status: 1 }                       // Status filtering
```

### Aggregation Pipelines

- **User Analytics**: Pre-calculated progress metrics
- **Leaderboards**: Efficient ranking queries
- **Trend Analysis**: Time-based performance tracking
- **Cost Analysis**: AI service usage monitoring

## Multi-User Support

### User Isolation

- All collections properly reference `userId`
- User-specific data segregation
- Role-based access control ready

### Concurrent Processing

- Status tracking prevents race conditions
- Atomic updates for score calculations
- Optimistic locking for progress updates

### Data Privacy

- Soft delete for GDPR compliance
- Personal data segregation
- Audit trail capabilities

## Analytics Capabilities

### Real-Time Metrics

- Individual user progress tracking
- System performance monitoring
- Error rate tracking
- Quality metrics

### Historical Analysis

- Score improvement trends
- Usage pattern analysis
- Feature adoption rates
- Cost optimization insights

### Predictive Analytics Ready

- Comprehensive data collection for ML models
- Pattern recognition data points
- User behavior tracking
- Performance prediction capabilities

## Performance Optimizations

### Query Optimization

- Strategic compound indexes
- Aggregation pipeline optimization
- Virtual population for related data
- Efficient pagination support

### Caching Strategy

- Expensive calculation caching
- Progress metric pre-computation
- Analytics result caching
- Leaderboard materialized views

### Data Lifecycle Management

- Automatic cleanup of old data
- Archive strategies for historical data
- Performance metric retention policies
- Cost-effective storage tiering

## Integration Points

### Existing System Integration

```javascript
// User Model Integration
userSchema.virtual("progress", {
  ref: "UserProgress",
  localField: "_id",
  foreignField: "userId",
  justOne: true,
});

// Assignment Model Integration
assignmentSchema.virtual("submissions", {
  ref: "WritingSubmission",
  localField: "_id",
  foreignField: "assignmentId",
});
```

### AI Service Integration

- Gemini API result storage
- ChromaDB vector embeddings
- RAG pipeline data flow
- Scoring pipeline integration

## Monitoring and Observability

### Health Metrics

- System uptime tracking
- AI service availability
- Processing time monitoring
- Error rate alerting

### Business Metrics

- User engagement tracking
- Feature utilization rates
- Learning outcome measurement
- Revenue impact analysis

## Security Considerations

### Data Protection

- Encrypted sensitive fields
- Access control mechanisms
- Audit logging
- Data retention policies

### API Security

- Rate limiting support
- Authentication integration
- Authorization checks
- Input validation

## Future Extensibility

### Schema Evolution

- Flexible metadata fields
- Versioned document support
- Backward compatibility
- Migration strategies

### New Feature Support

- Plugin architecture ready
- Additional AI model integration
- New scoring criteria support
- Enhanced analytics capabilities

## Implementation Recommendations

### Phase 1: Core Models

1. Deploy WritingSubmission and WritingResult models
2. Implement basic CRUD operations
3. Set up essential indexes
4. Create monitoring dashboards

### Phase 2: Analytics

1. Deploy UserProgress model
2. Implement progress calculation logic
3. Create analytics pipelines
4. Set up automated insights

### Phase 3: Advanced Features

1. Deploy AIAnalytics model
2. Implement A/B testing framework
3. Advanced monitoring setup
4. Performance optimization

### Phase 4: Scale Optimization

1. Implement caching layers
2. Set up data archiving
3. Advanced analytics features
4. Predictive modeling integration

This database design provides a robust, scalable foundation for the AI Writing Scoring System while maintaining flexibility for future enhancements and supporting comprehensive analytics and user experience optimization.
