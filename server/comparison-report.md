# Database vs JSON Files Comparison Report

Generated at: 2026-05-29T07:29:06.107Z

## 1. Count Comparison

| Skill | Part | DB Count | JSON Count | Match? |
|---|---|---|---|---|
| SPEAKING | 1 | 18 | 19 | ❌ |
| SPEAKING | 2 | 51 | 51 | ✅ |
| SPEAKING | 3 | 49 | 49 | ✅ |
| SPEAKING | 4 | 40 | 40 | ✅ |
| READING | 1 | 16 | 22 | ❌ |
| READING | 2 | 40 | 48 | ❌ |
| READING | 3 | 16 | 15 | ❌ |
| READING | 4 | 14 | 16 | ❌ |
| LISTENING | 1 | 13 | 12 | ❌ |
| LISTENING | 2 | 12 | 12 | ✅ |
| LISTENING | 3 | 13 | 13 | ✅ |
| LISTENING | 4 | 55 | 25 | ❌ |
| WRITING | 1 | 34 | 34 | ✅ |
| WRITING | 2 | 44 | 42 | ❌ |
| WRITING | 3 | 47 | 46 | ❌ |
| WRITING | 4 | 49 | 48 | ❌ |

## 2. Detailed Comparison


### SPEAKING Part 1

- ✅ Matched IDs: 18
- ❌ Only in JSON (1): 68e4c17753b4655eba3f0aca

**Content Differences:**

#### Document 68e4bfb453b4655eba3f0a9e
- Type mismatch at timeToDo: DB type object vs JSON type string
- Value mismatch at description: DB 'không có tiêu đề' vs JSON ''
- Value mismatch at questions[0].subQuestion[0].suggestion: DB '<p class="ql-align-justify"><strong>Câu trả lời mẫu ( PP gộp đề):</strong> <span style="color: rgb(0, 138, 0);">(Giới thiệu bản thân, tên, tuổi, nghề nghiệp)</span> Sure. Let me introduce myself first. My name is Mia, who is living and working in Hanoi as an English teacher. <span style="color: rgb(153, 51, 255);">(Giới thiệu sơ qua số lượng thành viên, nghề nghiệp</span>) Honestly, my family is not very big, only six people. My grandparents are retired civil servants. My parents are teachers. My older sister is a singer and an actress, who I consider my best friend.&nbsp;<span style="color: rgb(255, 153, 0);">(Mô tả thành viên mình yêu nhất)</span> I’d love to tell you more about her because she’s the one I admire the most. She is really pretty, with a sweet face and fair skin. Besides, she sings beautifully and she helps me a lot, not only in my study but also in my life.</p>' vs JSON ''
- Value mismatch at questions[0].subQuestion[1].suggestion: DB '<p class="ql-align-justify"><strong>Câu trả lời mẫu (PP gộp đề):</strong></p><p class="ql-align-justify">*Biến hóa nhẹ ở đầu&nbsp;</p><p class="ql-align-justify"><span style="color: rgb(0, 138, 0);">(Bạn sống ở thành thị hay nông thôn) </span>I'm not really keen on living in a city. I would rather live in the countryside because it's so peaceful. Currently, my family and I live in a small town in the countryside, also a famous place. <span style="color: rgb(255, 153, 0);">(Tên, Vị trí) </span>It is Bac Ha town, which is 300 kilometers from Hanoi.&nbsp;<span style="color: rgb(0, 102, 204);">(Mật độ dân cư) </span>Even though it's always crowded with tourists, we still love living there<span style="color: rgb(194, 133, 255);"> (Thời tiết)</span> because the weather is so cool, (Con người) and the people are incredibly friendly. The most important reason is that<span style="color: rgb(178, 107, 0);"> (Đồ ăn)</span> the food here is exceptionally delicious and cheap. That's why I always want to live here.</p>' vs JSON ''
- Value mismatch at questions[0].subQuestion[2].suggestion: DB '<p><strong>Câu trả lời mẫu: </strong>Well, my absolute favorite hobby is playing badminton with my close friends. To be honest, I am often up to my neck in work during the week, so hitting the court on weekends is my go-to way to let my hair down. It is not only extremely beneficial for my physical health, but the whole experience also really helps me recharge my batteries for a new week.</p><p><strong style="background-color: rgb(255, 255, 0);">Từ vựng và Thành ngữ "ăn điểm" :</strong></p><ul><li><strong>Up to my neck in work</strong> (Idiom): Cực kỳ bận rộn, ngập đầu trong công việc.</li><li><strong>Let my hair down</strong> (Idiom): Thư giãn, xõa đi.</li><li><strong>Recharge my batteries</strong> (Idiom): Nạp lại năng lượng.</li></ul>' vs JSON ''

#### Document 68e4c0a353b4655eba3f0abf
- Type mismatch at timeToDo: DB type object vs JSON type string
- Value mismatch at description: DB 'không có tiêu đề' vs JSON ''
- Value mismatch at questions[0].subQuestion[0].suggestion: DB '<p><strong>Câu trả lời mẫu: </strong>In my opinion, if people visit my country, they should definitely go to a peaceful countryside town called Bac Ha, which is about 300 kilometers from Hanoi. Although it is a famous spot and often crowded with tourists, it is absolutely worth exploring. The weather is pleasantly cool, and the locals are incredibly welcoming. But most importantly, the regional food is exceptionally mouth-watering and cost-effective. It is truly a wonderful place for anyone to visit.</p>' vs JSON ''
- Value mismatch at questions[0].subQuestion[1].suggestion: DB '<p class="ql-align-justify"><strong>Câu trả lời mẫu:</strong> "Well, as soon as I finish this Aptis test, I plan to treat myself to a nice meal with my friends. To be honest, I have been up to my ears in study lately, so completing this exam is a huge relief. Later this evening, I just want to sit back, watch a hilarious movie, and let my hair down. It’s definitely the perfect way to recharge my batteries after a stressful period."</p><p><strong style="background-color: rgb(255, 255, 0);">Từ vựng và Thành ngữ "ăn điểm":</strong></p><ul><li><strong>Up to my ears in study (Idiom):</strong> Cực kỳ bận rộn, ngập đầu trong việc học/ôn thi.</li><li><strong>Hilarious (Adjective):</strong> Rất hài hước, mang tính biểu cảm cao hơn nhiều so với những từ cơ bản.</li><li><strong>Let my hair down (Idiom):</strong> Thư giãn, xõa đi.</li><li><strong>Recharge my batteries (Idiom):</strong> Nạp lại năng lượng.</li></ul><p class="ql-align-justify"><br></p>' vs JSON ''
- Value mismatch at questions[0].subQuestion[2].suggestion: DB '<p><strong>Câu trả lời mẫu:</strong> Well, people in my country really love sports. Football is the most popular sport, and many people watch the matches or play it in their free time. Besides football, badminton and volleyball are also common. Sports bring people together, and they help everyone stay healthy and active.</p>' vs JSON ''

