import { GoogleGenerativeAI } from "@google/generative-ai";
import { promptExam, promptResearch } from "../../consts/PromptsAi/promptsExam";

const getGeminiAi = async (level, texts) => {
  const genAI = new GoogleGenerativeAI(
    "AIzaSyAwEvAGplcQa0zvl_FWYA5yOlcBVJDb8nA"
  );
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });
  const prompt = promptExam(level, texts);
  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = await response.text();
  console.log({ text });

  const convertTextByJson = JSON.parse(text);
  console.log({ convertTextByJson });

  return convertTextByJson;
};

const getGeminiAiResearch = async (level, texts) => {
  const genAI = new GoogleGenerativeAI(
    "AIzaSyAwEvAGplcQa0zvl_FWYA5yOlcBVJDb8nA"
  );
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });
  const prompt = promptResearch(level, texts);

  console.log({ prompt });
  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = await response.text();
  console.log({ text });

  const convertTextByJson = JSON.parse(text);
  console.log({ convertTextByJson });

  return convertTextByJson;
};

// const prompt = `
// I'm practicing Aptis  Writing.
// The task prompt: "Dear members,
// We would like to organize some monthly face-to-face meetings. We would like your suggestions about when and where we could meet. It suits both young and older people. Please send us your suggestions and your reasons.
// Adherence to the requirements.:
// 1. Start with a greeting: 'Dear…' or 'Hi…'
// 2. Ask how the person is doing (e.g., 'How are you?' or 'How are things?')
// 3. State the reason for writing (e.g., 'I’m (just) writing to let you know about…')
// 4. Refer to the news or notice received (e.g., 'The club has just told us that...')
// 5. Express feelings (e.g., 'I’m very disappointed…')
// 6. Mention the action you plan to take (e.g., 'I’m going to write a complaint letter to the manager!')
// 7. Conclude with a sign-off (e.g., 'Look after yourself!' or 'Got to go now!')
// 8. End with a signature (e.g., 'Love’)”
// //
// My response to the prompt (ResponseID:#210296): "
// Hi Ha,
// We have not shared with each other for a long time. How are things? I hope you are still doing well. I have been (JOINING) a social club member for 2 months. Last night, I got an email from the club about face-to-face meetings. I was so happy when hearing that news. Can you give me your opinion for our upcoming meetings? Write back your thoughts!
// Love,
// Nguyen Thao.
// ".
// Respond using the following structure and format: {{parameter-name:value}}, each parameter and value wrapped in between a pair of "{{" and "}}". "/* */" and "//" are used to indicate comments, omit them in the response.
// /Analyze the provied task response thoroughly to identify all errors and areas for improvement (at least 13.52)related but not limited to grammar, tenses, syntax, typos, articles, word choice, prepositions, singular/plural form, spelling, tone, expression, cohesive devices, sentence structure, etc. Aim to enhance the essay to achieve a higher Aptis  band score. Ignore errors about punctuation usage./
// //Start of output with {{parameter-name:value}}
// {{gm-0 .fmt:  I want you to clearly point out this requirement above :found part missing in my essay and concise explanation in Vietnamese. NOTE: The suggestion must be written in English.}}
// {{gm-1 .txt:error part found in the essay (limit with a minimum of 3 words, and a maximum of 6 words for each error part)}}
// {{gm-1 .sgt:extremely precise, exact, accurate, and absolute replacement for mentioned error part}}
// {{gm-1 .typ:type of suggestion ("Grammar", "Spelling", "Capitalization", "Style", "Word Choice", etc.)}}
// {{gm-1 .exp:extremely short and concise explanation in Vietnamese, it must be easy to understand and sounds like being given by a teacher}}
// //Replace 1 in the parameters with order number (2,3,4,5, etc).
// //Examples of correct pairs of parameter & value: "
//  {{gm-0 .fmt: example * thiếu phần Mention the action you plan to take: bạn có thể thêm: ex:‘ I’m going to write a complaint letter to the manager!’  }}
//  {{gm-0 .fmt: example * thiếu phần Express feelings: bạn có thể thêm: ex:‘I’m very disappointed…’  }}
// // write all gm-0 on inline
// {{gm-5 .txt:begging his parent}} {{gm-5. sgt:begging their parents}} {{gm-1 .exp:"parents" là danh từ số nhiều nên đại từ sở hữu phải là "their".}} "
// //End of output
// Output response that includes all {{parameter-name:value}}, and with no comments:
// `;

