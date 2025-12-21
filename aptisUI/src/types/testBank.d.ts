// Types for TestBank system
export interface Question {
  questionTitle: string;
  questionPart?: string;
  [key: string]: any;
}

export interface SubQuestion {
  isActive?: boolean;
  responseUser?: string;
  [key: string]: any;
}

export interface ApiResponseItem {
  _id: string;
  title: string;
  timeToDo: string | number;
  questionPart: string;
  createdAt: string;
  updatedAt: string;
  questions?: Question[];
  data?: {
    title: string;
    timeToDo: string | number;
    questions: Question;
  };
}

export interface TestBankQuestion {
  _id: string;
  id: string;
  title: string;
  subTitle?: string;
  timeToDo: string | number;
  questionPart: string;
  createdAt: string;
  updatedAt: string;
  questions?: Question[];
}

export interface TestBankPartData {
  part1: number[];
  part2: number[];
  part3: number[];
  part4: number[];
}

export interface TestBankData {
  title: string;
  speaking: TestBankPartData;
  listening: TestBankPartData;
  reading: TestBankPartData & { part5: number[] };
  writing: TestBankPartData;
  classRoomId: string | number;
  status?: "free" | "premium";
}

export interface TestBankState {
  testBankData: TestBankData;
  wordObject?: Record<string, any>;
  typeText?: string;
  dataOfModalList?: any;
  resultInIndexedDB?: any;
}

export interface RootState {
  testBankStore: TestBankState;
}

export interface DataTableProps {
  rows: TestBankQuestion[];
  partSkill: number;
}

export interface SetTestBankDataPayload {
  type: "writing" | "reading" | "listening" | "speaking";
  newSelection: number[];
  partSkill: number;
}
