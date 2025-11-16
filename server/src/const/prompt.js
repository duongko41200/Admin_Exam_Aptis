import part4 from "../data/template-score/writing-part4.json" with { type: "json" };

export const genPromptFormEmailFormal = (writing) => {
  return (
    "Hãy kiểm tra bài viết sau có tuân thủ đúng cấu trúc email mẫu dành cho đề APTIS không. Yêu cầu các phần sau phải xuất hiện và hợp lý:\n\n" +
    "1. Lời chào: Có câu mở đầu như 'Dear Sir,' hoặc 'Dear [Tên người nhận],'.\n" +
    "2. Giới thiệu bản thân: Có đoạn giới thiệu tên, vai trò, thời gian tham gia câu lạc bộ.\n" +
    "3. Mục đích email: Nêu lý do viết email (ví dụ: cảm nhận, đề xuất về thông báo/annoucement).\n" +
    "4. Cảm xúc: Trình bày cảm nhận về thông báo/plan/problem (cảm nhận 1, cảm nhận 2).\n" +
    "5. Giải pháp(phần nhất định phải có) - Đề xuất giải pháp hoặc ý kiến (đề xuất 1, giải thích 1, đề xuất 2, giải thích 2).\n" +
    "6. Kết thúc: Có câu kết như 'I hope that my suggestions are useful...'.\n" +
    "7. Lời chào cuối 'Sincerely, [Tên người viết]'.\n\n" +
    "Hãy trả về kết quả kiểm tra dưới dạng MỘT MẢNG JSON THUẦN duy nhất, KHÔNG được thêm bất kỳ ký tự markdown (ví dụ: ba dấu backtick), giải thích, hoặc văn bản thừa nào.\n" +
    "Chỉ trả về đúng cấu trúc JSON sau:\n" +
    "[\n" +
    "  {\n" +
    "    'missingParts': [/* các phần thiếu */],\n" +
    "    'suggestions': {/* gợi ý cho phần thiếu */},\n" +
    "    'improve': {/* gợi ý câu trả lời có phần bị thiếu */}\n" +
    "  }\n" +
    "]\n" +
    "Lưu ý: Nếu không có phần thiếu, 'missingParts' là mảng rỗng, 'suggestions' là object rỗng.\n\n" +
    "Bài viết cần kiểm tra:\n" +
    writing.content +
    "\n\nChỉ trả về MẢNG JSON THUẦN như trên, KHÔNG thêm bất kỳ ký tự markdown, giải thích, hoặc văn bản nào khác."
  );
};

export const genPromptAIScore = (writing, debai) => {
  const writingContent = part4.templateEmail.score;
  return (
    "Hãy kiểm tra bài viết sau và chấm điểm theo các tiêu chí sau đây: \n\n" +
    writingContent +
    "\n" +
    "Hãy trả về kết quả kiểm tra dưới dạng MỘT MẢNG JSON THUẦN duy nhất, KHÔNG được thêm bất kỳ ký tự markdown (ví dụ: ba dấu backtick), giải thích, hoặc văn bản thừa nào.\n" +
    "Chỉ trả về đúng cấu trúc JSON sau:\n" +
    "\n" +
    "  {\n" +
    "    'score': {/* `Chỉ được trả về điểm số (score) đúng với các khoảng sau: A1: 0-4, B1.1: 5-8, B1.2: 9-11, B2.1: 12-14, B2.2: 15-17, C1: 18-20. Không được trả về số ngoài các khoảng này.` */},\n" +
    "    'scoreWord': {/* điểm dang chữ (A1, B1, B2, C) */},\n" +
    "    'review': {/* chỉ ra phần chưa đạt tiêu chí B2 */},\n" +
    "    'improve': {/* gợi ý  cải thiện cho bài viết để đáp ứng từng tiêu chí */}\n" +
    "    'suggestions': [ /* Chỉ lấy đúng các câu trong bài làm mà đưa ra hành động, đề xuất, giải pháp cụ thể cho vấn đề của đề bài (ví dụ: các câu bắt đầu bằng `Therefore`, `After that`, `We should`, `I suggest`, `I recommend`, ...). Không lấy các câu mô tả lại vấn đề, cảm nhận, hoặc ý kiến chung chung. Nếu không có thì trả về mảng rỗng */]\n" +
    "  }\n" +
    "\n" +
    "Đề bài:\n" +
    debai +
    "\n" +
    "Bài viết cần kiểm tra:\n" +
    writing.content +
    "\n\nChỉ trả về MẢNG JSON THUẦN như trên, KHÔNG thêm bất kỳ ký tự markdown, giải thích, hoặc văn bản nào khác."
  );
};
