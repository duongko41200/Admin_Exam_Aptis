import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RES_DATA, SPACE_BANK } from "../../../../../Constant/global";
import {
  SET_ATTEMPTED_QUESTION,
  SET_RESPONSE_RESULT_WRITING,
} from "../../../../../store/feature/testBank";
import TextareaInput from "../../../../components/TextareaAutosize/TextareaAutosize";
import "../../Reading/ExamReading.css";

const TITLE = 0;
const BODY = 1;
const FOOT_FISH = 2;
const EMAIL_INFOMAL = 0;
const EMAIL_FORMAL = 1;

const PART_FOUR = 4;

const WritingPartFour = () => {
  const testBankData = useSelector((state) => state.testBankStore.testBankData);

  const [resWritingPartOne, setResWritingPartOne] = useState();
  const [contentPartOne, setContentPartOne] = useState();
  const dispatch = useDispatch();
  const [subTitle, setSubTitle] = useState(null);
  const [result1, setResult1] = useState([]);
  const [result2, setResult2] = useState([]);

  const debounce = (func, wait) => {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const handleChangeTextarea = useCallback(
    debounce((e, index) => {
      const value = e.target.value;

      console.log({ index });

      const inputWords = value
        .toLowerCase()
        .split(/\s+/)
        .filter((word) => word.length > 0);

      dispatch(SET_RESPONSE_RESULT_WRITING({ part: PART_FOUR, index, value }));
      dispatch(
        SET_ATTEMPTED_QUESTION({
          part: index + 1,
          numberQuestion: 4,
          currentExamPart: "writing",
        })
      );

      if (index === EMAIL_INFOMAL) {
        setResult1(inputWords);
      }
      if (index === EMAIL_FORMAL) {
        setResult2(inputWords);
      }
    }, 300),
    []
  );

  useEffect(() => {
    const writingPartFour = testBankData.writing.part4[RES_DATA];
    setResWritingPartOne(writingPartFour?.questions[RES_DATA].subQuestion);
    setContentPartOne(writingPartFour?.questions[RES_DATA].content);
    setSubTitle(writingPartFour?.questions[RES_DATA].questionTitle);
  }, [testBankData]);

  // useEffect(() => {
  // 	const writingPartFour = testBankData.writing.part4[RES_DATA];
  // 	if (writingPartFour) {
  // 		const subQuestion =
  // 			writingPartFour.questions[RES_DATA].subQuestion;
  // 		const responseUser = subQuestion.map((item) => item.responseUser);
  // 		if (responseUser.length === 2) {
  // 			setResult1(
  // 				responseUser[0].split(/\s+/).filter((word) => word.length > 0)
  // 			);
  // 			setResult2(
  // 				responseUser[1].split(/\s+/).filter((word) => word.length > 0)
  // 			);
  // 		}
  // 	}
  // }, []);

  return (
    <div>
      <div className="lrn_stimulus_content lrn_clearfix lrn_question mb-5 flex flex-col gap-2">
        <div className="font-bold text-lg">{contentPartOne}</div>
        <div>{subTitle && subTitle.split(SPACE_BANK)[TITLE]}</div>
        <div>{subTitle && subTitle.split(SPACE_BANK)[BODY]}</div>
        <div>{subTitle && subTitle.split(SPACE_BANK)[FOOT_FISH]}</div>
      </div>
      <div className="lrn_response_innerbody lrn-response-validate-wrapper mt-10">
        <div className="lrn_response_input"></div>
        <div className="flex justify-start flex-col gap-4">
          {resWritingPartOne?.map((question, index) => (
            <div className="flex flex-col gap-2" key={index}>
              <div>
                <div className="text-md font-bold w-fit md:w-[500px]">
                  {question.content}
                </div>
              </div>
              <div>
                <TextareaInput>
                  <textarea
                    className="text-md text-bold font-normal w-full min-h-[200px] leading-normal p-3 rounded-xl rounded-br-none focus:shadow-outline-purple dark:focus:shadow-outline-purple focus:shadow-lg border border-solid border-slate-300 hover:border-slate-500 dark:hover:border-purple-500 focus:border-slate-500 dark:focus:border-purple-500 dark:border-slate-600 dark:bg-slate-900 text-bold dark:text-slate-300 focus-visible:outline-0 div-border p-[17px] bg-[#f8f8f8] font-sans placeholder:text-black placeholder:text-lg"
                    aria-label="empty textarea"
                    placeholder="Type your answer here"
                    onChange={(e) => handleChangeTextarea(e, index)}
                    defaultValue={question.responseUser}
                  />
                </TextareaInput>
                <div className="text-right p-2 font-medium">
                  Word: {index === 0 ? result1.length : result2.length}/
                  {index === 0 ? 75 : 225}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WritingPartFour;
