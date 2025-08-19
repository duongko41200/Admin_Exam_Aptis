# Auto Check Answer Implementation for Listening Preview

## Overview

Đã implement chức năng "Auto check đáp án" cho các component Listening preview. Khi bật chức năng này trong ModalSetting, đáp án đúng sẽ hiển thị background màu xanh ngay lập tức.

## Implementation Details

### 1. ListeningPartOne.jsx (Click-based answers)

- **Logic**: Khi `isCheckResult = true`, đáp án đúng hiển thị background màu xanh ngay lập tức
- **Visual**:
  - Đáp án đúng: `bg-green-200` (màu xanh)
  - Đáp án sai được chọn: `bg-red-200` (màu đỏ)
  - Đáp án khác: `bg-[#eef0f3]` (màu xám mặc định)

### 2. ListeningPartTwo.jsx (Select dropdown answers)

- **Logic**:
  - Khi `isCheckResult = true`, hiển thị indicator text cho đáp án đúng
  - Select border thay đổi màu dựa trên trạng thái
- **Visual**:
  - Đáp án đúng được chọn: `border-green-500 bg-green-50`
  - Đáp án sai được chọn: `border-red-500 bg-red-50`
  - Chưa chọn: `border-blue-300`
  - Indicator text: `"Đáp án đúng: {correctAnswer}"` với background xanh

### 3. ListeningPartThree.jsx (Select dropdown answers)

- **Logic**: Tương tự ListeningPartTwo
- **Visual**: Giống như ListeningPartTwo với indicator text hiển thị đáp án đúng

### 4. ListeningPartFour.jsx (Click-based answers with sub-questions)

- **Logic**: Tương tự ListeningPartOne nhưng hỗ trợ multiple sub-questions
- **Visual**: Giống như ListeningPartOne

## Key Features

### Auto Show Correct Answer

- Khi bật "Auto check đáp án" trong ModalSetting, đáp án đúng hiển thị ngay lập tức
- Không cần click vào đáp án để xem kết quả
- Vẫn hỗ trợ feedback khi user chọn đáp án sai

### State Management

- Mỗi component track selected answers để hiển thị feedback
- Reset selected answers khi chuyển câu hỏi/part
- Integrate với `isCheckResult` state từ `taiLieuStore`

### Visual Indicators

- **Click-based components**: Background color thay đổi
- **Select-based components**: Border color + indicator text
- Consistent color scheme: Green for correct, Red for wrong

## Usage

1. Mở Listening preview trong admin
2. Click vào icon Settings trong FooterTest
3. Bật toggle "Auto check đáp án"
4. Đáp án đúng sẽ hiển thị background màu xanh ngay lập tức
5. Khi chọn đáp án sai, sẽ hiển thị màu đỏ

## Benefits

- Instant feedback cho teacher/admin
- Better UX for content review
- Consistent implementation across all Listening parts
- Non-intrusive visual design

## Technical Notes

- Used `isCheckResult` from `taiLieuStore` as the toggle state
- Each component maintains its own `selectedAnswers` state
- Color classes using Tailwind CSS
- Reset functionality when navigating between questions