#### Document 68e4c23753b4655eba3f0ad5
- Type mismatch at timeToDo: DB type object vs JSON type string
- Value mismatch at description: DB 'không có tiêu đề' vs JSON ''
- Value mismatch at questions[0].subQuestion[0].suggestion: DB '<p><strong>Câu trả lời mẫu:</strong> Well, to be honest, I'm not really keen on city life, so I currently live in a peaceful countryside town called Bac Ha, which is about 300 kilometers from Hanoi. Although it is a famous spot and often crowded with tourists, I absolutely love living there. The weather is pleasantly cool, and the locals are incredibly welcoming. But most importantly, the regional food is exceptionally mouth-watering and cost-effective. It is truly a wonderful place to call home.</p><p><strong style="background-color: rgb(255, 255, 0);">Từ vựng "ăn điểm":</strong></p><ul><li><strong>Not really keen on:</strong> Không thực sự thích (cụm từ hay hơn rất nhiều so với <em>don't like</em>).</li><li><strong>Welcoming (Adjective):</strong> Hiếu khách, niềm nở (nâng cấp cho chữ <em>friendly</em>).</li><li><strong>Mouth-watering (Adjective):</strong> Tính từ miêu tả món ăn "ngon chảy nước miếng", thay thế hoàn toàn cho cụm "very delicious" ở mức độ cơ bản.</li><li><strong>Cost-effective (Adjective):</strong> Tiết kiệm chi phí (nghe mang tính học thuật và trang trọng hơn rất nhiều so với chữ <em>cheap</em>).</li></ul>' vs JSON ''
- Value mismatch at questions[0].subQuestion[1].suggestion: DB '<p class="ql-align-justify"><strong>Câu trả lời mẫu:</strong><strong style="color: rgb(230, 0, 0);"> (Đó là ngôi trường nào) </strong>Well, let me tell you about my old primary school.&nbsp;<span style="color: rgb(153, 51, 255);">(Vị trí ở đâu)</span> To the best of my recollection, it was right in the heart of my village, just a 15-minute walk from my house, so I was never late for class. <span style="color: rgb(0, 138, 0);">(Trường có những phòng chức năng nào)</span> Additionally, there was a library, a computer room, and a big playground full of trees and flowers.<span style="color: rgb(255, 153, 0);"> (Bạn có cảm xúc gì khi nghĩ về trường) </span>Honestly, that place holds so many special memories from my childhood. I will pay a visit to it when I have the chance.</p>' vs JSON ''
- Value mismatch at questions[0].subQuestion[2].suggestion: DB '<p><strong>Câu trả lời mẫu:</strong> To be honest, my daily routine involves doing various activities. One of my favorite activities is going to the gym. My best friends and I usually spend around two hours working out together to improve our physical health. Later in the evening, we might hang out at a shopping mall just to let our hair down and enjoy ourselves.</p>' vs JSON ''

#### Document 68e4e61d53b4655eba3f0d80
- Type mismatch at timeToDo: DB type object vs JSON type string
- Value mismatch at description: DB 'không có tiêu đề' vs JSON ''
- Value mismatch at questions[0].subQuestion[0].suggestion: DB '<p>Well, to be honest, I'm not really keen on city life, so I currently live in a peaceful countryside town called Bac Ha, which is about 300 kilometers from Hanoi. Although it is a famous spot and often crowded with tourists, I absolutely love living there. The weather is pleasantly cool, and the locals are incredibly welcoming. But most importantly, the regional food is exceptionally mouth-watering and cost-effective. It is truly a wonderful place to call home.</p><p><strong style="background-color: rgb(255, 255, 0);">Từ vựng "ăn điểm":</strong></p><ul><li><strong>Not really keen on:</strong> Không thực sự thích</li><li><strong>Mouth-watering (Adjective):</strong> Tính từ miêu tả món ăn "ngon chảy nước miếng".</li><li><strong>Cost-effective (Adjective):</strong> Tiết kiệm chi phí.</li></ul>' vs JSON ''
- Value mismatch at questions[0].subQuestion[1].suggestion: DB '<p class="ql-align-justify"><strong>Câu trả lời mẫu:</strong> I always enjoy doing various activities. One of my favorites is going to the gym with my best friends, where we usually spend around two hours working out together because it helps improve our health day by day. In addition, my friends and I may go to some attractive destinations for sightseeing, or we hang out at the central shopping mall in the city, because these activities help us let our hair down and enjoy ourselves after a busy week.</p>' vs JSON ''
- Value mismatch at questions[0].subQuestion[2].suggestion: DB '<p><strong>Câu trả lời mẫu: </strong>Well, yes, I can play the guitar, and it is actually my absolute favorite hobby. To be honest, I am often up to my neck in work during the week, so playing some acoustic tunes in my room is my go-to way to let my hair down. It is incredibly entertaining, and whenever I feel overwhelmed, playing this instrument really helps me recharge my batteries for a new week.</p><p><strong style="background-color: rgb(255, 255, 0);">Từ vựng và Thành ngữ "ăn điểm":</strong></p><ul><li>Up to my neck in work (Idiom): Cực kỳ bận rộn, ngập đầu trong công việc.</li><li>Let my hair down (Idiom): Thư giãn, xõa đi.</li><li>Recharge my batteries (Idiom): Nạp lại năng lượng.</li></ul>' vs JSON ''

#### Document 68e4e69a53b4655eba3f0d8b
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68e4e77353b4655eba3f0d96
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68e4ecff53b4655eba3f0dcd
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68e4bea153b4655eba3f0a88
- Type mismatch at timeToDo: DB type object vs JSON type string
- Value mismatch at description: DB 'không có tiêu đề' vs JSON ''
- Value mismatch at questions[0].subQuestion[0].suggestion: DB '<p class="ql-align-justify"><span style="color: rgb(153, 51, 255); background-color: transparent;">(Bạn đang ở đâu)</span><span style="color: rgb(0, 0, 0); background-color: transparent;"> At the moment, I am sitting inside the Aptis test room and taking the speaking section.</span></p><p class="ql-align-justify"><span style="color: rgb(0, 138, 0); background-color: transparent;">(Mô tả nơi đó) </span><span style="color: rgb(0, 0, 0); background-color: transparent;">Generally, The room is quite spacious, with bright white walls and rows of tables lined with computers and headphones. In addition, there are also partitions to prevent candidates from cheating.</span></p><p class="ql-align-justify"><span style="color: rgb(255, 153, 0); background-color: transparent;">(Cảm xúc của bạn hiện tại ra sao) </span><span style="color: rgb(0, 0, 0); background-color: transparent;">Honestly, my emotions when sitting in this room include excitement and tension.</span></p>' vs JSON ''
- Value mismatch at questions[0].subQuestion[1].suggestion: DB '<p class="ql-align-justify">The last thing I watched on television was a comedy show called 'Running Man' with my family last night. To be honest, I have been up to my neck in work lately, so sitting on the sofa and watching this hilarious program is my favorite way to let my hair down. It was incredibly entertaining and helped me recharge my batteries for a new day.</p><p><strong style="background-color: rgb(255, 255, 0);">Từ vựng và Thành ngữ "ăn điểm":</strong></p><ul><li><strong>Up to my neck in work</strong> (Idiom): Cực kỳ bận rộn, ngập đầu trong công việc. (Có thể thay bằng <em>up to my ears in study/work</em>).</li><li><strong>Hilarious</strong> (Adjective): Rất hài hước (Thay thế cho chữ <em>very funny</em> ở mức độ cơ bản).</li><li><strong>Let my hair down</strong> (Idiom): Thư giãn, xõa đi. (Thay thế cho <em>relax</em>).</li><li><strong>Recharge my batteries</strong> (Idiom): Nạp lại năng lượng.</li></ul>' vs JSON ''
- Value mismatch at questions[0].subQuestion[2].suggestion: DB '<p class="ql-align-justify"><strong>Câu trả lời mẫu: </strong>Well, the food in my country is incredibly diverse and well-known for its rich flavors. We love to use lots of local spices. Take instant fried noodles as a typical example. It is a quick and easy dish, but we often add extra chili and special seasoning salts to make it absolutely mouth-watering. Actually, for us, food is more than just eating; it's a great way to bond. Whenever my friends come over, we usually share simple dishes like spicy noodles or some fast food, crack open a few beers, and just enjoy the moment together. It’s always an amazing time.</p><p class="ql-align-justify"><strong style="background-color: rgb(255, 255, 0);">Từ vựng và Thành ngữ "ăn điểm":</strong></p><ul><li><strong>Diverse and well-known for its rich flavors (Cụm từ):</strong> Đa dạng và nổi tiếng với hương vị đậm đà (thể hiện vốn từ vựng phong phú hơn mức cơ bản).</li><li><strong>Mouth-watering (Adjective): </strong>Ngon chảy nước miếng. (Nâng cấp cực tốt cho chữ "very delicious" của bạn).</li><li><strong>More than just eating; </strong>it's a great way to bond (Cụm từ): Không chỉ là ăn uống, nó là cách để gắn kết.</li><li class="ql-align-justify"><strong>Crack open a few beers (Idiom/Collocation):</strong> Bật nắp vài lon bia. (Nghe tự nhiên và "Tây" hơn rất nhiều so với "cheer up with beer").</li></ul>' vs JSON ''

#### Document 68e4c00653b4655eba3f0aa9
- Type mismatch at timeToDo: DB type object vs JSON type string
- Value mismatch at description: DB 'không có tiêu đề' vs JSON ''
- Value mismatch at questions[0].subQuestion[0].suggestion: DB '<p class="ql-align-justify"><strong>Câu trả lời mẫu:</strong> Well, this morning I traveled to the exam room by motorbike. As my city is well-known for its narrow streets, riding a motorbike offered me the flexibility to avoid traffic jams and arrive on time. Moreover, the smooth ride and fresh air really helped me relax and recharge my batteries before this important test</p><p><strong style="background-color: rgb(255, 255, 0);">Từ vựng và Thành ngữ "ăn điểm":</strong><span style="background-color: rgb(255, 255, 0);"> </span></p><ul><li><strong>Well-known for its narrow streets:</strong> Nổi tiếng với những con phố nhỏ hẹp.</li><li><strong>Recharge my batteries (Idiom):</strong> Nạp lại năng lượng.</li></ul><p class="ql-align-justify"><br></p>' vs JSON ''
- Value mismatch at questions[0].subQuestion[1].suggestion: DB '<p>Câu trả lời mẫu: Well, my country has a typical tropical climate with scorching hot summers. To be honest, the heat can be overwhelming since I'm usually up to my neck in work. But I absolutely love the sudden downpours in the afternoons. They cool everything down and give me a perfect chance to let my hair down and recharge my batteries.</p><p><strong style="background-color: rgb(255, 255, 0);">Từ vựng và Thành ngữ "ăn điểm":</strong><span style="background-color: rgb(255, 255, 0);"> </span></p><ul><li><strong>A sudden downpour:</strong> Một trận mưa rào bất chợt.</li><li><strong>Up to my neck in work (Idiom):</strong> Cực kỳ bận rộn, ngập đầu trong công việc.</li><li><strong>Let my hair down (Idiom):</strong> Thư giãn, xõa đi.</li><li><strong>Recharge my batteries (Idiom):</strong> Nạp lại năng lượng.</li></ul>' vs JSON ''
- Value mismatch at questions[0].subQuestion[2].suggestion: DB '<p><strong>Câu trả lời mẫu: </strong>Well, my absolute favorite film is a comedy called 'Running Man'. To be honest, I am usually up to my neck in work lately, so sitting on the sofa and watching this hilarious movie with my family is my go-to way to let my hair down. It is incredibly entertaining, and whenever I feel stressed, rewatching it really helps me recharge my batteries for a new week.</p><p><strong style="background-color: rgb(255, 255, 0);">Từ vựng và Thành ngữ "ăn điểm":</strong></p><ul><li><strong>Hilarious (Adjective):</strong> Rất hài hước, mang tính biểu cảm cao hơn nhiều so với những từ cơ bản.</li><li><strong>Let my hair down (Idiom):</strong> Thư giãn, xõa đi.</li><li><strong>Recharge my batteries (Idiom):</strong> Nạp lại năng lượng.</li></ul>' vs JSON ''

#### Document 68e4eb3453b4655eba3f0db7
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68e4bf5f53b4655eba3f0a93
- Type mismatch at timeToDo: DB type object vs JSON type string
- Value mismatch at description: DB 'không có tiêu đề' vs JSON ''
- Value mismatch at questions[0].subQuestion[0].suggestion: DB '<p class="ql-align-justify"><strong>Câu trả lời mẫu: </strong>The last time I went to the cinema was just last weekend to watch a comedy with my close friends. To be honest, I had been up to my neck in work that whole week, so catching a movie on the big screen was the perfect way to let my hair down. The film was incredibly hilarious, and the whole experience really helped me recharge my batteries for a new week.</p><p class="ql-align-justify"><strong style="background-color: rgb(255, 255, 0);">Từ vựng và Thành ngữ "ăn điểm" :</strong></p><ul><li class="ql-align-justify"><strong>Up to my neck in work</strong> (Idiom): Cực kỳ bận rộn, ngập đầu trong công việc.</li><li class="ql-align-justify"><strong>Let my hair down</strong> (Idiom): Thư giãn, xõa đi.</li><li class="ql-align-justify"><strong>Recharge my batteries</strong> (Idiom): Nạp lại năng lượng.</li><li class="ql-align-justify"><strong>Hilarious</strong> (Adjective): Rất hài hước, mang tính biểu cảm cao hơn nhiều so với những từ cơ bản.</li></ul>' vs JSON ''
- Value mismatch at questions[0].subQuestion[1].suggestion: DB '<p><strong>Câu trả lời mẫu:</strong> Well, my absolute favorite dish to cook is spicy fried noodles. To be honest, I am often up to my neck in work, so making a quick and easy dish like this is my go-to way to let my hair down. I always add extra chili and some local spices to make it absolutely mouth-watering. Actually, for me, cooking this simple meal for my friends is more than just eating; it's a great way to bond after a long week.</p><p><strong style="background-color: rgb(255, 255, 0);">Từ vựng và Thành ngữ "ăn điểm":</strong></p><ul><li><strong>Up to my neck in work</strong> (Idiom): Cực kỳ bận rộn, ngập đầu trong công việc.</li><li><strong>Let my hair down</strong> (Idiom): Thư giãn, xõa đi.</li><li><strong>Mouth-watering</strong> (Adjective): Tính từ miêu tả món ăn "ngon chảy nước miếng", thay thế hoàn toàn cho cụm "very delicious" ở mức độ cơ bản.</li><li><strong>More than just eating; it's a great way to bond</strong>: Cụm từ mang tính chất đúc kết, cho thấy bạn có khả năng mở rộng tư duy vượt ra ngoài nghĩa đen của đồ ăn.</li></ul>' vs JSON ''
- Value mismatch at questions[0].subQuestion[2].suggestion: DB '<p>Câu trả lời mẫu: In my opinion, traveling by motorbike is absolutely the best way to get around my country. To be honest, Vietnam is well-known for its narrow streets and stunning landscapes, so riding a motorbike offers you the ultimate freedom to explore hidden gems that cars cannot reach. Not to mention, it is incredibly cost-effective and allows you to completely immerse yourself in the local culture. It’s truly an unforgettable experience.</p><p><span style="background-color: rgb(255, 255, 0);">Từ vựng "ăn điểm" :</span></p><ul><li><strong>Ultimate freedom</strong> (Collocation): Sự tự do tuyệt đối.</li><li><strong>Hidden gems</strong> (Idiom): Những viên ngọc ẩn (chỉ những địa điểm tuyệt đẹp nhưng chưa bị du lịch hóa, ít người biết đến).</li><li><strong>Immerse yourself in</strong> (Phrasal verb): Đắm chìm vào, hòa mình vào (văn hóa).</li><li><strong>Cost-effective</strong> (Adjective): Tiết kiệm chi phí (nghe mang tính học thuật và trang trọng hơn rất nhiều so với chữ <em>cheap</em>).</li></ul>' vs JSON ''

#### Document 68e4c05853b4655eba3f0ab4
- Type mismatch at timeToDo: DB type object vs JSON type string
- Value mismatch at description: DB 'không có tiêu đề' vs JSON ''
- Value mismatch at questions[0].subQuestion[0].suggestion: DB '<p class="ql-align-justify"><strong>Câu trả lời mẫu:</strong> "Well, my childhood home was a cozy apartment in Hanoi. Although it wasn't very spacious, it holds my best memories. The flat was fully equipped with everything a family needed, including a compact kitchen where we used to bond over meals. Whenever I feel overwhelmed, thinking about that comfy bedroom where I used to listen to music helps me let my hair down and recharge my batteries."</p>' vs JSON ''
- Value mismatch at questions[0].subQuestion[1].suggestion: DB '<p class="ql-align-justify"><strong>Câu trả lời mẫu:</strong> In the future, I am planning to travel to Bac Ha town. It is a famous place which is 300 kilometers from Hanoi. <span style="color: rgb(153, 51, 255);">(Mật độ dân cư) </span>Even though it's always crowded with tourists, I still like to go there <span style="color: rgb(0, 138, 0);">(Thời tiết) </span>because the weather is so cool,<span style="color: rgb(255, 153, 0);"> (Con người)</span> and the people are incredibly friendly. The most important reason is that <span style="color: rgb(230, 0, 0);">(Đồ ăn)</span> the food here is exceptionally delicious and cheap. That's why I always want to travel here.</p>' vs JSON ''
- Value mismatch at questions[0].subQuestion[2].suggestion: DB '<p class="ql-align-justify"><strong>Câu trả lời mẫu: </strong>My favorite dish to cook is fried noodles. It is an easy dish to cook but very delicious. I love to add in it chilly and Hao Hao salt so that it tastes spicier. Whenever my friends come to my house, I often order food for them like haburgers, and chicken and I cook fried noodles myself. We can cheer up with beer or coke. That is amazing.</p>' vs JSON ''

#### Document 68e4c29153b4655eba3f0ae0
- Type mismatch at timeToDo: DB type object vs JSON type string
- Value mismatch at description: DB 'không có tiêu đề' vs JSON ''
- Value mismatch at questions[0].subQuestion[0].suggestion: DB '<p class="ql-align-justify"><strong style="color: rgb(0, 0, 0); background-color: transparent;"><em>Câu trả lời mẫu: </em></strong><span style="color: rgb(255, 153, 0); background-color: transparent;">(Giới thiệu bản thân, tên, tuổi, nghề nghiệp)</span><span style="color: rgb(0, 0, 0); background-color: transparent;"> Sure. Let me introduce myself first. My name is Mia, who is living and working in Hanoi as an English teacher .</span></p><p class="ql-align-justify"><span style="color: rgb(0, 138, 0); background-color: transparent;">(Giới thiệu sơ qua số lượng thành viên, nghề nghiệp)</span><span style="color: rgb(0, 0, 0); background-color: transparent;"> Honestly, my family is not very big, only six people. My grandparents are retired civil servants. My parents are teachers. My older sister is a singer and an actress, who I consider my best friend.&nbsp;</span><span style="color: rgb(153, 51, 255); background-color: transparent;">(Mô tả thành viên mình yêu nhất) </span><span style="color: rgb(0, 0, 0); background-color: transparent;">I’d love to tell you more about her because she’s the one I admire the most. She is really pretty, with a sweet face and fair skin. Besides, she sings beautifully and she helps me a lot, not only in my study but also in my life.</span></p>' vs JSON ''
- Value mismatch at questions[0].subQuestion[1].suggestion: DB '<p><strong>Mẫu câu trả lời:</strong><strong style="color: rgb(230, 0, 0);"> </strong><span style="color: rgb(230, 0, 0);">(Bạn sống ở nhà hay căn hộ, vị trí ở đâu) </span>I currently live in an apartment in Hanoi.<span style="color: rgb(0, 138, 0);"> (Diện tích nhà chật hay rộng) </span>It is not very spacious, but I like the convenience of living here. I can walk to the market or my workplace in just 5 minutes.<span style="color: rgb(0, 138, 0);"> </span><span style="color: rgb(153, 51, 255);">(Ngôi nhà có bao nhiêu phòng, có tiện nghi gì) </span>Furthermore, the room’s got everything I need including a small kitchen, a comfy bedroom, and a bathroom.<span style="color: rgb(240, 102, 102);"> (Bạn thích làm gì khi ở nhà) </span>Whenever I have free time at home, I often relax by listening to music on my bed.</p>' vs JSON ''
- Value mismatch at questions[0].subQuestion[2].suggestion: DB '<p><strong style="background-color: rgba(248, 250, 252, 0.5);">Mẫu câu trả lời: </strong>Well, I always enjoy doing various sports and physical activities. To be honest, I am usually up to my neck in work, so this is my favorite way to unwind. My absolute favorite is going to the gym with my best friends, where we usually spend around two hours working out together. This not only helps improve our physical health day by day, but it also helps us let our hair down and enjoy ourselves after a busy week.</p><p><strong style="background-color: rgb(255, 255, 0);">Từ vựng và Thành ngữ "ăn điểm":</strong></p><ul><li><strong>Up to my neck in work (Idiom):</strong> Cực kỳ bận rộn, ngập đầu trong công việc.</li><li><strong>Let our hair down (Idiom):</strong> Thư giãn, xõa đi.</li><li><strong>Physical health:</strong> Sức khỏe thể chất.</li></ul>' vs JSON ''

#### Document 68e4c3ec53b4655eba3f0b22
- Type mismatch at timeToDo: DB type object vs JSON type string
- Value mismatch at questions[0].subQuestion[0].suggestion: DB '<p class="ql-align-justify"><strong style="background-color: transparent; color: rgb(0, 0, 0);">Câu trả lời mẫu: </strong></p><p class="ql-align-justify"><span style="background-color: transparent; color: rgb(0, 138, 0);">(Giới thiệu bản thân, tên, tuổi, nghề nghiệp) </span><span style="background-color: transparent; color: rgb(0, 0, 0);">Sure. Let me introduce myself first. My name is Mia, who is living and working in Hanoi as an English teacher.</span></p><p class="ql-align-justify"><span style="background-color: transparent; color: rgb(153, 51, 255);">(Giới thiệu sơ qua số lượng thành viên, nghề nghiệp) </span><span style="background-color: transparent; color: rgb(0, 0, 0);">Honestly, my family is not very big, only six people. My grandparents are retired civil servants. My parents are teachers. My older sister is a singer and an actress, who I consider my best friend.&nbsp;</span></p><p class="ql-align-justify"><span style="background-color: transparent; color: rgb(255, 153, 0);">(Mô tả thành viên mình yêu nhất) </span><span style="background-color: transparent; color: rgb(0, 0, 0);">I’d love to tell you more about her because she’s the one I admire the most. She is really pretty, with a sweet face and fair skin. Besides, she sings beautifully and she helps me a lot, not only in my study but also in my life.</span></p>' vs JSON ''
- Value mismatch at questions[0].subQuestion[1].suggestion: DB '<p class="ql-align-justify"><strong>Câu trả lời mẫu: </strong>Well, honestly, my favorite way to relax is doing some physical activities with my close friends. After a long and tiring week, we usually hit the gym and spend around two hours working out together. It's not just about improving our physical health; it's also the perfect time for us to catch up. Afterwards, we often hang out at the central shopping mall. These simple activities really help me let my hair down and completely recharge my batteries.</p><p><strong style="background-color: rgb(255, 255, 0);">Từ vựng "ăn điểm":</strong></p><ul><li><strong>Hit the gym:</strong> Đi tập gym.</li><li><strong>Physical health:</strong> Sức khỏe thể chất.</li><li><strong>Catch up:</strong> Hàn huyên, cập nhật tình hình của nhau.</li><li><strong>Let my hair down (Idiom):</strong> Thư giãn, xõa đi.</li></ul><p class="ql-align-justify"><br></p>' vs JSON ''
- Value mismatch at questions[0].subQuestion[2].suggestion: DB '<p><strong>Câu trả lời mẫu:</strong> Well, my absolute favorite dish is definitely spicy fried noodles. Since I am usually up to my neck in work, I really appreciate how quick and easy it is to prepare. I always add extra chili and a special seasoning called 'Hao Hao' salt to make it absolutely mouth-watering. Whenever my friends come over, I cook this signature dish for them, and we crack open a few cold beers. For me, it is more than just eating; it's a great way to bond and recharge our batteries.</p><p><strong style="background-color: rgb(255, 255, 0);">Từ vựng và Thành ngữ "ăn điểm":</strong></p><ul><li><strong>Mouth-watering (Adjective):</strong> Tính từ "ngon chảy nước miếng", nâng cấp hoàn hảo cho cụm từ cơ bản <em>very delicious</em>.</li><li><strong>Crack open a few cold beers (Idiom/Collocation):</strong> Bật nắp vài lon bia lạnh (nghe tự nhiên và "Tây" hơn rất nhiều so với cụm <em>cheer up with beer</em> ban đầu).</li><li><strong>More than just eating; it's a great way to bond:</strong> Cụm đúc kết cho thấy bạn có khả năng mở rộng tư duy vượt ra ngoài nghĩa đen của việc ăn uống thông thường.</li></ul>' vs JSON ''

#### Document 68e4e83c53b4655eba3f0da1
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68e4e9e753b4655eba3f0dac
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68e4ec1e53b4655eba3f0dc2
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68e4ed3e53b4655eba3f0dd8
- Type mismatch at timeToDo: DB type object vs JSON type string


### SPEAKING Part 2

- ✅ Matched IDs: 51

**Content Differences:**

#### Document 68e4ee0953b4655eba3f0de6
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68e5d19853b4655eba3f0eb3
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68e5d3c053b4655eba3f0eeb
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68e5d60c53b4655eba3f0f07
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68e5d68853b4655eba3f0f15
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68e5dafe53b4655eba3f0f4d
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68e5db8653b4655eba3f0f5b
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68e5e2ae53b4655eba3f0fde
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68e5e3e653b4655eba3f1008
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68f0a60753b4655eba3f27f5
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68f0bea153b4655eba3f28d6
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68f0fbe053b4655eba3f2ac4
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68f0ff6653b4655eba3f2b90
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68e5d4a953b4655eba3f0ef9
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68e5d89b53b4655eba3f0f31
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68e5e33853b4655eba3f0fec
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68e5e46153b4655eba3f1016
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68ea011253b4655eba3f1710
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68f0a49553b4655eba3f27cb
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68f0b73b53b4655eba3f2834
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68f0bb4b53b4655eba3f2890
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68f0bc2f53b4655eba3f289e
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68f0bd0253b4655eba3f28ba
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68f0fa1f53b4655eba3f2a01
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68f1014253b4655eba3f2c0b
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68e4ef0353b4655eba3f0df4
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68e5d96653b4655eba3f0f3f
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68e5dc8053b4655eba3f0f77
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68e5e63c53b4655eba3f104e
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68eb768a53b4655eba3f18f3
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68f0a51f53b4655eba3f27d9
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68f0b87253b4655eba3f2858
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68f0b90753b4655eba3f2866
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68f0bac253b4655eba3f2882
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68f0bcb453b4655eba3f28ac
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68e5d22b53b4655eba3f0ec1
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68e5d2f653b4655eba3f0ecf
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68e5d36453b4655eba3f0edd
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68e5d73153b4655eba3f0f23
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68e5dd2b53b4655eba3f0f85
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68e5e52d53b4655eba3f1032
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68e5e74353b4655eba3f105c
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68eb6ab553b4655eba3f18e5
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68f0a5b453b4655eba3f27e7
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68f0b65453b4655eba3f281d
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68f0b9f353b4655eba3f2874
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68f0bdbf53b4655eba3f28c8
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68f0fad953b4655eba3f2a70
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68f1b54753b4655eba3f2d9c
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68f1b5af53b4655eba3f2daa
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68f1b5e753b4655eba3f2db8
- Type mismatch at timeToDo: DB type object vs JSON type string


### SPEAKING Part 3

- ✅ Matched IDs: 49

**Content Differences:**

#### Document 68e6657553b4655eba3f11bb
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68e6683153b4655eba3f11f3
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68e66a4653b4655eba3f12e8
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68e739c953b4655eba3f147e
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68e73b1853b4655eba3f14a8
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68e73def53b4655eba3f14c4
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68f20a6b53b4655eba3f372c
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68f20bcb53b4655eba3f3748
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68f345ee53b4655eba3f38b2
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68e5e8c353b4655eba3f10cd
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68e6646d53b4655eba3f119f
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68e6679e53b4655eba3f11e5
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68e6698753b4655eba3f12cc
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68e7387553b4655eba3f1470
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68e73d7b53b4655eba3f14b6
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68e73e9553b4655eba3f14e0
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68e73ef253b4655eba3f14ee
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68ea019e53b4655eba3f171e
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68f20ca353b4655eba3f3766
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68e663aa53b4655eba3f1191
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68e665d653b4655eba3f11c9
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68e6673c53b4655eba3f11d7
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68e669ed53b4655eba3f12da
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68e7382553b4655eba3f1462
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68ea05f453b4655eba3f1737
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68f20da653b4655eba3f37a3
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68f2184153b4655eba3f383f
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68f3470e53b4655eba3f38c0
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68f34d1753b4655eba3f38ce
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68f34e0d53b4655eba3f38dc
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68e5e92353b4655eba3f10db
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68e664f553b4655eba3f11ad
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68e66ad753b4655eba3f12f6
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68e737a453b4655eba3f1454
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68e73ab753b4655eba3f149a
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68e73e3c53b4655eba3f14d2
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68eb7e3653b4655eba3f1901
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68f20b6353b4655eba3f373a
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68f211b553b4655eba3f37b1
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68f212b953b4655eba3f3807
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68f2132c53b4655eba3f3815
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68f2145a53b4655eba3f3823
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68f2177c53b4655eba3f3831
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 69c1640ac68879da1b92c704
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 69c164c0c68879da1b92cdc9
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 69c1659cc68879da1b92d179
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 69c167b5c68879da1b92d850
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 69c16a4ac68879da1b92d9f3
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 69c16b1ec68879da1b92e054
- Type mismatch at timeToDo: DB type object vs JSON type string


### SPEAKING Part 4

- ✅ Matched IDs: 40

**Content Differences:**

#### Document 68e478fb53b4655eba3f06d9
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68e47d3753b4655eba3f0705
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68e489e253b4655eba3f0777
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68e48fcb53b4655eba3f08ff
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68e4907453b4655eba3f090a
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68e4914a53b4655eba3f0915
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68e496a953b4655eba3f0941
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68e49a7753b4655eba3f0a06
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68f34faa53b4655eba3f3971
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68f3502053b4655eba3f397c
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68f350e853b4655eba3f399d
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68f3529053b4655eba3f39c9
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68f352e253b4655eba3f39d4
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68e4770953b4655eba3f06ce
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68e47aea53b4655eba3f06ef
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68e47e7a53b4655eba3f0710
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68e487e553b4655eba3f0747
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68e4954c53b4655eba3f092b
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68e4960453b4655eba3f0936
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68e499fd53b4655eba3f09fb
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68e49add53b4655eba3f0a11
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68f350a253b4655eba3f3992
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68f3512553b4655eba3f39a8
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68f3516653b4655eba3f39b3
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68e47a7053b4655eba3f06e4
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68e47f1a53b4655eba3f071b
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68e47fdf53b4655eba3f0726
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68e4833b53b4655eba3f073c
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68e4886c53b4655eba3f0752
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68e488d553b4655eba3f075d
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68e4975953b4655eba3f094c
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68e49b4453b4655eba3f0a1c
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68ea01ce53b4655eba3f1729
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68e47b9053b4655eba3f06fa
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68e4824653b4655eba3f0731
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68e4895053b4655eba3f0768
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68e491a353b4655eba3f0920
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68e4996953b4655eba3f09f0
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68f3506553b4655eba3f3987
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 68f351a753b4655eba3f39be
- Type mismatch at timeToDo: DB type object vs JSON type string


### READING Part 1

- ✅ Matched IDs: 15
- ❌ Only in DB (1): 695a25c110b9d3fe9bd3877b
- ❌ Only in JSON (7): 69ec457df89e08fdb549b83e, 69ec457defedf4f1a227fe8e, 756184854aa85a7f9a914b4a, ad2c4e269509fe481ba5a847, 9af06f7fde01dcff8088e388, 73e5caa5c9124a183ee64308, 5d2af7208cf7130c6addb976

**Content Differences:**

#### Document 6955d3ee5723012229d3ee88
- Value mismatch at data.title: DB 'Đề 12' vs JSON 'Mountain'
- Value mismatch at data.questions.questionTitle: DB 'Đề 12' vs JSON 'Mountain'

#### Document 6955dbea5723012229d3fb49
- Value mismatch at data.title: DB 'Đề 15' vs JSON 'Wellness Trends'
- Value mismatch at data.questions.questionTitle: DB 'Đề 15' vs JSON 'Wellness Trends'

#### Document 6955e01d5723012229d3fce9
- Value mismatch at data.title: DB 'Đề 16' vs JSON 'The arrival of four-day week'
- Value mismatch at data.questions.questionTitle: DB 'Đề 16' vs JSON 'The arrival of four-day week'

#### Document 695a268f10b9d3fe9bd387a7
- Value mismatch at data.questions.questionTitle: DB 'Đề 2' vs JSON 'Đề 2 '
- Value mismatch at data.questions.content: DB '<p><span style="background-color: transparent;">Choose the word that fits in the gap. The first one is done for you.</span></p><p><span style="background-color: transparent; color: rgb(0, 0, 0);">Hey Lewis,</span></p>' vs JSON '<p><span style="background-color: transparent;">Choose the word that fits in the gap. The first one is done for you.</span></p><p><span style="color: rgb(0, 0, 0); background-color: transparent;">Hey Lewis,</span></p>'

#### Document 695a28f110b9d3fe9bd38afa
- Value mismatch at data.questions.questionTitle: DB 'Đề 3' vs JSON 'Đề 3 '

#### Document 695a29f510b9d3fe9bd38b26
- Value mismatch at data.questions.questionTitle: DB 'Đề 4' vs JSON 'Đề 4 '

#### Document 695a2afc10b9d3fe9bd38b52
- Value mismatch at data.questions.questionTitle: DB 'Đề 5' vs JSON 'Đề 5 '

#### Document 695a311210b9d3fe9bd38f0b
- Value mismatch at data.questions.questionTitle: DB 'Đề 6' vs JSON 'Đề 6 '
- Value mismatch at data.questions.content: DB '<p><span style="background-color: transparent;">Choose the word that fits in the gap. The first one is done for you.</span></p><p><span style="color: rgb(0, 0, 0); background-color: transparent;">Hey Lewis,</span></p>' vs JSON '<p><span style="background-color: transparent;">Choose the word that fits in the gap. The first one is done for you.</span></p><p><span style="background-color: transparent; color: rgb(0, 0, 0);">Hey Lewis,</span></p>'

#### Document 695a323d10b9d3fe9bd38f39
- Value mismatch at data.questions.questionTitle: DB 'Đề 7' vs JSON 'Đề 7 '

#### Document 695a323e10b9d3fe9bd38f63
- Value mismatch at data.title: DB 'Đề 8' vs JSON 'Đề 7'
- Value mismatch at data.questions.questionTitle: DB 'Đề 8' vs JSON 'Đề 7 '

#### Document 695a334910b9d3fe9bd3923e
- Value mismatch at data.title: DB 'Đề 9' vs JSON 'Đề 8'
- Value mismatch at data.questions.questionTitle: DB 'Đề 9' vs JSON 'Đề 8 '

#### Document 695a350810b9d3fe9bd3926a
- Value mismatch at data.title: DB 'Đề 14' vs JSON 'Đề 9'
- Value mismatch at data.questions.questionTitle: DB 'Đề 14' vs JSON 'Đề 9 '

#### Document 695a35f710b9d3fe9bd39296
- Value mismatch at data.questions.questionTitle: DB 'Đề 10' vs JSON 'Đề 10 '

#### Document 695a36e010b9d3fe9bd392c2
- Value mismatch at data.questions.questionTitle: DB 'Đề 11' vs JSON 'Đề 11 '

#### Document 6980262a83ed47779e04f857
- Value mismatch at data.questions.questionTitle: DB 'Đề 13' vs JSON 'Đề 13 (AK)'


### READING Part 2

- ✅ Matched IDs: 40
- ❌ Only in JSON (8): 695299dc17d3f9f552a5441f, 695a38df10b9d3fe9bd39327, 695a394e10b9d3fe9bd3934d, 695a527910b9d3fe9bd3946a, 695a541910b9d3fe9bd398f0, 695a545910b9d3fe9bd39916, 695a549110b9d3fe9bd39929, 69c0ea9ee521b65aeedbcb96

**Content Differences:**

#### Document 6955d4ed5723012229d3efa0
- Value mismatch at data.title: DB 'Films ( Phiên bản 1)' vs JSON 'Films'
- Value mismatch at data.questions.questionTitle: DB 'Films ( Phiên bản 1)' vs JSON 'Films'
- Value mismatch at data.questions.content: DB '<p><span style="color: rgb(33, 37, 41);">Put the sentences below in the right order. The first sentence is done for you.</span></p>' vs JSON '<h3>Put the sentences below in the right order</h3>'
- Value mismatch at data.questions.answerList[4].content: DB 'This lack of money mostly affected actors, and they didn't earn much.' vs JSON 'This lack of money mostly affected actors, and they didn't earn much'

#### Document 6955d53d5723012229d3efb3
- Value mismatch at data.title: DB 'The famous singer ( Phiên bản 1)' vs JSON 'Singer'
- Value mismatch at data.questions.questionTitle: DB 'The famous singer ( Phiên bản 1)' vs JSON 'Singer'
- Value mismatch at data.questions.content: DB '<p><span style="color: rgb(33, 37, 41);">Put the sentences below in the right order. The first sentence is done for you.</span></p>' vs JSON '<h3>Put the sentences below in the right order</h3>'

#### Document 6955dc9d5723012229d3fbcc
- Value mismatch at data.title: DB 'Healthy eating ( Phiên bản 2)' vs JSON 'Healthy eating'
- Value mismatch at data.questions.questionTitle: DB 'Healthy eating ( Phiên bản 2)' vs JSON 'Healthy eating'

#### Document 6955e09a5723012229d3fd15
- Value mismatch at data.title: DB 'The first American woman in Space ( Phiên bản 2)' vs JSON 'The first American woman in Space'
- Value mismatch at data.questions.questionTitle: DB 'The first American woman in Space ( Phiên bản 2)' vs JSON 'The first American woman in Space'
- Value mismatch at data.questions.answerList[0].content: DB 'With the support of her parents, she went to university to study science.' vs JSON 'With the support of her parents, she went to university to study science'
- Value mismatch at data.questions.answerList[1].content: DB 'This is about space, and it helps Mae to become a member of a research team.' vs JSON 'This is about space, and it helps Mae to become a member of a research team'
- Value mismatch at data.questions.answerList[2].content: DB 'Her degree enabled her to get a place on the training course in the USA.' vs JSON 'Her degree enabled her to get a place on the training course in the USA'
- Value mismatch at data.questions.answerList[4].content: DB 'As part of this group, she traveled to space and did a lot of experiments.' vs JSON 'As part of this group, she traveled to space and did a lot of experiments'

#### Document 6955e0e75723012229d3fd28
- Value mismatch at data.title: DB 'Music show at the park ( Phiên bản 2)' vs JSON 'Music show at the park'
- Value mismatch at data.questions.questionTitle: DB 'Music show at the park ( Phiên bản 2)' vs JSON 'Music show at the park'

#### Document 695a380b10b9d3fe9bd392ee
- Value mismatch at data.title: DB 'Films ( Phiên bản 2)' vs JSON 'Films'
- Value mismatch at data.questions.questionTitle: DB 'Films ( Phiên bản 2)' vs JSON 'Films '

#### Document 695a388d10b9d3fe9bd39314
- Value mismatch at data.title: DB 'The famous singer ( Phiên bản 4)' vs JSON 'The famous singer'
- Value mismatch at data.questions.questionTitle: DB 'The famous singer ( Phiên bản 4)' vs JSON 'The famous singer'

#### Document 695a391c10b9d3fe9bd3933a
- Value mismatch at data.title: DB 'Writing about a place ( Phiên bản 1)' vs JSON 'Writing about a place'
- Value mismatch at data.questions.questionTitle: DB 'Writing about a place ( Phiên bản 1)' vs JSON 'Writing about a place'

#### Document 695a398c10b9d3fe9bd39360
- Value mismatch at data.title: DB 'The history of transportation ( Phiên bản 1)' vs JSON 'The history of transportation'
- Value mismatch at data.questions.questionTitle: DB 'The history of transportation ( Phiên bản 1)' vs JSON 'The history of transportation'

#### Document 695a39d410b9d3fe9bd39373
- Value mismatch at data.title: DB 'New coffee shop ( Phiên bản 1)' vs JSON 'New coffee shop (key)'
- Value mismatch at data.questions.questionTitle: DB 'New coffee shop ( Phiên bản 1)' vs JSON 'New coffee shop'

#### Document 695a3a2210b9d3fe9bd39386
- Value mismatch at data.title: DB 'AI - Artificial Intelligence ( Phiên bản 2)' vs JSON 'Artificial intelligence (key)'
- Value mismatch at data.questions.questionTitle: DB 'AI - Artificial Intelligence ( Phiên bản 2)' vs JSON 'Artificial intelligence '

#### Document 695a3a6b10b9d3fe9bd39399
- Value mismatch at data.title: DB 'Company wellness day' vs JSON 'Company wellness day ( key)'

#### Document 695a3aa210b9d3fe9bd393ac
- Value mismatch at data.title: DB 'Workplace evolution ( Phiên bản 1)' vs JSON 'Workplace evolution  ( key)'
- Value mismatch at data.questions.questionTitle: DB 'Workplace evolution ( Phiên bản 1)' vs JSON 'Workplace evolution '
- Value mismatch at data.questions.answerList[0].numberOrder: DB '5' vs JSON '4'

#### Document 695a4ffc10b9d3fe9bd393bf
- Value mismatch at data.title: DB 'Music show at the park ( Phiên bản 1)' vs JSON 'Music show at the park ( key)'
- Value mismatch at data.questions.questionTitle: DB 'Music show at the park ( Phiên bản 1)' vs JSON 'Music show at the park'

#### Document 695a507e10b9d3fe9bd393d2
- Value mismatch at data.title: DB 'Mae - The Math Girl' vs JSON 'Mae - The Math Girl ( KEY)'

#### Document 695a50d710b9d3fe9bd393e5
- Value mismatch at data.title: DB 'New coffee shop (Phiên bản 4)' vs JSON 'Eating at restaurant ( KEY)'
- Value mismatch at data.questions.questionTitle: DB 'New coffee shop (Phiên bản 4)' vs JSON 'Eating at restaurant '

#### Document 695a510610b9d3fe9bd393f8
- Value mismatch at data.title: DB 'A group presentation ' vs JSON 'A group presentation (KEY)'

#### Document 695a515d10b9d3fe9bd3940b
- Value mismatch at data.title: DB 'Workplace evolution (phiên bản 2)' vs JSON 'Workplace evolution (phiên bản 2) (key)'

#### Document 695a519b10b9d3fe9bd3941e
- Value mismatch at data.title: DB 'The first american woman in space ( Phiên bản 1)' vs JSON 'The first american woman in space ( key)'
- Value mismatch at data.questions.questionTitle: DB 'The first american woman in space ( Phiên bản 1)' vs JSON 'The first american woman in space'

#### Document 695a523610b9d3fe9bd39457
- Value mismatch at data.title: DB 'AI - Artificial Intelligence ( Phiên bản 1)' vs JSON 'AI - Artificial Intelligence'
- Value mismatch at data.questions.questionTitle: DB 'AI - Artificial Intelligence ( Phiên bản 1)' vs JSON 'AI - Artificial Intelligence'

#### Document 695a545810b9d3fe9bd39905
- Value mismatch at data.title: DB 'New coffee shop ( Phiên bản 3)' vs JSON 'My visit to a new coffee shop'
- Value mismatch at data.questions.questionTitle: DB 'New coffee shop ( Phiên bản 3)' vs JSON 'My visit to a new coffee shop'

#### Document 695a55bc10b9d3fe9bd39988
- Value mismatch at data.title: DB 'Healthy eating ( Phiên bản 1)' vs JSON 'Healthy eating'
- Value mismatch at data.questions.questionTitle: DB 'Healthy eating ( Phiên bản 1)' vs JSON 'Healthy eating '

#### Document 695a55f110b9d3fe9bd3999b
- Value mismatch at data.questions.answerList[3].content: DB 'After the demonstrations, awards were given to the creators of the most innovative products.' vs JSON 'Visitors enjoyed complimentary coffee and snacks while exploring the interactive exhibits.'
- Value mismatch at data.questions.answerList[4].content: DB 'Visitors enjoyed complimentary coffee and snacks while exploring the interactive exhibits.' vs JSON 'After the demonstrations, awards were given to the creators of the most innovative products.'

#### Document 695a57a210b9d3fe9bd39ea9
- Value mismatch at data.title: DB 'IoT - Internet of Things' vs JSON 'IoT - Internet of Things (key)'


### READING Part 3

- ✅ Matched IDs: 14
- ❌ Only in DB (2): 69d715b0616c4837526b8f16, 69d71716616c4837526b8f2e
- ❌ Only in JSON (1): 695a7b7b10b9d3fe9bd3a9ef

**Content Differences:**

#### Document 6955d6815723012229d3efef
- Value mismatch at data.title: DB 'Games from childhood ( Phiên bản 1)' vs JSON 'childhood'
- Value mismatch at data.questions.questionTitle: DB 'Games from childhood ( Phiên bản 1)' vs JSON 'childhood'

#### Document 6955de965723012229d3fc6b
- Value mismatch at data.title: DB 'Extreme sports ( Phiên bản 2)' vs JSON 'Extreme sports ( Phiên bản 3)'
- Value mismatch at data.questions.questionTitle: DB 'Extreme sports ( Phiên bản 2)' vs JSON 'Extreme sports ( Phiên bản 3)'

#### Document 6955e1bc5723012229d3fd3b
- Value mismatch at data.title: DB 'Music festival  ( phiên bản 3)' vs JSON 'Music festival - Version 3'
- Value mismatch at data.questions.questionTitle: DB 'Music festival  ( phiên bản 3)' vs JSON 'Music festival - Version 3'
- Value mismatch at data.questions.content: DB '<p class="ql-align-justify"><strong>Four people respond in the comments section of an online magazine article about a&nbsp;</strong>Music festival<strong>. Read the texts and then answer the questions below.</strong></p><p class="ql-align-justify">A: This is my first time going to a concert. I didn’t feel very well during the first two days because it was raining and the music was just of average. It would have been much nicer if there had been some sunshine. Fortunately, the final day was wonderful, and I was able to meet my favorite singers and create unforgettable memories</p><p class="ql-align-justify">B: I attend music festivals every year. It has become a tradition for me, as I truly love the lively atmosphere filled with people and music. This festival, however, felt rather unusual. The weather was not ideal, but that didn’t really bother me, since I have been to rain-free festivals and still had fun. The location was only somewhat convenient, and the music was quite average. Honestly, I don’t think I will return in the future.</p><p class="ql-align-justify">C: I don’t like one particular type of music being played at festivals. I prefer an album with a mix of genres to dance to, and this show really met my expectations. The melodies performed were simply astonishing. It did rain a little, but I didn’t mind at all; in fact, I felt it added to the lively atmosphere. However, I noticed that the ticket price was rather high, and not many students could afford it. Personally, I had to save money for months before attending.</p><p class="ql-align-justify">D: My band and I were invited to play at this festival. We gave our usual performance and were able to create a memorable show. Some of our old members were there, along with artists we had collaborated with in the past. It was wonderful catching up with them after the event. Unfortunately, the venue was far from the main road, and transporting our equipment was quite difficult.</p>' vs JSON '<p class="ql-align-justify"><strong>Four people respond in the comments section of an online magazine article about a&nbsp;</strong>Music festival<strong>. Read the texts and then answer the questions below.</strong></p><p class="ql-align-justify"><br></p><p class="ql-align-justify">A: This is my first time going to a concert. I didn’t feel very well during the first two days because it was raining and the music was just of average. It would have been much nicer if there had been some sunshine. Fortunately, the final day was wonderful, and I was able to meet my favorite singers and create unforgettable memories.</p><p class="ql-align-justify"><br></p><p class="ql-align-justify">B: I attend music festivals every year. It has become a tradition for me, as I truly love the lively atmosphere filled with people and music. This festival, however, felt rather unusual. The weather was not ideal, but that didn’t really bother me, since I have been to rain-free festivals and still had fun. The location was only somewhat convenient, and the music was quite average. Honestly, I don’t think I will return in the future.</p><p class="ql-align-justify"><br></p><p class="ql-align-justify">C: I don’t like one particular type of music being played at festivals. I prefer an album with a mix of genres to dance to, and this show really met my expectations. The melodies performed were simply astonishing. It did rain a little, but I didn’t mind at all; in fact, I felt it added to the lively atmosphere. However, I noticed that the ticket price was rather high, and not many students could afford it. Personally, I had to save money for months before attending.</p><p class="ql-align-justify"><br></p><p class="ql-align-justify">D: My band and I were invited to play at this festival. We gave our usual performance and were able to create a memorable show. Some of our old members were there, along with artists we had collaborated with in the past. It was wonderful catching up with them after the event. Unfortunately, the venue was far from the main road, and transporting our equipment was quite difficult.</p>'

#### Document 695a768810b9d3fe9bd3a87f
- Value mismatch at data.title: DB 'Games from childhood ( phiên bản 2)' vs JSON 'Games from childhood'
- Value mismatch at data.questions.questionTitle: DB 'Games from childhood ( phiên bản 2)' vs JSON 'Games from childhood'

#### Document 695a76f810b9d3fe9bd3a897
- Value mismatch at data.title: DB 'Extreme sports ( Phiên bản 1)' vs JSON 'Extreme sports'
- Value mismatch at data.questions.questionTitle: DB 'Extreme sports ( Phiên bản 1)' vs JSON 'Extreme sports'
- Value mismatch at data.questions.subQuestion[6].content: DB 'Who always avoids playing extreme sports?' vs JSON 'Who always avoids playing extreme sport?'

#### Document 695a776f10b9d3fe9bd3a8af
- Value mismatch at data.title: DB 'Music festival ( Phiên bản 1)' vs JSON 'Music festival - Version 1'
- Value mismatch at data.questions.questionTitle: DB 'Music festival ( Phiên bản 1)' vs JSON 'Music festival - Version 1'

#### Document 695a780910b9d3fe9bd3a8c7
- Value mismatch at data.title: DB 'Technology in childhood ( Phiên bản 1)' vs JSON 'Technology in childhood'
- Value mismatch at data.questions.questionTitle: DB 'Technology in childhood ( Phiên bản 1)' vs JSON 'Technology in childhood'

#### Document 695a789510b9d3fe9bd3a8df
- Value mismatch at data.title: DB 'Technology in childhood (Phiên bản 2)' vs JSON 'Technology in childhood - Phiên bản 2'
- Value mismatch at data.questions.questionTitle: DB 'Technology in childhood (Phiên bản 2)' vs JSON 'Technology in childhood - Phiên bản 2'

#### Document 695a7b0010b9d3fe9bd3a9d7
- Value mismatch at data.title: DB 'Music festival (Phiên bản 2)' vs JSON 'Music festival - Version 2'
- Value mismatch at data.questions.questionTitle: DB 'Music festival (Phiên bản 2)' vs JSON 'Music festival - Version 2'

#### Document 69c2123c683ec8b79c9101bf
- Value mismatch at data.title: DB 'Music festival (Phiên bản 4)' vs JSON 'Music festival - Version 4'
- Value mismatch at data.questions.questionTitle: DB 'Music festival (Phiên bản 4)' vs JSON 'Music festival - Version 4'


### READING Part 4

- ✅ Matched IDs: 14
- ❌ Only in JSON (2): 697c7811fda7aa93bd839c0f, 697cc8bf6d2610a5acfd84f1

**Content Differences:**

#### Document 6955d82d5723012229d3f1b6
- Value mismatch at data.title: DB 'Mountain Summits ( Phiên bản 2)' vs JSON 'Mountain Submmits '
- Value mismatch at data.questions.questionTitle: DB 'Mountain Summits ( Phiên bản 2)' vs JSON 'Mountain (Tp1) v1'

#### Document 6955e3155723012229d3fd53
- Value mismatch at data.title: DB 'The arrival of four-day week (Phiên bản 2)' vs JSON 'The arrival of four-day week'
- Value mismatch at data.questions.questionTitle: DB 'The arrival of four-day week (Phiên bản 2)' vs JSON 'The arrival of four-day week (TP)'
- Value mismatch at data.questions.content: DB '<p><strong style="background-color: transparent; color: rgb(0, 0, 0);">1. </strong><span style="background-color: transparent; color: rgb(0, 0, 0);">With the emergence of the four-day working week, the traditional five-day schedule is increasingly being challenged. Many firms still cling to industrial-age models, assuming that long working hours guarantee efficiency. Yet, such assumptions no longer reflect the needs of modern employees. Today’s workforce values flexibility and wellbeing just as much as income. In fact, a rigid timetable often leads to burnout rather than productivity. It is becoming clear that the conventional system is steadily losing relevance.</span></p><p>&nbsp;</p><p><strong style="background-color: transparent; color: rgb(0, 0, 0);">2. </strong><span style="background-color: transparent; color: rgb(0, 0, 0);">The four-day working week has become highly relevant in today’s context of fast-paced living. The five-day system offers little time for proper rest or personal commitments. This is particularly demanding for women, who often balance professional duties with family responsibilities. A shorter schedule would allow employees to recharge and spend quality time with their loved ones. As a result, workers are more likely to be motivated and engaged in their jobs. In the long run, this can enhance both personal happiness and workplace morale.</span></p><p>&nbsp;</p><p><span style="background-color: transparent; color: rgb(0, 0, 0);">3. Despite its advantages, many corporations remain sceptical of the four-day model. Employers often fear that fewer hours will inevitably reduce productivity and profitability. These concerns are not entirely groundless. For example, a British company that trialled the scheme reported a 30% fall in performance. In Stevension City, the introduction of this policy resulted in losses of around 30 million dollars within a single month. Such evidence makes some businesses wary of adopting the reform on a large scale.</span></p><p>&nbsp;</p><p><strong style="background-color: transparent; color: rgb(0, 0, 0);">4. </strong><span style="background-color: transparent; color: rgb(0, 0, 0);">At first glance, the four-day week appears to provide employees with greater freedom and better balance. Companies that have introduced the policy often report that work is still completed within the shorter timeframe. However, hidden drawbacks are starting to surface. Studies show that compressed hours can lead to more mistakes and higher stress levels. Workers sometimes take unfinished tasks home, undermining the very purpose of the reform. These challenges raise doubts about the long-term sustainability of the model.</span></p><p>&nbsp;</p><p><strong style="background-color: transparent; color: rgb(0, 0, 0);">5. </strong><span style="background-color: transparent; color: rgb(0, 0, 0);">Psychological studies suggest that while the shorter week initially improves morale, the effect quickly fades. Employees often feel happier in the first stage because of the sudden increase in free time. Yet, after a period of adjustment, their emotional state tends to return to its normal level. Some even experience boredom or frustration once the novelty wears off. As a result, workers may start engaging in unpaid tasks or working from home to fill the gap. This pattern suggests that structural change alone may not guarantee lasting satisfaction.</span></p><p>&nbsp;</p><p><strong style="background-color: transparent; color: rgb(0, 0, 0);">6. </strong><span style="background-color: transparent; color: rgb(0, 0, 0);">Although the four-day week benefits many, certain professions find it far less practical. Teachers, for example, still have to cover the same amount of material and manage the same number of students. Compressing this workload into fewer days risks lowering educational quality. The police force faces similar obstacles, since crime does not decrease simply because officers are off duty. In such fields, reducing working days could lead to serious inefficiencies. Therefore, blanket application of the policy may create inequality across different sectors.</span></p><p>&nbsp;</p><p><strong style="background-color: transparent; color: rgb(0, 0, 0);">7.</strong><span style="background-color: transparent; color: rgb(0, 0, 0);"> Rather than implementing a universal four-day week, organisations could consider more flexible alternatives. Options such as reducing daily working hours, offering longer paid leave, or increasing financial incentives might prove equally effective. These approaches allow employees to enjoy better balance without disrupting productivity. Furthermore, companies could invest in digital tools and training to improve efficiency. A gradual shift towards flexibility may reduce resistance from employers. Ultimately, a tailored strategy may offer greater benefits than a one-size-fits-all solution.</span></p>' vs JSON '<p><strong style="color: rgb(0, 0, 0); background-color: transparent;">1. </strong><span style="color: rgb(0, 0, 0); background-color: transparent;">With the emergence of the four-day working week, the traditional five-day schedule is increasingly being challenged. Many firms still cling to industrial-age models, assuming that long working hours guarantee efficiency. Yet, such assumptions no longer reflect the needs of modern employees. Today’s workforce values flexibility and wellbeing just as much as income. In fact, a rigid timetable often leads to burnout rather than productivity. It is becoming clear that the conventional system is steadily losing relevance.</span></p><p>&nbsp;</p><p><strong style="color: rgb(0, 0, 0); background-color: transparent;">2. </strong><span style="color: rgb(0, 0, 0); background-color: transparent;">The four-day working week has become highly relevant in today’s context of fast-paced living. The five-day system offers little time for proper rest or personal commitments. This is particularly demanding for women, who often balance professional duties with family responsibilities. A shorter schedule would allow employees to recharge and spend quality time with their loved ones. As a result, workers are more likely to be motivated and engaged in their jobs. In the long run, this can enhance both personal happiness and workplace morale.</span></p><p>&nbsp;</p><p><span style="color: rgb(0, 0, 0); background-color: transparent;">3. Despite its advantages, many corporations remain sceptical of the four-day model. Employers often fear that fewer hours will inevitably reduce productivity and profitability. These concerns are not entirely groundless. For example, a British company that trialled the scheme reported a 30% fall in performance. In Stevension City, the introduction of this policy resulted in losses of around 30 million dollars within a single month. Such evidence makes some businesses wary of adopting the reform on a large scale.</span></p><p>&nbsp;</p><p><strong style="color: rgb(0, 0, 0); background-color: transparent;">4. </strong><span style="color: rgb(0, 0, 0); background-color: transparent;">At first glance, the four-day week appears to provide employees with greater freedom and better balance. Companies that have introduced the policy often report that work is still completed within the shorter timeframe. However, hidden drawbacks are starting to surface. Studies show that compressed hours can lead to more mistakes and higher stress levels. Workers sometimes take unfinished tasks home, undermining the very purpose of the reform. These challenges raise doubts about the long-term sustainability of the model.</span></p><p>&nbsp;</p><p><strong style="color: rgb(0, 0, 0); background-color: transparent;">5. Difficult to change entrenched habits</strong></p><p><span style="color: rgb(0, 0, 0); background-color: transparent;">Psychological studies suggest that while the shorter week initially improves morale, the effect quickly fades. Employees often feel happier in the first stage because of the sudden increase in free time. Yet, after a period of adjustment, their emotional state tends to return to its normal level. Some even experience boredom or frustration once the novelty wears off. As a result, workers may start engaging in unpaid tasks or working from home to fill the gap. This pattern suggests that structural change alone may not guarantee lasting satisfaction.</span></p><p>&nbsp;</p><p><strong style="color: rgb(0, 0, 0); background-color: transparent;">6. Unfair for certain groups</strong></p><p><span style="color: rgb(0, 0, 0); background-color: transparent;">Although the four-day week benefits many, certain professions find it far less practical. Teachers, for example, still have to cover the same amount of material and manage the same number of students. Compressing this workload into fewer days risks lowering educational quality. The police force faces similar obstacles, since crime does not decrease simply because officers are off duty. In such fields, reducing working days could lead to serious inefficiencies. Therefore, blanket application of the policy may create inequality across different sectors.</span></p><p>&nbsp;</p><p><strong style="color: rgb(0, 0, 0); background-color: transparent;">7. Alternative solutions worth considering</strong></p><p><span style="color: rgb(0, 0, 0); background-color: transparent;">Rather than implementing a universal four-day week, organisations could consider more flexible alternatives. Options such as reducing daily working hours, offering longer paid leave, or increasing financial incentives might prove equally effective. These approaches allow employees to enjoy better balance without disrupting productivity. Furthermore, companies could invest in digital tools and training to improve efficiency. A gradual shift towards flexibility may reduce resistance from employers. Ultimately, a tailored strategy may offer greater benefits than a one-size-fits-all solution.</span></p>'

#### Document 6963106e7ccc2d518f3e356e
- Value mismatch at data.title: DB 'Mountain Summits ( Phiên bản 1)' vs JSON 'Mountain ( Phiên bản 1)'
- Value mismatch at data.questions.questionTitle: DB 'Mountain Summits ( Phiên bản 1)' vs JSON 'Mountain ( Phiên bản 1)'
- Value mismatch at data.questions.content: DB '<p>1. The term "mountain" has evolved over time, reflecting not only physical characteristics but also cultural significance. In contemporary discussions, mountains may symbolize challenges to overcome or destinations for adventure, transcending their geographical attributes.</p><p>2. Climbing a mountain often leads to a profound sense of accomplishment. It represents not just reaching a physical summit but also conquering personal fears and pushing one's limits, creating memories that last a lifetime.</p><p>3. In today's digital age, sharing achievements has become prevalent. Climbing a mountain is frequently documented on social media, turning personal milestones into public spectacles that inspire others while also raising questions about authenticity.</p><p>4. The pursuit of climbing mountains can sometimes lead to misplaced priorities. While seeking adventure and recognition, individuals may neglect personal relationships or responsibilities, emphasizing the need for a balanced approach to life.</p><p>5. Engaging in extreme sports, such as mountain climbing, can forge strong bonds among participants. However, it may also create worrying connections where individuals prioritize adrenaline over safety, potentially leading to dangerous situations.</p><p>6. Shared experiences in challenging environments, like mountains, can deepen intimacy in relationships. Couples or friends who navigate the challenges of climbing together often find their bonds strengthened through mutual support and understanding.</p><p><span style="color: rgb(33, 37, 41);">7. While adventure is thrilling, there is a growing recognition of the importance of stability in life. Balancing the desire for adventure with the need for security is crucial, prompting individuals to reflect on their life choices and long-term goals.</span></p>' vs JSON '<p>1. The term "mountain" has evolved over time, reflecting not only physical characteristics but also cultural significance. In contemporary discussions, mountains may symbolize challenges to overcome or destinations for adventure, transcending their geographical attributes.</p><p>2. Climbing a mountain often leads to a profound sense of accomplishment. It represents not just reaching a physical summit but also conquering personal fears and pushing one's limits, creating memories that last a lifetime.</p><p>3. In today's digital age, sharing achievements has become prevalent. Climbing a mountain is frequently documented on social media, turning personal milestones into public spectacles that inspire others while also raising questions about authenticity.</p><p>4. The pursuit of climbing mountains can sometimes lead to misplaced priorities. While seeking adventure and recognition, individuals may neglect personal relationships or responsibilities, emphasizing the need for a balanced approach to life.</p><p>5. Engaging in extreme sports, such as mountain climbing, can forge strong bonds among participants. However, it may also create worrying connections where individuals prioritize adrenaline over safety, potentially leading to dangerous situations.</p><p>6.  While adventure is thrilling, there is a growing recognition of the importance of stability in life. Balancing the desire for adventure with the need for security is crucial, prompting individuals to reflect on their life choices and long-term goals.</p><p><span style="color: rgb(33, 37, 41);">7. Shared experiences in challenging environments, like mountains, can deepen intimacy in relationships. Couples or friends who navigate the challenges of climbing together often find their bonds strengthened through mutual support and understanding.</span></p>'

#### Document 696366c37ccc2d518f3e3ba3
- Value mismatch at data.title: DB 'Wellness trends' vs JSON 'Wellness trend'
- Value mismatch at data.questions.questionTitle: DB 'Wellness trends' vs JSON 'Wellness trend'

#### Document 6963c0c37ccc2d518f3e4b90
- Value mismatch at data.title: DB 'Women Mathematics ( Phiên bản 3)' vs JSON 'Woman Mathematics  ( phiên bản 1)'
- Value mismatch at data.questions.questionTitle: DB 'Women Mathematics ( Phiên bản 3)' vs JSON 'Woman Mathematics (TP1)'
- Value mismatch at data.questions.suggestion: DB '<p>1. Gender obscure achievements.</p><p>2. Acknowledging achievement of a pioneer.</p><p>3. Man unfairly credited.</p><p>4. A long career showing exceptional ability.</p><p>5. Labels can change perspective on people.</p><p>6. Attempting to create a gender balance.</p><p>7. Uniformity is not always beneficial.</p><p><br></p><p><strong><em><u>Mẹo học nhanh:</u></em></strong></p><p>GEN (gender) ÁC (Acknowledging ) MA (Man) của ANH LONG (A long) LÀ (labels) ẤT (Attempting) Ơ (Uniformity)</p>' vs JSON '<p>1. Gender obscure achievements</p><p>2. Acknowledging achievement of a pioneer</p><p>3. Man unfairly credited</p><p>4. A long career showing exceptional ability</p><p>5. Labels can change perspective on people</p><p>6. Attempting to create a gender balance</p><p>7. Uniformity is not always beneficial</p><p><br></p><p><strong><em><u>Mẹo học nhanh:</u></em></strong></p><p>GEN (gender) ÁC (Acknowledging ) MA (Man) của ANH LONG (A long) LÀ (labels) ẤT (Attempting) Ơ (Uniformity)</p>'
- Value mismatch at data.questions.subQuestion[0].correctAnswer: DB 'Gender obscure achievements.' vs JSON 'Gender obscure achievements'
- Value mismatch at data.questions.subQuestion[1].correctAnswer: DB 'Acknowledging achievement of a pioneer.' vs JSON 'Acknowledging achievement of a pioneer'
- Value mismatch at data.questions.subQuestion[2].correctAnswer: DB 'Man unfairly credited.' vs JSON 'Man unfairly credited'
- Value mismatch at data.questions.subQuestion[3].correctAnswer: DB ' A long career showing exceptional ability.' vs JSON ' A long career showing exceptional ability'
- Value mismatch at data.questions.subQuestion[4].correctAnswer: DB 'Labels can change perspective on people.' vs JSON 'Labels can change perspective on people'
- Value mismatch at data.questions.subQuestion[5].correctAnswer: DB 'Attempting to create a gender balance.' vs JSON 'Attempting to create a gender balance'
- Value mismatch at data.questions.subQuestion[6].correctAnswer: DB 'Uniformity is not always beneficial.' vs JSON 'Uniformity is not always beneficial'

#### Document 697c759bfda7aa93bd8396e0
- Value mismatch at data.title: DB 'Mountain Submmits ( Phiên bản 3)' vs JSON 'Mountain Summits ( phiên bản 2) Cùng đáp án với các đề Mountain Submits'
- Value mismatch at data.questions.questionTitle: DB 'Mountain Submmits ( Phiên bản 3)' vs JSON 'Mountain Summits ( tp2-pre) v2'


### LISTENING Part 1

- ✅ Matched IDs: 12
- ❌ Only in DB (1): 677fcd1acdf0d2a9b1a1dc2a

**Content Differences:**

#### Document 695634bd0731243929b0c8ed
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 695639700731243929b0c902
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 69563db80731243929b0c917
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 695651040731243929b0c97f
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 695653de0731243929b0c994
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 6956576a0731243929b0c9a9
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 69565b1c0731243929b0c9be
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 69565e420731243929b0ca64
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 69567b620731243929b0cab7
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 69567e6c0731243929b0cacc
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 695682170731243929b0cae1
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 696fa2e05f30844cf4a950a3
- Type mismatch at timeToDo: DB type object vs JSON type string


### LISTENING Part 2

- ✅ Matched IDs: 12

**Content Differences:**

#### Document 69529f3317d3f9f552a546a3
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 695686530731243929b0ce90
- Type mismatch at timeToDo: DB type object vs JSON type string
- Value mismatch at questions[0].subQuestion[2].correctAnswer: DB 'Using less electricity
' vs JSON 'Using less electricity'
- Value mismatch at questions[0].subQuestion[3].correctAnswer: DB 'Using less water
' vs JSON 'Using less water'

#### Document 695687630731243929b0ce9f
- Type mismatch at timeToDo: DB type object vs JSON type string
- Value mismatch at questions[0].subQuestion[2].correctAnswer: DB 'It saves time
' vs JSON 'It saves time'
- Key present in JSON but not DB at questions[0].subSuggestion

#### Document 695688450731243929b0ceae
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 6956892b0731243929b0d147
- Type mismatch at timeToDo: DB type object vs JSON type string
- Value mismatch at questions[0].subQuestion[2].correctAnswer: DB 'climbing
' vs JSON 'climbing'

#### Document 6957c4aec88028aa29a1af7d
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 6957c58bc88028aa29a1b068
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 6957c62bc88028aa29a1b077
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 6957c6bbc88028aa29a1b086
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 6957c926c88028aa29a1b095
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 6957c9c0c88028aa29a1b0a4
- Value mismatch at title: DB 'Studying ( Phiên bản 1)' vs JSON 'Studying'
- Type mismatch at timeToDo: DB type object vs JSON type string
- Value mismatch at questions[0].questionTitle: DB 'Studying ( Phiên bản 1)' vs JSON 'Studying'

#### Document 6957ca55c88028aa29a1b0b3
- Type mismatch at timeToDo: DB type object vs JSON type string


### LISTENING Part 3

- ✅ Matched IDs: 12
- ❌ Only in DB (1): 677eaf2a826106165ca479c2
- ❌ Only in JSON (1): b2c3d4e5f6a1b2c3d4e5f6a0

**Content Differences:**

#### Document 6957cbcbc88028aa29a1b2c0
- Type mismatch at timeToDo: DB type object vs JSON type string
- Key present in JSON but not DB at questions[0].subSuggestion

#### Document 6957ccb3c88028aa29a1b3e4
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 6957cd96c88028aa29a1b3f3
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 6957ce41c88028aa29a1b402
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 6957d2efc88028aa29a1b7cc
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 6957d38dc88028aa29a1b7db
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 6957d526c88028aa29a1b992
- Type mismatch at timeToDo: DB type object vs JSON type string
- Key present in JSON but not DB at questions[0].subSuggestion

#### Document 6957d573c88028aa29a1b99e
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 6957d65ec88028aa29a1bc23
- Type mismatch at timeToDo: DB type object vs JSON type string
- Value mismatch at questions[0].subQuestion[2].correctAnswer: DB 'Womanw' vs JSON 'Woman'

#### Document 6957d6e2c88028aa29a1bc32
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 6957d77ac88028aa29a1bc41
- Type mismatch at timeToDo: DB type object vs JSON type string

#### Document 6957d80fc88028aa29a1bc50
- Type mismatch at timeToDo: DB type object vs JSON type string


### LISTENING Part 4

- ✅ Matched IDs: 25
- ❌ Only in DB (30): 69e8e9575e1769f65cd38e97, 69e8ea515e1769f65cd38ef4, 69e8eac45e1769f65cd38f19, 69e8eb905e1769f65cd38f8a, 69e8ebfa5e1769f65cd38fa3, 69e8ecce5e1769f65cd39003, 69e8ed255e1769f65cd39010, 69e8f0845e1769f65cd390d1, 69e8f7cf5e1769f65cd39193, 69e8f82e5e1769f65cd391af, 69e8f89e5e1769f65cd391d1, 69e8f8ea5e1769f65cd391f0, 69e8fa435e1769f65cd392bd, 69e8fae15e1769f65cd39328, 69e8fb415e1769f65cd39335, 69ea2fad94821544ed40fb61, 69ea30ce94821544ed40fbe1, 69ea313b94821544ed40fbee, 69ea321a94821544ed40fc0d, 69ea32a994821544ed40fc48, 69ea334394821544ed40fc75, 69ea334e94821544ed40fc8b, 69ea33fb94821544ed40fc9e, 69ea347894821544ed40fcba, 69ea379a94821544ed40fd5c, 69ea386c94821544ed40fde0, 69ea3cb494821544ed40fe4e, 69ea3f1494821544ed40feef, 69ea401494821544ed40ffa0, 69ea40a594821544ed40fff8

**Content Differences:**

#### Document 6957e8efc88028aa29a1cfa7
- Type mismatch at timeToDo: DB type object vs JSON type string
- Value mismatch at questions[0].questionTitle: DB 'A break from studying' vs JSON 'A break from studying (16-1)'
- Value mismatch at questions[0].content: DB 'Chọn đáp án đúng' vs JSON 'k có audio'
- Value mismatch at questions[0].file: DB 'https://files.aptisacademy.com.vn/listening/2026/04/1776871475953_24aaf6ea79218c44_1_study_break.mp3' vs JSON ''
- Value mismatch at questions[0].subQuestion[0].content: DB 'Why hasn't he gone to college?' vs JSON 'Why hasn't he gone to college?
'

#### Document 6957e94bc88028aa29a1cfb1
- Value mismatch at title: DB 'A book about a life of a scientist ( Phiên bản 1)' vs JSON 'A book about a life of a scientist'
- Type mismatch at timeToDo: DB type object vs JSON type string
- Value mismatch at questions[0].questionTitle: DB 'A book about a life of a scientist ( Phiên bản 1)' vs JSON 'A book about a life of a scientist'
- Value mismatch at questions[0].content: DB 'Chọn đáp án đúng' vs JSON 'Không có audio, học viên học thuộc đáp án'
- Value mismatch at questions[0].file: DB 'https://files.aptisacademy.com.vn/listening/2026/04/1776871618923_dc2e791eeae8f1bd_2_scientist_biography_verson1.mp3' vs JSON ''

#### Document 6957e9b2c88028aa29a1cfbb
- Value mismatch at title: DB 'The sport (Phiên bản 1)' vs JSON 'The sport'
- Type mismatch at timeToDo: DB type object vs JSON type string
- Value mismatch at questions[0].questionTitle: DB 'The sport (Phiên bản 1)' vs JSON 'The sport (16.2)'
- Value mismatch at questions[0].content: DB 'Chọn đáp án đúng' vs JSON 'Bài văn này không có audio (học thuộc đáp án).'
- Value mismatch at questions[0].file: DB 'https://files.aptisacademy.com.vn/listening/2026/04/1776871889188_1b1ae61eeec6ff84_4_the_sport_verson1.mp3' vs JSON ''

#### Document 6957ea28c88028aa29a1cfc5
- Value mismatch at title: DB 'Television series (Phiên bản 1)' vs JSON 'Television series'
- Type mismatch at timeToDo: DB type object vs JSON type string
- Value mismatch at questions[0].questionTitle: DB 'Television series (Phiên bản 1)' vs JSON 'Television series (17.2)'
- Value mismatch at questions[0].content: DB 'Chọn đáp án đúng' vs JSON 'Bài văn này không có audio (học thuộc đáp án).'
- Value mismatch at questions[0].file: DB 'https://files.aptisacademy.com.vn/listening/2026/04/1776872199869_24d463f0627ee470_7_television_series_verson1.mp3' vs JSON ''

#### Document 6957ea81c88028aa29a1cfcf
- Value mismatch at title: DB 'Advertising and sponsoring ( Phiên bản 1)' vs JSON 'Advertising and sponsoring'
- Type mismatch at timeToDo: DB type object vs JSON type string
- Value mismatch at questions[0].questionTitle: DB 'Advertising and sponsoring ( Phiên bản 1)' vs JSON 'Advertising and sponsoring (16.3)'
- Value mismatch at questions[0].content: DB 'Chọn đáp án đúng' vs JSON 'Bài văn này không có audio (học thuộc đáp án).'
- Value mismatch at questions[0].file: DB 'https://files.aptisacademy.com.vn/listening/2026/04/1776872528247_362cc4289733c712_10_advertising_sponsoring_verson1.mp3' vs JSON ''

#### Document 6957ec69c88028aa29a1d159
- Type mismatch at timeToDo: DB type object vs JSON type string
- Value mismatch at questions[0].questionTitle: DB 'Famous writers' vs JSON 'Famous writers (17.3)'
- Value mismatch at questions[0].content: DB 'Chọn đáp án đúng' vs JSON 'Bài văn này không có audio (học thuộc đáp án).'
- Value mismatch at questions[0].file: DB 'https://files.aptisacademy.com.vn/listening/2026/04/1776873302532_12a380cf3f1c2516_13_famous_writers.mp3' vs JSON ''

#### Document 6957ecbec88028aa29a1d163
- Value mismatch at title: DB 'Regional development plan ( Phiên bản 1)' vs JSON 'A regional development plan'
- Type mismatch at timeToDo: DB type object vs JSON type string
- Value mismatch at questions[0].questionTitle: DB 'Regional development plan ( Phiên bản 1)' vs JSON 'A regional development plan (16.4)'
- Value mismatch at questions[0].content: DB 'Chọn đáp án đúng' vs JSON 'Bài văn này không có audio (học thuộc đáp án).'
- Value mismatch at questions[0].file: DB 'https://files.aptisacademy.com.vn/listening/2026/04/1776873437862_0a7efbfe938e8ed0_14_regional_development_plan_verson1.mp3' vs JSON ''

#### Document 6957ed0fc88028aa29a1d16d
- Type mismatch at timeToDo: DB type object vs JSON type string
- Value mismatch at questions[0].questionTitle: DB 'Life after university' vs JSON 'Life after university (17.4)'
- Value mismatch at questions[0].content: DB 'Chọn đáp án đúng' vs JSON 'Bài văn này không có audio (học thuộc đáp án).'
- Value mismatch at questions[0].file: DB 'https://files.aptisacademy.com.vn/listening/2026/04/1776873686227_858d7e30594966f3_16_life_after_uni_verson1.mp3' vs JSON ''

#### Document 6957ed6ec88028aa29a1d177
- Type mismatch at timeToDo: DB type object vs JSON type string
- Value mismatch at questions[0].questionTitle: DB 'Security cameras' vs JSON 'Security cameras (16.5)'
- Value mismatch at questions[0].content: DB 'Chọn đáp án đúng' vs JSON 'Bài văn này không có audio (học thuộc đáp án).'
- Value mismatch at questions[0].file: DB 'https://files.aptisacademy.com.vn/listening/2026/04/1776875324253_892833f852339dfe_17_security_cameras.mp3' vs JSON ''

#### Document 6957edb6c88028aa29a1d181
- Type mismatch at timeToDo: DB type object vs JSON type string
- Value mismatch at questions[0].questionTitle: DB 'A new novel of a famous writer' vs JSON 'A new novel of a famous writer (17.5)'
- Value mismatch at questions[0].content: DB 'Chọn đáp án đúng' vs JSON 'Bài văn này không có audio (học thuộc đáp án).'
- Value mismatch at questions[0].file: DB 'https://files.aptisacademy.com.vn/listening/2026/04/1776875386057_6b3be554c7170d3c_18_new_novel.mp3' vs JSON ''

#### Document 6957edf5c88028aa29a1d18b
- Type mismatch at timeToDo: DB type object vs JSON type string
- Value mismatch at questions[0].questionTitle: DB 'A musician's life' vs JSON 'A musician's life (16.6)'
- Value mismatch at questions[0].content: DB 'Chọn đáp án đúng' vs JSON 'Bài văn này không có audio (học thuộc đáp án).'
- Value mismatch at questions[0].file: DB 'https://files.aptisacademy.com.vn/listening/2026/04/1776875864467_87764cbcf95ab1c8_23_musician_life.mp3' vs JSON ''

#### Document 6957ee3bc88028aa29a1d195
- Type mismatch at timeToDo: DB type object vs JSON type string
- Value mismatch at questions[0].questionTitle: DB 'A new guide' vs JSON 'A new guide (17.6)'
- Value mismatch at questions[0].content: DB 'Chọn đáp án đúng' vs JSON 'Bài văn này không có audio (học thuộc đáp án).'
- Value mismatch at questions[0].file: DB 'https://files.aptisacademy.com.vn/listening/2026/04/1776875941489_69d726bdf014871a_24_new_guide.mp3' vs JSON ''

#### Document 6957ee83c88028aa29a1d19f
- Type mismatch at timeToDo: DB type object vs JSON type string
- Value mismatch at questions[0].questionTitle: DB 'A research into happiness' vs JSON 'A research into happiness (16.7)'
- Value mismatch at questions[0].content: DB 'Chọn đáp án đúng' vs JSON 'Bài văn này không có audio (học thuộc đáp án).'
- Value mismatch at questions[0].file: DB 'https://files.aptisacademy.com.vn/listening/2026/04/1776875994737_a6079318bae2e9e3_25_research_appiness.mp3' vs JSON ''

#### Document 6957eed0c88028aa29a1d1a9
- Value mismatch at title: DB 'Criticism of the new novel (Phiên bản 1)' vs JSON 'Criticism of the new novel'
- Type mismatch at timeToDo: DB type object vs JSON type string
- Value mismatch at questions[0].questionTitle: DB 'Criticism of the new novel (Phiên bản 1)' vs JSON 'Criticism of the new novel (17.7)'
- Value mismatch at questions[0].content: DB 'Chọn đáp án đúng' vs JSON 'Bài văn này không có audio (học thuộc đáp án).'
- Value mismatch at questions[0].file: DB 'https://files.aptisacademy.com.vn/listening/2026/04/1776876155033_46f665d98fd5ca6a_27_criticism_new_novel_ver1.mp3' vs JSON ''

#### Document 6957ef19c88028aa29a1d1b3
- Type mismatch at timeToDo: DB type object vs JSON type string
- Value mismatch at questions[0].questionTitle: DB 'Writer's block' vs JSON 'Writer's block (16.8)'
- Value mismatch at questions[0].content: DB 'Chọn đáp án đúng' vs JSON 'Bài văn này không có audio (học thuộc đáp án).'
- Value mismatch at questions[0].file: DB 'https://files.aptisacademy.com.vn/listening/2026/04/1776876417997_fd8c823b0318badb_30_writer_block.mp3' vs JSON ''

#### Document 6957ef66c88028aa29a1d1bd
- Type mismatch at timeToDo: DB type object vs JSON type string
- Value mismatch at questions[0].questionTitle: DB 'Professionalism at work' vs JSON 'Professionalism at work (17.8)'
- Value mismatch at questions[0].content: DB 'Chọn đáp án đúng' vs JSON 'Bài văn này không có audio (học thuộc đáp án).'
- Value mismatch at questions[0].file: DB 'https://files.aptisacademy.com.vn/listening/2026/04/1776954257927_e39b8ebae693725e_audio_de8.mp3' vs JSON ''

#### Document 69c110d7e521b65aeedbe3fd
- Type mismatch at timeToDo: DB type object vs JSON type string
- Value mismatch at questions[0].content: DB 'Chọn đáp án đúng' vs JSON 'Không có audio, học viên học thuộc đáp án'
- Value mismatch at questions[0].file: DB 'https://files.aptisacademy.com.vn/listening/2026/04/1776954601527_68ec0a4dcbf81a20_32_making_plans.mp3' vs JSON ''

#### Document 69c11138e521b65aeedbe41f
- Value mismatch at title: DB 'A promotion campaign for a product ( Phiên bản 1)' vs JSON 'A promotion campaign for a product'
- Type mismatch at timeToDo: DB type object vs JSON type string
- Value mismatch at questions[0].questionTitle: DB 'A promotion campaign for a product ( Phiên bản 1)' vs JSON 'A promotion campaign for a product'
- Value mismatch at questions[0].content: DB 'Chọn đáp án đúng' vs JSON 'Không có audio, học viên học thuộc đáp án'
- Value mismatch at questions[0].file: DB 'https://files.aptisacademy.com.vn/listening/2026/04/1776955093303_a2b2253ce429eecb_33_promotion_product_ver1.mp3' vs JSON ''

#### Document 69c111a3e521b65aeedbe449
- Value mismatch at title: DB 'Script production (Phiên bản 1)' vs JSON 'Script production'
- Type mismatch at timeToDo: DB type object vs JSON type string
- Value mismatch at questions[0].questionTitle: DB 'Script production (Phiên bản 1)' vs JSON 'Script production'
- Value mismatch at questions[0].content: DB 'Chọn đáp án đúng' vs JSON 'Không có audio, học viên học thuộc đáp án'
- Value mismatch at questions[0].file: DB 'https://files.aptisacademy.com.vn/listening/2026/04/1776955452084_2ddb1e4076a42c36_35_script_production_ver1.mp3' vs JSON ''

#### Document 69c111e5e521b65aeedbe46b
- Type mismatch at timeToDo: DB type object vs JSON type string
- Value mismatch at questions[0].content: DB 'Chọn đáp án đúng' vs JSON 'Không có audio, học viên học thuộc đáp án'
- Value mismatch at questions[0].file: DB 'https://files.aptisacademy.com.vn/listening/2026/04/1776956626288_f323cdc1e198e46a_43_a_new_restaurant.mp3' vs JSON ''

#### Document 69c11227e521b65aeedbe484
- Type mismatch at timeToDo: DB type object vs JSON type string
- Value mismatch at questions[0].content: DB 'Chọn đáp án đúng' vs JSON 'Không có audio, học viên học thuộc đáp án'
- Value mismatch at questions[0].file: DB 'https://files.aptisacademy.com.vn/listening/2026/04/1776956792533_8e640c1c23d986db_44_work_from_home.mp3' vs JSON ''

#### Document 69c11275e521b65aeedbe49d
- Value mismatch at title: DB 'Managing financial spending (Phiên bản 1)' vs JSON 'Managing financial spending'
- Type mismatch at timeToDo: DB type object vs JSON type string
- Value mismatch at questions[0].questionTitle: DB 'Managing financial spending (Phiên bản 1)' vs JSON 'Managing financial spending'
- Value mismatch at questions[0].content: DB 'Chọn đáp án đúng' vs JSON 'Không có audio, học viên học thuộc đáp án'
- Value mismatch at questions[0].file: DB 'https://files.aptisacademy.com.vn/listening/2026/04/1776956907181_c402dca5113b08bd_45_managing_financial_spending_ver1.mp3' vs JSON ''

#### Document 69c112c7e521b65aeedbe4b6
- Value mismatch at title: DB 'The importance of sleep (Phiên bản 1)' vs JSON 'The importance of sleep'
- Type mismatch at timeToDo: DB type object vs JSON type string
- Value mismatch at questions[0].questionTitle: DB 'The importance of sleep (Phiên bản 1)' vs JSON 'The importance of sleep'
- Value mismatch at questions[0].content: DB 'Chọn đáp án đúng' vs JSON 'Không có audio, học viên học thuộc đáp án'
- Value mismatch at questions[0].file: DB 'https://files.aptisacademy.com.vn/listening/2026/04/1776958449474_ef2808a72bf4ecea_48_importance_sleep_ver1.mp3' vs JSON ''

#### Document 69c113a6e521b65aeedbe4f4
- Type mismatch at timeToDo: DB type object vs JSON type string
- Value mismatch at questions[0].content: DB 'Chọn đáp án đúng' vs JSON 'Không có audio, học viên học thuộc đáp án'
- Value mismatch at questions[0].file: DB 'https://files.aptisacademy.com.vn/listening/2026/04/1776959317261_648d051542f4f6b8_51_nutritionist.mp3' vs JSON ''

#### Document 69c113ffe521b65aeedbe51e
- Type mismatch at timeToDo: DB type object vs JSON type string
- Value mismatch at questions[0].content: DB 'Chọn đáp án đúng' vs JSON 'Không có audio, học viên học thuộc đáp án'
- Value mismatch at questions[0].file: DB 'https://files.aptisacademy.com.vn/listening/2026/04/1776959414481_938857bfc36c7ab5_52_cycling_expedition.mp3' vs JSON ''


### WRITING Part 1

- ✅ Matched IDs: 34

**Content Differences:** None ✅


### WRITING Part 2

- ✅ Matched IDs: 42
- ❌ Only in DB (2): 69c14deec68879da1b92b7b2, 69c15509c68879da1b92bcbb

**Content Differences:** None ✅


### WRITING Part 3

- ✅ Matched IDs: 46
- ❌ Only in DB (1): 69c15568c68879da1b92bcc3

**Content Differences:** None ✅


### WRITING Part 4

- ✅ Matched IDs: 48
- ❌ Only in DB (1): 69c15641c68879da1b92bd0b

**Content Differences:** None ✅
