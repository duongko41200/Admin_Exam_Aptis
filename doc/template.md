# Email Template for APTIS

## Template Mẫu

```javascript
template: "Dear [Recipient's Name/Sir/Madam],\n" +
  "I hope this email finds you well. My full name is [Your Name], and I [relevant background/affiliation].\n" +
  "I am writing to express my feelings and give my suggestions regarding [topic of the email].\n" +
  "According to [source of information], [key context/background information]. [Additional context, e.g., 'Besides, the focus is on gaining both young and elderly members.'].\n" +
  "To be honest, I was thrilled at first because [reason for positive reaction].\n" +
  "From my perspective, I would recommend that [specific recommendation 1] as [justification 1].\n" +
  "In addition, [specific recommendation 2] because [justification 2].\n" +
  "I look forward to hearing your response if my recommendations are accepted.\n" +
  "Best regards,\n" +
  "[Your Name]";
```

## Prompt Chuẩn

Phân tích bài viết dưới đây và trích xuất ra một template email theo công thức sau:

**Yêu cầu:**

- Các ý/câu cố định (bất kỳ bài nào cũng có thể dùng) giữ nguyên
- Các phần nội dung đặc thù, có thể thay thế, hãy đặt trong dấu [ ] và sử dụng các biến phù hợp
- Ví dụ: `[tên của bạn]`, `[chủ đề của email]`, `[recommendation 1]`, `[justification 1]`, `[recommendation 2]`, `[justification 2]`, `[reason]`, `[Recipient's Name/Sir/Madam]`, `[source of information]`...

### Cấu trúc email mẫu APTIS:

1. **Lời chào:** Có câu mở đầu như "Dear Sir," hoặc "Dear [Tên người nhận],"
2. **Giới thiệu bản thân:** Có đoạn giới thiệu tên, vai trò, thời gian tham gia câu lạc bộ
3. **Mục đích email:** Nêu lý do viết email (ví dụ: cảm nhận, đề xuất về thông báo/announcement)
4. **Cảm xúc:** Trình bày cảm nhận về thông báo/kế hoạch/vấn đề (cảm nhận 1, cảm nhận 2)
5. **Giải pháp (bắt buộc):** Đề xuất giải pháp hoặc ý kiến (đề xuất 1, giải thích 1, đề xuất 2, giải thích 2)
6. **Kết thúc:** Có câu kết như "I hope that my suggestions are useful..."
7. **Lời chào cuối:** "Sincerely, [Tên người viết]"

**Lưu ý:**

- Nếu bài viết thiếu ý nào (theo cấu trúc email chuẩn), liệt kê vào mảng `missingParts`
- Chỉ sử dụng đúng ý/câu từ bài viết, không tự chế thêm
- Nếu không có đủ ý, template vẫn phải đúng công thức: ý cố định + [ý thay thế]

### Yêu cầu trả về:

Duy nhất một object JSON:

```json
{
  "template": "Dear [Recipient's Name/Sir/Madam],\nI am writing to [topic]...\nFrom my perspective, I recommend [recommendation]...\nBest regards,\n[Your Name]",
  "missingParts": ["[reason]", "[recommendation]", ...]
}
```

## Ví dụ bài viết cần phân tích:

```text
Dear Sir,
My full name is Le My An and I have been a member of the club since July.
I am writing this email to express my feelings about your latest notice.
According to the news, our Art club will have a public talk with the artist to attract more people to join.
To be honest, I do think that our club should invite a popular artist who has influenced the young generation.
Thus, I would like to give some of my suggestions for your plan.
In terms of a famous artist, I have a suggestion for an artist who could join our talk: Mr. John. He has a unique style and a captivating way of connecting with diverse audiences.
Moreover, our club should make an announcement for our members by posting about his presence on our show on social media such as Facebook and Instagram so that more people can know.
Best regards,
Le My An
```
