import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RES_DATA } from "../../../../../Constant/global";
import {
  SET_ATTEMPTED_QUESTION,
  SET_RESPONSE_RESULT_WRITING,
} from "../../../../../store/feature/testBank";
import TextareaInput from "../../../../components/TextareaAutosize/TextareaAutosize";
import "../../Reading/ExamReading.css";

const QUESTON_FIRST = 0;
const QUESTON_SECOND = 1;
const QUESTON_THIRD = 2;
const PART_THREE = 3;

const WritingPartThree = () => {
  const testBankData = useSelector((state) => state.testBankStore.testBankData);

  const [resWritingPartOne, setResWritingPartOne] = useState();
  const [contentPartOne, setContentPartOne] = useState();
  const dispatch = useDispatch();

  const [result1, setResult1] = useState([]);
  const [result2, setResult2] = useState([]);
  const [result3, setResult3] = useState([]);

  const debounce = (func, wait) => {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };
  const handleChangeTextarea = useCallback(
    debounce((e, index) => {
      console.log("values text:", e.target.value);

      const value = e.target.value;

      const inputWords = value
        .toLowerCase()
        .split(/\s+/)
        .filter((word) => word.length > 0);

      dispatch(SET_RESPONSE_RESULT_WRITING({ part: PART_THREE, index, value }));

      dispatch(
        SET_ATTEMPTED_QUESTION({
          part: index + 1,
          numberQuestion: 3,
          currentExamPart: "writing",
        })
      );

      if (index === QUESTON_FIRST) setResult1(inputWords);
      if (index === QUESTON_SECOND) setResult2(inputWords);
      if (index === QUESTON_THIRD) setResult3(inputWords);
    }, 300),
    []
  );

  useEffect(() => {
    const writingPartThree = testBankData.writing.part3[RES_DATA];
    setResWritingPartOne(writingPartThree?.questions[RES_DATA].subQuestion);
    setContentPartOne(writingPartThree?.questions[RES_DATA].content);
  }, [testBankData]);

  return (
    <div>
      <div className="lrn_stimulus_content lrn_clearfix lrn_question mb-5">
        <b>{contentPartOne}</b>
      </div>
      <div className="lrn_response_innerbody lrn-response-validate-wrapper">
        <div className="lrn_response_input"></div>

        <div className="flex justify-start flex-col gap-4">
          {resWritingPartOne &&
            resWritingPartOne.map((item, index) => {
              return (
                <div className="flex flex-col gap-2" key={index}>
                  <div>
                    <div>
                      <div className="text-md font-bold w-fit md:w-[500px]">
                        {item.content}
                      </div>
                    </div>
                  </div>
                  <div>
                    <TextareaInput>
                      <textarea
                        className=" text-md text-bold font-normal w-full leading-normal p-3 rounded-xl rounded-br-none  focus:shadow-outline-purple dark:focus:shadow-outline-purple focus:shadow-lg border border-solid border-slate-300 hover:border-slate-500 dark:hover:border-purple-500 focus:border-slate-500 dark:focus:border-purple-500 dark:border-slate-600  dark:bg-slate-900 text-bold dark:text-slate-300 focus-visible:outline-0 div-border p-[17px] bg-[#f8f8f8] font-sans placeholder:text-black placeholder:text-lg"
                        aria-label="empty textarea"
                        placeholder="Type your answer here"
                        onChange={(e) => handleChangeTextarea(e, index)}
                        defaultValue={item.responseUser}
                      />
                    </TextareaInput>
                    <div className="text-right p-2 font-medium">
                      Word:
                      {index === 0
                        ? result1.length
                        : index === 1
                          ? result2.length
                          : result3.length}
                      /64
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default WritingPartThree;