const getPromps = async ({ debai, cauhoi, traloi }) => {
  return `
I'm practicing Aptis  Writing.
The task prompt: "${debai}  
${cauhoi}
"
Adherence to the requirements.:  
1. Start with a greeting: 'Dear…' or 'Hi…'
2. Ask how the person is doing (e.g., 'How are you?' or 'How are things?')
3. State the reason for writing (e.g., 'I’m (just) writing to let you know about…')
4. Refer to the news or notice received (e.g., 'The club has just told us that...')
5. Express feelings (e.g., 'I’m very disappointed…')
6. Mention the action you plan to take (e.g., 'I’m going to write a complaint letter to the manager!')
7. Conclude with a sign-off (e.g., 'Look after yourself!' or 'Got to go now!')
8. End with a signature (e.g., 'Love’)”
//
My response to the prompt (ResponseID:#210296): "
${traloi}
".
Respond using the following structure and format: {{parameter-name:value}}, each parameter and value wrapped in between a pair of "{{" and "}}". "/* */" and "//" are used to indicate comments, omit them in the response.
/Analyze the provied task response thoroughly to identify all errors and areas for improvement (at least 13.52)related but not limited to grammar, tenses, syntax, typos, articles, word choice, prepositions, singular/plural form, spelling, tone, expression, cohesive devices, sentence structure, etc. Aim to enhance the essay to achieve a higher Aptis  band score. Ignore errors about punctuation usage./
//Start of output with {{parameter-name:value}}
{{gm-0 .fmt:  I want you to clearly point out this requirement above :found part missing in my essay and concise explanation in Vietnamese. NOTE: The suggestion must be written in English.}}
{{gm-1 .txt:error part found in the essay (limit with a minimum of 3 words, and a maximum of 6 words for each error part)}}
{{gm-1 .sgt:extremely precise, exact, accurate, and absolute replacement for mentioned error part}}
{{gm-1 .typ:type of suggestion ("Grammar", "Spelling", "Capitalization", "Style", "Word Choice", etc.)}}
{{gm-1 .exp:extremely short and concise explanation in Vietnamese, it must be easy to understand and sounds like being given by a teacher}}
//Replace 1 in the parameters with order number (2,3,4,5, etc).
//Examples of correct pairs of parameter & value: "
 {{gm-0 .fmt: example * thiếu phần Mention the action you plan to take: bạn có thể thêm: ex:‘ I’m going to write a complaint letter to the manager!’  }}
 {{gm-0 .fmt: example * thiếu phần Express feelings: bạn có thể thêm: ex:‘I’m very disappointed…’  }}
// write all gm-0 on inline
{{gm-5 .txt:begging his parent}} {{gm-5. sgt:begging their parents}} {{gm-1 .exp:"parents" là danh từ số nhiều nên đại từ sở hữu phải là "their".}} "
//End of output	
Output response that includes all {{parameter-name:value}}, and with no comments: 
`;
};

const getGeminiAiCheck = async ({ debai, cauhoi, traloi }) => {
  const genAI = new GoogleGenerativeAI(
    "AIzaSyDBo-e5H5AP8flpgsuvhSSsqi7F9wzM-Pg"
  );
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });
  // const prompt = promptExam(level, texts);

  const promps = await getPromps({ debai, cauhoi, traloi });

  const resultss = await model.generateContent(promps);
  const response = resultss.response;

  console.log({ response });
  const text = await response.text();

  console.log({ text });

  return text;
};

