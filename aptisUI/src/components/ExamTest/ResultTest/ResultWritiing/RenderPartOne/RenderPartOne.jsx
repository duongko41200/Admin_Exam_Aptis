"use client";

import { getGeminiAiCheck } from "@/services/AI/Gemini";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RES_DATA } from "../../../../../../Constant/global";
import ButtonCheckScore from "../../../../../components/ButtonCheckScore/ButtonCheckScore";
import FrameReadingResult from "../../../../../components/FrameReadingResult/FrameReadingResult";

export default function RenderPartOne() {
  const testBankData = useSelector((state) => state.testBankStore.testBankData);

  const [resWritingPartOne, setResWritingPartOne] = useState();
  const [contentPartOne, setContentPartOne] = useState();

  const [optionTaskPartOne, setOptionTaskParkOne] = useState([
    { id: 1, name: "Task 1", isActive: true },
    { id: 2, name: "Task 2", isActive: false },
    { id: 3, name: "Task 3", isActive: false },
    { id: 4, name: "Task 4", isActive: false },
    { id: 5, name: "Task 5", isActive: false },
  ]);
  // const dispatch = useDispatch();
  const changeTask = (id) => {
    const newoptionTaskPartOne = optionTaskPartOne.map((item) => {
      if (item.id === id) {
        return { ...item, isActive: true };
      }
      return { ...item, isActive: false };
    });
    setOptionTaskParkOne(newoptionTaskPartOne);
  };
  const checkAIScore = async () => {
    try {
      const callAI = await getGeminiAiCheck();

      let data = [];

      console.log({ callAI });

      for (const key in callAI) {
        data.push(callAI[key]);
      }

      console.log({ data });
      // setResponseAI(data);
    } catch (error) {
      console.log({ error });
    }
  };

  useEffect(() => {
    const writingPartOne = testBankData.writing.part1[RES_DATA];

    setResWritingPartOne(writingPartOne.questions[RES_DATA].subQuestion);
    setContentPartOne(writingPartOne?.questions[RES_DATA].content);
  }, [testBankData]);
  return (
    <>
      {resWritingPartOne && resWritingPartOne.length > 0 && contentPartOne && (
        <FrameReadingResult percentage={50}>
          <div>
            <div className="lrn_stimulus_content lrn_clearfix lrn_question mb-5">
              <b>{contentPartOne}</b>
            </div>
            <div className="lrn_response_innerbody lrn-response-validate-wrapper">
              <div className="lrn_response_input"></div>

              <div className="flex justify-start flex-col gap-2">
                {resWritingPartOne &&
                  resWritingPartOne.map((item, index) => {
                    return (
                      <div key={index}>
                        <div>
                          <div>
                            <div className="mb-2">{item.content} </div>
                          </div>
                        </div>
                        <div>
                          <textarea
                            className=" text-[16px] text-bold font-normal w-full leading-normal  rounded-xl rounded-br-none  focus:shadow-outline-purple dark:focus:shadow-outline-purple focus:shadow-lg border border-solid border-slate-300 hover:border-slate-500 dark:hover:border-purple-500 focus:border-slate-500 dark:focus:border-purple-500 dark:border-slate-600  dark:bg-slate-900 text-bold dark:text-slate-300 focus-visible:outline-0 div-border p-[10px] bg-[#f8f8f8] font-sans placeholder:text-black placeholder:text-[14px]"
                            aria-label="empty textarea"
                            placeholder="Type your answer here"
                            defaultValue={item.responseUser}
                            disabled
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>

          <div>
            <div className="h-[50px] flex border-b-2 gap-2 items-center  w-full px-2  rounded-md">
              {optionTaskPartOne.map((item, index) => {
                return (
                  <div
                    key={index}
                    className={`border border-[#007A7A] w-fit px-2 py-1 shadow-sm rounded-lg shadow-[#007A7A] cursor-pointer text-sm md:tex-md font-bold hover:bg-[#007A7A] hover:text-white ${
                      item.isActive ? "bg-[#007A7A] text-white" : ""
                    }`}
                    onClick={() => changeTask(item.id)}
                  >
                    {item.name}
                  </div>
                );
              })}
            </div>
            <div>
              <ButtonCheckScore checkAIScore={checkAIScore} />
            </div>
          </div>
        </FrameReadingResult>
      )}
    </>
  );
}
