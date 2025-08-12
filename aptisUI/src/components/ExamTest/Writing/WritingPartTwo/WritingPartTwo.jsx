import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RES_DATA } from "../../../../../Constant/global";
import {
  SET_ATTEMPTED_QUESTION,
  SET_RESPONSE_RESULT_WRITING,
} from "../../../../../store/feature/testBank";
import TextareaInput from "../../../../components/TextareaAutosize/TextareaAutosize";
import "../../Reading/ExamReading.css";

const PART_TWO = 2;

const WritingPartTwo = () => {
  const testBankData = useSelector((state) => state.testBankStore.testBankData);
  const [result, setResult] = useState([]);

  const [resWritingPartOne, setResWritingPartOne] = useState();
  const [contentPartOne, setContentPartOne] = useState();
  const dispatch = useDispatch();

  const debounce = (func, wait) => {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };
  const handleChangeTextarea = useCallback(
    debounce((e) => {
      const value = e.target.value;

      const inputWords = value
        .toLowerCase()
        .split(/\s+/)
        .filter((word) => word.length > 0);

      setResult(inputWords);
      dispatch(
        SET_RESPONSE_RESULT_WRITING({ part: PART_TWO, index: 0, value })
      );
      dispatch(
        SET_ATTEMPTED_QUESTION({
          part: 1,
          numberQuestion: 2,
          currentExamPart: "writing",
        })
      );
    }, 500),
    []
  );

  useEffect(() => {
    const writingPartTwo = testBankData.writing.part2[RES_DATA];
    setResWritingPartOne(writingPartTwo?.questions[RES_DATA].subQuestion);
    setContentPartOne(writingPartTwo?.questions[RES_DATA].content);
  }, [testBankData]);

  return (
    <div>
      <div className="lrn_stimulus_content lrn_clearfix lrn_question mb-5">
        <b>{contentPartOne}</b>
      </div>
      <div className="lrn_response_innerbody lrn-response-validate-wrapper">
        <div className="lrn_response_input"></div>

        <div className="flex justify-start flex-col gap-6">
          <div>
            <div>
              <div>
                <div className="text-lg mb-1">
                  {resWritingPartOne && resWritingPartOne[0].content}
                </div>
              </div>
            </div>
            <div>
              <TextareaInput>
                <textarea
                  className=" text-md text-bold font-normal w-full min-h-[200px] leading-normal p-3 rounded-xl rounded-br-none  focus:shadow-outline-purple dark:focus:shadow-outline-purple focus:shadow-lg border border-solid border-slate-300 hover:border-slate-500 dark:hover:border-purple-500 focus:border-slate-500 dark:focus:border-purple-500 dark:border-slate-600 dark:bg-slate-900 text-bold dark:text-slate-300 focus-visible:outline-0 div-border p-[17px] bg-[#f8f8f8] font-sans placeholder:text-black placeholder:text-lg"
                  aria-label="empty textarea"
                  placeholder="Type your answer here"
                  onChange={handleChangeTextarea}
                  defaultValue={
                    resWritingPartOne && resWritingPartOne[0].responseUser
                  }
                />
              </TextareaInput>
              <div className="text-right p-3 font-medium">
                Word: {result.length}/45
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WritingPartTwo;