const getPrompsWringPart_4 = async ({ debai, cauhoi, traloi }) => {
  return `
 You are an experienced English writing coach with deep expertise in language instruction and feedback. You will receive three inputs from the user:  
1. **The writing requirement** (i.e.,${debai}. ${cauhoi}).  
2. **The user’s writing submission.** (i.e.,${traloi}.). 
3. **The description of user’s current English proficiency level according to the CEFR B2.  

## The user's email format must include:  (FormatID:#210296):
1.               Greeting
            Dear Sir/ Madam...
            My name is..., I’ve been a member of ... club since .....
2.               Reason
    I am writing regarding your letter about + N
I am writing this email to express my feelings about + N: I am writing to complain about + N:
3.               Đưa ra tin tứcAccording to the news,...

4.               Feeling
•        Honestly, I feel frustrated/dissatisfied/ discontented to hear the news.
•        Honestly, I feel disappointed about how you manage the club and a bit shocked to hear the price. (bài tăng phí)
5.               Nêu lý do ( Một số ví tham khảo)
•        I spent the whole week on it; I have been looking forward to meeting him for a long time (BÀI ĐỔI NGƯỜI)
•        Because many members have been waiting for this event for months, and now this is happening (BÀI HỦY LỊCH)
•        As I informed my regular schedule before. I would have to go on my business in Japan at that time. Therefore, I will not participate in any club appointment / the next exam / this upcoming cooking class at that time. (THAY ĐỔI LỊCH)
•        As a student like most members of our book club, we do not have much money to pay for that. (BÀI TĂNG PHÍ)
•        I would appreciate it because the club provided us with good facilities for workouts. However, it is very difficult for me to practice effectively without instructions from the trainer. ( BÀI VẮNG MẶT NGƯỜI HƯỚNG DẪN)
6.               Solution
•        I would recommend that you should... Besides, you could .....
•        To make issues better, I will venture a couple of suggestions. One alternative is that + clause
Tham khảo một vài solutions
 + You can persuade Mr. Seiko to attend to ensure our plan occurs as usual.   If not, you should invite another famous instructor/ teacher instead of the  former one ( ĐỀ VẮNG MẶT )
+ You can keep the plan of the exam occurring as usual ( ĐỀ LÙI LỊCH)
+ I think you should consider raising the membership fee only by 5%, not 20%
(TĂNG PHÍ)
+ You should allow all of the members in the club to order free books online as usual ( ĐỀ MƯỢN SÁCH)
• Another one is that...( nếu có thêm gợi ý khác)
•  
I believe that a lot of members have the same suggestion as me.
7.      Ending
I look forward to hearing from your prompt response.
8.      Closing
Yours sincerely, Best regards,

Yours faithfully,
 Ký Tên + Họ


Your task is to **analyze** the writing submission in relation to the provided assignment requirement while taking into account the user's CEFR level. Your **feedback must be structured clearly into a well-organized report** to enhance readability and effectiveness.  

---  

## **Quality Standards**  

Your evaluation must adhere to the following quality standards to ensure clarity, accuracy, and educational value:  

### **1. Content & Task Fulfillment**  
✅ The writing must fully address the assignment prompt.  
✅ Ideas should be well-developed, relevant, and logically structured .  
✅ The answer must include all 8 points according to the format.
✅ Arguments must be supported with appropriate examples or reasoning.  

### **2. Grammar & Sentence Structure**  
✅ The writing should use correct grammar with minimal errors.  
✅ Sentence structures must be clear, concise, and well-formed.  
✅ For advanced levels (B2+), diverse sentence structures should be used.  

### **3. Vocabulary & Word Choice**  
✅ Word choices must be appropriate for the context and user’s CEFR level.  
✅ Overuse of repetitive words should be avoided; synonyms should be used effectively.  
✅ Collocations and natural phrasing should be encouraged.  

### **4. Coherence & Cohesion**  
✅ Ideas should be logically connected without abrupt changes.  
✅ Appropriate linking words (e.g., however, therefore, in contrast) must be used.  
✅ Paragraphs should transition smoothly for logical progression.  

### **5. Accuracy & Naturalness**  
✅ The writing should avoid direct translations from Vietnamese to English. ** The content in section 3 (Suggestions for Improvement) must be written 100% in English.
✅ Proofreading is recommended to eliminate errors before submission.  
✅ Reading aloud is encouraged to check for fluency and natural phrasing.  

---  

## **Critical Instructions**  

✅ **Your feedback must be entirely in Vietnamese.** Do not use English in the response.
✅ **Maintain a professional, constructive, and encouraging tone. Use professional language in your feedback.**
✅ **Be direct and specific, avoiding vague comments.**  
✅ **All feedback must be supported with clear examples.**  
✅ **Sub-points under the same main idea need to have a * or ** at the beginning of the sentence.**  
✅ **Always adjust feedback according to the user's CEFR level.**  

---  

## **Output Format**  

Your response must be presented firmly in the following structured format:  

## **1. Tổng quan**  
* Nhận xét chung về mức độ hoàn thành yêu cầu đề bài. 
* Những vấn đề quan trọng cần cải thiện.
  

## **2. Phân tích chi tiết**  

### **2.1. Mức độ hoàn thành yêu cầu đề bài**  
* Bài viết có bám sát đề bài không?  
* Bài viết có bám sát Format yêu cầu không. Hãy chỉ ra câu cụ thể nào tương ứng với ý nào của fomat  ,và còn thiếu ý nào. Trả lời theo dạng danh sách liệt kê từng ý. 
### **2.2. Ngữ pháp và cấu trúc câu**  
* Nội dung trả về kết quả tuân theo quy tắc:
  **  1. đưa ra câu cụ thể có lỗi, in đâm câu đó.
  **  2. chỉ ra lỗi ngữ pháp, cấu trúc câu.
  **  3. đưa ra câu/từ cụ thể đúng để sửa lỗi.
  **  4. trình bày nội dung theo dạng danh sách liệt kê từng lỗi, mỗi lỗi tách thành dòng riêng.
### **2.3. Từ vựng**  
* Nội dung trả về kết quả tuân theo quy tắc:
  **  1. Đánh giá sự đa dạng và chính xác của từ vựng.
  **  2. Phát hiện từ hoặc cụm từ chưa phù hợp và đề xuất thay thế
  **  3. Gợi ý từ vựng nâng cao phù hợp với trình độ của user. 
  **  4. trình bày nội dung theo dạng danh sách liệt kê từng lỗi, mỗi lỗi tách thành dòng riêng.
### **2.4. Mạch lạc và Tính liên kết**  
* Nội dung trả về kết quả tuân theo quy tắc:
  **  1. Các câu trả lời có dễ hiểu, mạch lạc không?
  **  2. Phát hiện câu hoặc  từ chưa phù hợp và đề xuất thay thế( phải chỉ ra thay thế vào ví trí cụ thể và in đậm từ thay thế).
  **  3. trình bày nội dung theo dạng danh sách liệt kê từng lỗi, mỗi lỗi tách thành dòng riêng.
## **3. Đề xuất cải thiện**  
* Chỉnh sửa lại bài viết của user cho đúng nội dung này :
 ** 1. Chỉnh sửa ngữ pháp, từ vựng, cấu trúc câu, chính tả, dấu câu, v.v. để nâng cao chất lượng bài viết.
 ** 2. Viết lại các câu chưa đúng với yêu cầu của đề bài, đảm bảo đáp ứng đầy đủ các điểm trong Format yêu cầu.
 ** 3. Viết 100% bằng tiếng anh, không sử dung tiếng Việt trong phần trả lời.
 ** 4. Đặc biệt tuyệt đối không thêm bây kỳ: câu văn, gợi ý,lưu ý, giải thích, nhận xét nào, ngoài đoạn văn đã được chỉnh sửa.
"; 
`;
};

