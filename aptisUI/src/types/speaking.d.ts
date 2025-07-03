// interface SpeechRecognition extends EventTarget {
// 	lang: string;
// 	interimResults: boolean;
// 	maxAlternatives: number;
// 	start(): void;
// 	stop(): void;
// 	abort(): void;
// 	onsoundstart: (event: Event) => void;
// 	onsoundend: (event: Event) => void;
// 	onresult: (event: SpeechRecognitionEvent) => void;
// 	onnomatch: (event: Event) => void;
// 	onerror: (event: Event) => void;
// 	onstart: (event: Event) => void;
// 	onend: (event: Event) => void;
//   }
  
//   interface SpeechRecognitionEvent extends Event {
// 	results: SpeechRecognitionResultList;
//   }
  
//   interface SpeechRecognitionResultList {
// 	[index: number]: SpeechRecognitionResult;
// 	length: number;
//   }
  
//   interface SpeechRecognitionResult {
// 	[index: number]: SpeechRecognitionAlternative;
// 	isFinal: boolean;
//   }
  
//   interface SpeechRecognitionAlternative {
// 	transcript: string;
// 	confidence: number;
//   }
  
//   interface Window {
// 	SpeechRecognition: typeof SpeechRecognition;
// 	webkitSpeechRecognition: typeof SpeechRecognition;
//   }


  interface FileUpload {
    fieldname: string; // Tên trường trong form
    originalname: string; // Tên gốc của file khi upload
    encoding: string; // Kiểu mã hóa (thường là '7bit')
    mimetype: string; // Loại MIME của file (ví dụ: 'image/png')
    path: string; // Đường dẫn URL tới file trên Cloudinary hoặc server
    size: number; // Kích thước của file (tính bằng byte)
    filename: string; // Tên file khi lưu trên server hoặc Cloudinary
  }