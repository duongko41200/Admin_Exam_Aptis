import type { ResourceIF } from "@/types/general";
import Group from "@mui/icons-material/Group";

import { Dashboard, Description as DescriptionIcon } from "@mui/icons-material";
import {
  ListeningCreate,
  ListeningEdit,
  ListeningList,
  ListeningShow,
} from "../../pages/Listening";
import {
  ReadingCreate,
  ReadingEdit,
  ReadingList,
  ReadingShow,
} from "../../pages/Reading";
import {
  SpeakingCreate,
  SpeakingEdit,
  SpeakingList,
  SpeakingShow,
} from "../../pages/Speaking";
import {
  TestBankCreate,
  TestBankEdit,
  TestBankList,
  TestBankShow,
} from "../../pages/TestBanks";
import { UserCreate, UserEdit, UserList, UserShow } from "../../pages/Users";
import {
  WritingCreate,
  WritingEdit,
  WritingList,
  WritingShow,
} from "../../pages/Writing";

import {
  AssignmentCreate,
  AssignmentEdit,
  AssignmentList,
  AssignmentShow,
} from "../../pages/Assignment";
import {
  ClassRoomCreate,
  ClassRoomEdit,
  ClassRoomList,
  ClassRoomShow,
} from "../../pages/ClassRoom";
import {
  CourseCreate,
  CourseEdit,
  CourseList,
  CourseShow,
} from "../../pages/Course";
import { KeyDocumentList } from "../../pages/KeyDocuments";
import {
  LectureCreate,
  LectureEdit,
  LectureList,
  LectureShow,
} from "../../pages/Lectures";

const Resources: ResourceIF[] = [
  {
    list: UserList,
    edit: UserEdit,
    create: UserCreate,
    show: UserShow,
    icon: Group,
    resource: "users",
    label: "User",
  },
  {
    list: SpeakingList,
    edit: SpeakingEdit,
    create: SpeakingCreate,
    show: SpeakingShow,
    icon: Dashboard,
    resource: "speakings",
    label: "Speaking",
  },
  {
    list: ListeningList,
    edit: ListeningEdit,
    create: ListeningCreate,
    show: ListeningShow,
    icon: Dashboard,
    resource: "listenings",
    label: "Listening",
  },

  {
    list: ReadingList,
    edit: ReadingEdit,
    create: ReadingCreate,
    show: ReadingShow,
    icon: Dashboard,
    resource: "readings",
    label: "Reading",
  },
  {
    list: WritingList,
    edit: WritingEdit,
    create: WritingCreate,
    show: WritingShow,
    icon: Dashboard,
    resource: "writings",
    label: "Writings",
  },
  {
    list: TestBankList,
    edit: TestBankEdit,
    create: TestBankCreate,
    show: TestBankShow,
    icon: Dashboard,
    resource: "test-banks",
    label: "BỘ ĐỀ",
  },

  {
    list: CourseList,
    edit: CourseEdit,
    create: CourseCreate,
    show: CourseShow,
    icon: Dashboard,
    resource: "courses",
    label: "Khóa học",
  },

  {
    list: LectureList,
    edit: LectureEdit,
    create: LectureCreate,
    show: LectureShow,
    icon: Dashboard,
    resource: "lectures",
    label: "Tung bai hoc",
  },

  {
    list: AssignmentList,
    edit: AssignmentEdit,
    create: AssignmentCreate,
    show: AssignmentShow,
    icon: Dashboard,
    resource: "assignments",
    label: "Bài tập hàng ngày",
  },

  {
    list: ClassRoomList,
    edit: ClassRoomEdit,
    create: ClassRoomCreate,
    show: ClassRoomShow,
    icon: Dashboard,
    resource: "classrooms",
    label: "Lớp học",
  },
  {
    list: KeyDocumentList,
    edit: undefined,
    create: undefined,
    show: undefined,
    icon: DescriptionIcon,
    resource: "key-documents",
    label: "Tài liệu KEY",
  },
];

export default Resources;