const getAiCheckWriting_4 = async ({ debai, cauhoi, traloi }) => {
  const genAI = new GoogleGenerativeAI(
    "AIzaSyDBo-e5H5AP8flpgsuvhSSsqi7F9wzM-Pg"
  );
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });
  // const prompt = promptExam(level, texts);

  const promps = await getPrompsWringPart_4({ debai, cauhoi, traloi });

  const resultss = await model.generateContent(promps);
  const response = resultss.response;

  console.log({ response });
  const text = response.text();
  console.log({ text });

  return text;
};

const getPrompsWringPart = async ({ debai, content }) => {
  return `
	You are an experienced English writing coach with deep expertise in language instruction and feedback. You will receive three inputs from the user:  
1. **The task prompt: ${debai}**
2. **this question and user's answers ${content}** 
3. **The description of user’s current English proficiency level according to the CEFR B2.  

Your task is to **analyze** the writing submission in relation to the provided assignment requirement while taking into account the user's CEFR level. Your **feedback must be structured clearly into a well-organized report** to enhance readability and effectiveness.  

---  

## **Quality Standards**  

Your evaluation must adhere to the following quality standards to ensure clarity, accuracy, and educational value:  

### **1. Content & Task Fulfillment**  
✅ The writing must fully address the assignment prompt.  
✅ Ideas should be well-developed, relevant, and logically structured.  
✅ Arguments must be supported with appropriate examples or reasoning.  

### **2. Grammar & Sentence Structure**  
✅ The writing should use correct grammar with minimal errors.  
✅ Sentence structures must be clear, concise, and well-formed.  
✅ For advanced levels (B2+), diverse sentence structures should be used.  

### **3. Vocabulary & Word Choice**  
✅ Word choices must be appropriate for the context and user’s CEFR level.  
✅ Overuse of repetitive words should be avoided; synonyms should be used effectively.  
✅ Collocations and natural phrasing should be encouraged.  

### **4. Coherence & Cohesion**  
✅ Ideas should be logically connected without abrupt changes.  
✅ Appropriate linking words (e.g., however, therefore, in contrast) must be used.  
✅ Paragraphs should transition smoothly for logical progression.  

### **5. Accuracy & Naturalness**  
✅ The writing should avoid direct translations from Vietnamese to English.  
✅ Proofreading is recommended to eliminate errors before submission.  
✅ Reading aloud is encouraged to check for fluency and natural phrasing.  

---  

## **Critical Instructions**  

✅ **Your feedback must be entirely in Vietnamese.** Do not use English in the response.  
✅ **Maintain a professional, constructive, and encouraging tone.**  
✅ **Be direct and specific, avoiding vague comments.**  
✅ **All feedback must be supported with clear examples.**  
✅ **Sub-points under the same main idea need to have a * or ** at the beginning of the sentence.**  
✅ **Always adjust feedback according to the user's CEFR level.**  
✅ **Must analyze each question and the corresponding answer in detail.**  


---  

## **Output Format**  

Your response must be presented firmly in the following structured format:  

## **1. Tổng quan**  
* Tóm tắt ngắn gọn về câu trả lời.  
* Nhận xét chung về mức độ hoàn thành yêu cầu đề bài.   

## **2. Phân tích chi tiết**  

### **2.1. Mức độ hoàn thành yêu cầu đề bài**  
* Bài viết có bám sát câu hỏi không?  
* Nội dung có đủ ý, phát triển tốt không?  
* Các lập luận có thuyết phục, rõ ràng và có dẫn chứng phù hợp không?  

### **2.2. Ngữ pháp và cấu trúc câu**  
* Đánh giá mức độ chính xác của ngữ pháp.  
* Những lỗi phổ biến và cách khắc phục.  
* Gợi ý cải thiện cách diễn đạt và cấu trúc câu.  

### **2.3. Từ vựng**  
- Đánh giá sự đa dạng và chính xác của từ vựng.  
- Phát hiện từ hoặc cụm từ chưa phù hợp và đề xuất thay thế.  
- Gợi ý từ vựng nâng cao phù hợp với trình độ của user.  

### **2.4. Mạch lạc và Tính liên kết**  
- Các câu trả lời có dễ hiểu, mạch lạc không?  
- Các đoạn có kết nối hợp lý với nhau không?  
- Cách chuyển ý có tự nhiên không?  

## **3. Đề xuất cải thiện**  
* Đề xuât câu trả lời đúng với các câu hỏi phù hợp với trình độ của user.";
`;
};

const getAiCheckWriting = async ({ debai, content }) => {
  const genAI = new GoogleGenerativeAI(
    "AIzaSyDBo-e5H5AP8flpgsuvhSSsqi7F9wzM-Pg"
  );
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });
  // const prompt = promptExam(level, texts);

  const promps = await getPrompsWringPart({ debai, content });

  const resultss = await model.generateContent(promps);
  const response = resultss.response;

  console.log({ response });
  const text = response.text();
  console.log({ text });

  return text;
};

export {
  getAiCheckWriting,
  getAiCheckWriting_4,
  getGeminiAi,
  getGeminiAiCheck,
  getGeminiAiResearch,
};
