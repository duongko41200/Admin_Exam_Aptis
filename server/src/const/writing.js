export const validatePartWriting = {
  1: [],
  2: [],
  3: ["email"],
  4: [
    {
      key: 1, // email formal,
      requiredFields: [
        {
          key: "greeting",
          label: "Lời chào",
          regex: /Dear\s+[\w\s,]+/,
          suggestion:
            "Thêm lời chào như 'Dear Sir,' hoặc 'Dear [Tên người nhận],' ở đầu email.",
        },
        {
          key: "introduction",
          label: "Giới thiệu bản thân",
          regex: /My name is|I have been a member|I am/,
          suggestion: "Giới thiệu tên, vai trò, thời gian tham gia câu lạc bộ.",
        },
        {
          key: "purpose",
          label: "Mục đích email",
          regex: /I am writing|purpose|notice|announcement/,
          suggestion:
            "Nêu lý do viết email, ví dụ: cảm nhận, đề xuất về thông báo.",
        },
        {
          key: "feelings",
          label: "Cảm nhận",
          regex: /I think|I felt|feel|problem|plan/,
          suggestion: "Trình bày cảm nhận về thông báo/plan/problem.",
        },
        {
          key: "suggestions",
          label: "Đề xuất/giải pháp",
          regex: /In my opinion|suggest|should|need to/,
          suggestion:
            "Đề xuất giải pháp hoặc ý kiến, ví dụ: 'In my opinion, we should...'",
        },
        {
          key: "closing",
          label: "Kết thúc",
          regex: /I hope that|Sincerely|Best regards/,
          suggestion:
            "Kết thúc email bằng câu như 'I hope that my suggestions are useful...' và lời chào cuối 'Sincerely, [Tên người viết]'.",
        },
      ],
    },
  ],
};
