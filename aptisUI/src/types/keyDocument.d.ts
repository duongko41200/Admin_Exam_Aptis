export interface AnswerOption {
  id: string;
  content: string;
}

export interface SubQuestion {
  content: string;
  correctAnswer: string | null;
  file: string | null;
  answerList: AnswerOption[] | null;
  image: string | null;
  suggestion: string | null;
}

export interface Question {
  id: number;
  questionTitle: string;
  content: string;
  answerList: AnswerOption[];
  correctAnswer: string;
  file: string | null;
  subQuestionAnswerList: string[];
  suggestion: string | null;
  subQuestion: SubQuestion[];
  questionType: "LISTENING" | "READING" | "WRITING" | "SPEAKING";
  isExample: boolean;
  questionPart: "ONE" | "TWO" | "THREE" | "FOUR";
  image: string | null;
}

export interface KeyDocumentItem {
  id: number;
  title: string;
  timeToDo: number;
  questions: Question[];
}

export interface KeyDocumentData {
  totals: number;
  items: KeyDocumentItem[];
}

export interface KeyDocumentResponse {
  data: {
    code: number;
    data: KeyDocumentData;
  };
}

export interface FilterState {
  skill: "all" | "listening" | "reading" | "writing" | "speaking";
  part: "all" | "ONE" | "TWO" | "THREE" | "FOUR";
  search: string;
}

export interface TableQuestion {
  id: number;
  topic: string;
  question: string;
  answerOptions: string;
  correctAnswer: string;
  suggestion: string;
  audioFile?: string;
  skill: string;
  part: string;
}
