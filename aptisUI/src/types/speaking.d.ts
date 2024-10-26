interface SpeechRecognition extends EventTarget {
	lang: string;
	interimResults: boolean;
	maxAlternatives: number;
	start(): void;
	stop(): void;
	abort(): void;
	onsoundstart: (event: Event) => void;
	onsoundend: (event: Event) => void;
	onresult: (event: SpeechRecognitionEvent) => void;
	onnomatch: (event: Event) => void;
	onerror: (event: Event) => void;
	onstart: (event: Event) => void;
	onend: (event: Event) => void;
  }
  
  interface SpeechRecognitionEvent extends Event {
	results: SpeechRecognitionResultList;
  }
  
  interface SpeechRecognitionResultList {
	[index: number]: SpeechRecognitionResult;
	length: number;
  }
  
  interface SpeechRecognitionResult {
	[index: number]: SpeechRecognitionAlternative;
	isFinal: boolean;
  }
  
  interface SpeechRecognitionAlternative {
	transcript: string;
	confidence: number;
  }
  
  interface Window {
	SpeechRecognition: typeof SpeechRecognition;
	webkitSpeechRecognition: typeof SpeechRecognition;
  }