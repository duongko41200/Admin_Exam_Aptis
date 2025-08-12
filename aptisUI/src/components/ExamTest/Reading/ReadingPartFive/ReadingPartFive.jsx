import { POINT_REPLACE, RES_DATA } from "@/Constant/global";
import {
  SET_ATTEMPTED_QUESTION,
  SET_RESPONSE_RESULT_READING,
} from "@/store/feature/testBank";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./ReadingPartFive.css";

const PART_FIVE = 5;

const ReadingPartFive = () => {
  const [contentPartFour, setContentPartFour] = useState();
  const [subQuestion, setSubQuestion] = useState([]);
  const [answerList, setAnswerList] = useState([]);
  const dispatch = useDispatch();

  const testBankData = useSelector((state) => state.testBankStore.testBankData);

  useEffect(() => {
    const readingPartFive = testBankData.reading.part5[RES_DATA].data;
    const content = readingPartFive?.questions?.content;
    const subQuestion = readingPartFive?.questions?.subQuestion;
    const answerList = readingPartFive?.questions?.answerList;

    setContentPartFour(content);
    setSubQuestion(subQuestion);
    setAnswerList(answerList);
  }, [testBankData]);

  const selectOption = (e, index) => {
    const value = e.target.value;
    console.log({ value, index });

    dispatch(SET_RESPONSE_RESULT_READING({ part: PART_FIVE, index, value }));
    dispatch(
      SET_ATTEMPTED_QUESTION({
        numberQuestion: 5,
        currentExamPart: "reading",
      })
    );
  };

  const renderContent = () => {
    if (!contentPartFour) return null;
    return contentPartFour.split(POINT_REPLACE).map((part, index) => (
      <div
        key={index}
        className={`${index === 0 ? "" : "text-justify"} ${index === 1 ? "text-[24px]" : "text-[16px]"} leading-[2.7rem]`}
      >
        {index >
          (contentPartFour.split(POINT_REPLACE)[1] === "null" ? 0 : 1) && (
          <div className="answer p-1 col-4 w-[200px]">
            <span data-lrn-template-response="">
              <span className="lrn_combobox">
                <select
                  aria-label="Response input area"
                  className="lrn-cloze-select lrn_cloze_response"
                  data-inputid="0"
                  onChange={(e) =>
                    selectOption(
                      e,
                      index -
                        (contentPartFour.split(POINT_REPLACE)[1] === "null"
                          ? 1
                          : 2)
                    )
                  }
                  defaultValue={
                    subQuestion.length > 0 &&
                    subQuestion[
                      index -
                        (contentPartFour.split(POINT_REPLACE)[1] === "null"
                          ? 1
                          : 2)
                    ]?.responseUser
                  }
                >
                  <option
                    role="option"
                    value=""
                    aria-label="Please select an option - "
                  ></option>
                  {answerList.length > 0 &&
                    answerList.map((answer, idx) => (
                      <option key={idx} role="option" value={answer.content}>
                        {answer.content}
                      </option>
                    ))}
                </select>
              </span>
            </span>
          </div>
        )}
        {index === 1 || index === 0 ? <strong>{part}</strong> : part}
      </div>
    ));
  };
  return (
    <>
      <div className="min-h-[200px] mb-16 rounded-[5px]">
        <div className="left bg-dark-layer-1 h-fit flex flex-col justify-between gap-3">
          {renderContent()}
        </div>
      </div>
    </>
  );
};

export default ReadingPartFive;
