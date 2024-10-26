import App from "../App";
import MainDash from "../pages/MainDash/MainDash";
import Analysis from "../pages/Analysis/Analysis";
import Review from "../pages/Review/Review";
import Speaking from "../pages/Speaking/Speaking";
import Settings from "../pages/Settings/Settings";
import Word from "../pages/Review/Word/Word";
import CheckList from "../pages/Review/CkeckList/CheckList";
import PenddingCheck from "../pages/Review/PenddingCheck/PenddingCheck";
import SignUp from "../pages/SignUp/SignUp";
import { createBrowserRouter } from "react-router-dom";
import SignIn from "../pages/Login/SignIn";
import AddWordSentence from "../pages/AddWordSentence/AddWordSentence";
import FormWord from "../pages/AddWordSentence/FormWord/FormWord";
import FormStep1 from "../pages/AddWordSentence/FormWord/FormStep1/FormStep1";
import FormStep2 from "../pages/AddWordSentence/FormWord/FormStep2/FormStep2";
import FormStep3 from "../pages/AddWordSentence/FormWord/FormStep3/FormStep3";
import RoomExam from "../pages/ExamTest/RoomExams";

const routes = [
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <MainDash /> },
      { path: "analysis", element: <Analysis /> },
      {
        path: "review/",
        element: <Review />,
        children: [
          { path: "", element: <Word /> },
          { path: "review/check", element: <CheckList /> },
          { path: "review/pendding", element: <PenddingCheck /> },
        ],
      },
      { path: "speaking", element: <Speaking /> },
      { path: "setting", element: <Settings /> },
    ],
  },

  {
    path: "/exam-test",
    element: <RoomExam />,
    // children: [
    // 	{ path: '', element: <MainDash /> },
    // 	{ path: 'analysis', element: <Analysis /> },
    // 	{
    // 		path: 'review/',
    // 		element: <Review />,
    // 		children: [
    // 			{ path: '', element: <Word /> },
    // 			{ path: 'review/check', element: <CheckList /> },
    // 			{ path: 'review/pendding', element: <PenddingCheck /> },
    // 		],
    // 	},
    // 	{ path: 'speaking', element: <Speaking /> },
    // 	{ path: 'setting', element: <Settings /> },
    // ],
  },
  { path: "/signup", element: <SignUp /> },
  { path: "/login", element: <SignIn /> },

  ////// feature ADD newm Word/Sentence
  {
    path: "/addElement",
    element: <AddWordSentence />,
  },

  {
    path: "/formWord",
    element: <FormWord />,
    children: [
      { path: "", element: <FormStep1 /> },
      { path: "/formWord/step1", element: <FormStep1 /> },
      { path: "/formWord/step2", element: <FormStep2 /> },
      { path: "/formWord/step3", element: <FormStep3 /> },
      {
        path: "review/",
        element: <Review />,
        children: [
          { path: "", element: <Word /> },
          { path: "review/check", element: <CheckList /> },
          { path: "review/pendding", element: <PenddingCheck /> },
        ],
      },
      { path: "speaking", element: <Speaking /> },
      { path: "setting", element: <Settings /> },
    ],
  },
];

const router = createBrowserRouter(routes);

export default router;
