import { POINT_REPLACE, RES_DATA } from "@/Constant/global";
import {
  SET_ATTEMPTED_QUESTION,
  SET_RESPONSE_RESULT_READING,
} from "@/store/feature/testBank";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Split from "react-split";
import "./ReadingPartFour.css";

const PART_FOUR = 4;

const ReadingPartFour = () => {
  const [contentPartFour, setContentPartFour] = useState();
  const [subQuestion, setSubQuestion] = useState([]);
  const [answerList, setAnswerList] = useState([]);
  const dispatch = useDispatch();

  const testBankData = useSelector((state) => state.testBankStore.testBankData);

  useEffect(() => {
    const readingPartFour = testBankData.reading.part4[RES_DATA].data;
    const content = readingPartFour?.questions?.content;
    const subQuestion = readingPartFour?.questions?.subQuestion;
    const answerList = readingPartFour?.questions?.answerList;

    setContentPartFour(content);
    setSubQuestion(subQuestion);
    setAnswerList(answerList);
  }, [testBankData]);

  const selectOption = (e, index) => {
    const value = e.target.value;

    dispatch(SET_RESPONSE_RESULT_READING({ part: PART_FOUR, index, value }));
    dispatch(
      SET_ATTEMPTED_QUESTION({
        numberQuestion: 4,
        currentExamPart: "reading",
      })
    );
  };

  const renderContent = () => {
    if (!contentPartFour) return null;
    return contentPartFour.split(POINT_REPLACE).map((part, index) => (
      <div
        key={index}
        className={`${index % 2 === 0 ? "" : "text-justify"} ${index === 1 ? "text-[24px]" : "text-[15px]"}`}
      >
        {index % 2 === 0 || index === 1 ? <strong>{part}</strong> : part}
      </div>
    ));
  };

  return (
    <div className="min-h-[200px] mb-16 rounded-[5px]">
      <Split className="split" minSize={200} sizes={[65, 35]}>
        <div className="left bg-dark-layer-1 h-fit flex flex-col justify-between p-2.5 overflow-y-auto gap-2">
          {renderContent()}
        </div>

        {/* cau hoi va tra loi  */}
        <div className="right flex flex-col h-full">
          {subQuestion.length > 0 &&
            subQuestion.map((item, index) => {
              return (
                <div className="flex p-[10px]" key={index}>
                  <div className="question-right p-1 col-8">
                    <div className="text-[14px]">{item.content}</div>
                  </div>

                  <div className="answer p-1 col-4">
                    <span data-lrn-template-response="">
                      <span className="lrn_combobox">
                        <select
                          aria-label="Response input area"
                          className="lrn-cloze-select lrn_cloze_response"
                          data-inputid="0"
                          onChange={(e) => {
                            selectOption(e, index);
                          }}
                          defaultValue={item.responseUser}
                        >
                          <option
                            role="option"
                            value=""
                            aria-label="Please select an option - "
                          ></option>
                          {answerList.length > 0 &&
                            answerList.map((answer, idx) => (
                              <option
                                key={idx}
                                role="option"
                                value={answer.content}
                              >
                                {answer.content}
                              </option>
                            ))}
                        </select>
                      </span>
                    </span>
                  </div>
                </div>
              );
            })}
        </div>
      </Split>
    </div>
  );
};

export default ReadingPartFour;
