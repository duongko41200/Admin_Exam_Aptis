"use client";

import LoadingDot from "@/app/components/Loading/LoadingDot";
import TextareaInput from "@/app/components/TextareaAutosize/TextareaAutosize";
import useIndexedDB from "@/app/hook/useIndexedDB";
import { getGeminiAiCheck } from "@/services/AI/Gemini";
import { convertResponseAi } from "@/utils/convertResponseAi";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  INDEXED_DB_APTIS,
  INDEXED_DB_APTIS_STORE,
  RES_DATA,
} from "../../../../../../Constant/global";
import ButtonCheckScore from "../../../../../components/ButtonCheckScore/ButtonCheckScore";
import FrameReadingResult from "../../../../../components/FrameReadingResult/FrameReadingResult";

export default function RenderPartThree() {
  const testBankData = useSelector((state) => state.testBankStore.testBankData);
  const resultInIndexedDB = useSelector(
    (state) => state.testBankStore.resultInIndexedDB
  );
  const { updateObjectInDB } = useIndexedDB(
    INDEXED_DB_APTIS,
    INDEXED_DB_APTIS_STORE,
    "id"
  );
  const [ResponseAI, setResponseAI] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [currentTask, setCurrentTask] = useState(0);

  const [resWritingPartThree, setResWritingPartThree] = useState();
  const [contentPartThree, setContentPartThree] = useState();

  const [optionTaskPartThree, setOptionTaskParkThree] = useState([
    { id: 1, name: "Task 1", isActive: true },
    { id: 2, name: "Task 2", isActive: false },
    { id: 3, name: "Task 3", isActive: false },
  ]);
  const changeTask = (id) => {
    const newoptionTaskPartThree = optionTaskPartThree.map((item) => {
      if (item.id === id + 1) {
        return { ...item, isActive: true };
      }
      return { ...item, isActive: false };
    });
    setOptionTaskParkThree(newoptionTaskPartThree);
    setCurrentTask(id);
    const responseAI =
      testBankData.writing.part3[RES_DATA].questions[RES_DATA].subQuestion[id]
        .responseAI;

    if (responseAI !== "") {
      const callAI = convertResponseAi(responseAI);

      let data = [];

      for (const key in callAI) {
        data.push(callAI[key]);
      }
      setResponseAI(data);
      return;
    }

    setResponseAI(null);
  };

  const checkAIScore = async () => {
    setIsLoading(true);

    try {
      const getAi = await getGeminiAiCheck();

      const callAI = convertResponseAi(getAi);

      let data = [];

      for (const key in callAI) {
        data.push(callAI[key]);
      }

      let testDataClone = structuredClone(testBankData);
      let resultInIndexedDBClone = structuredClone(resultInIndexedDB);

      console.log({ testDataClone });
      // testDataClone.writing.part4[RES_DATA].questions[RES_DATA].subQuestion[currentTask].responseAI = getAi;

      testDataClone.writing.part3[RES_DATA].questions[RES_DATA].subQuestion[
        currentTask
      ].responseAI = getAi;

      resultInIndexedDBClone.data = testDataClone;
      updateObjectInDB(resultInIndexedDBClone);
      setResponseAI(data);
      setIsLoading(false);
    } catch (error) {
      console.log({ error });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const writingPartThree = testBankData.writing.part3[RES_DATA];

    setResWritingPartThree(writingPartThree?.questions[RES_DATA].subQuestion);
    setContentPartThree(writingPartThree?.questions[RES_DATA].content);

    const responseAI =
      testBankData.writing.part3[RES_DATA].questions[RES_DATA].subQuestion[0]
        .responseAI;

    if (responseAI !== "") {
      const callAI = convertResponseAi(responseAI);

      let data = [];

      for (const key in callAI) {
        data.push(callAI[key]);
      }
      setResponseAI(data);
      return;
    }

    setResponseAI(null);
  }, []);
  return (
    <>
      {resWritingPartThree && resWritingPartThree.length > 0 && (
        <FrameReadingResult percentage={50}>
          <div>
            <div className="lrn_stimulus_content lrn_clearfix lrn_question mb-5">
              <b>{contentPartThree}</b>
            </div>
            <div className="lrn_response_innerbody lrn-response-validate-wrapper">
              <div className="lrn_response_input"></div>

              <div className="flex justify-start flex-col gap-4">
                {resWritingPartThree &&
                  resWritingPartThree.map((item, index) => {
                    return (
                      <div className="flex flex-col gap-2" key={index}>
                        <div>
                          <div className="text-[0.9rem] font-bold w-fit md:w-[500px]">
                            {item.content}
                          </div>
                        </div>
                        <div>
                          <TextareaInput>
                            <textarea
                              className=" text-md text-bold font-normal w-full leading-normal p-3 rounded-xl rounded-br-none  focus:shadow-outline-purple dark:focus:shadow-outline-purple focus:shadow-lg border border-solid border-slate-300 hover:border-slate-500 dark:hover:border-purple-500 focus:border-slate-500 dark:focus:border-purple-500 dark:border-slate-600  dark:bg-slate-900 text-bold dark:text-slate-300 focus-visible:outline-0 div-border p-[17px] bg-[#f8f8f8] font-sans placeholder:text-black placeholder:text-lg"
                              aria-label="empty textarea"
                              placeholder="Type your answer here"
                              defaultValue={item.responseUser}
                            />
                          </TextareaInput>
                          {/* <div
											sx={{
												textAlign: 'end',
												padding: '10px',
												fontWeight: '500',
											}}
										>
											Word:
											{index === 0
												? result1.length
												: index === 1
												? result2.length
												: result3.length}
											/64
										</div> */}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>

          {isLoading ? (
            <LoadingDot />
          ) : (
            <div>
              <div className="h-[50px] flex border-b-2 gap-2 items-center  w-full px-2  rounded-md">
                {optionTaskPartThree.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className={`border border-[#007A7A] w-fit px-2 py-1 shadow-sm rounded-lg shadow-[#007A7A] text-sm md:tex-md cursor-pointer font-bold hover:bg-[#007A7A] hover:text-white ${
                        item.isActive ? "bg-[#007A7A] text-white" : ""
                      }`}
                      onClick={() => changeTask(index)}
                    >
                      {item.name}
                    </div>
                  );
                })}
              </div>

              {!ResponseAI && <ButtonCheckScore checkAIScore={checkAIScore} />}

              {ResponseAI && (
                <div className="flex flex-col gap-4 mt-2 p-2">
                  <div className="h-[60px] w-full shadow-[3px 3px 4px 0px rgba(0, 0, 0, 0.2)] border flex justify-center items-center bg-[#007A7A] text-white font-bold text-lg rounded-md">
                    <div>Đánh giá chi tiết từ AI</div>
                  </div>
                </div>
              )}

              {ResponseAI !== "" &&
                ResponseAI &&
                ResponseAI.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className="flex flex-col min-h-[100px] w-full h-fit   bg-[#FAFAFA] flex flex-col p-2  font-semibold text-lg rounded-md"
                    >
                      <div className="border border-gray-200 rounded-xl px-2 bg-white">
                        {item.map((subItem, subIndex) => {
                          return (
                            <div
                              key={subIndex}
                              className="flex p-2 text-[14px] font-sans "
                            >
                              {subItem.type === "fmt" && (
                                <div className="text-[14px] font-sans">
                                  +{subItem.content}
                                </div>
                              )}
                              {subItem.type === "txt" && (
                                <div className="text-[14px] font-sans">
                                  Mình có góp ý nhỏ với:
                                  <span className="bg-[#E6F2F2] text-[#007A7A]  px-2 rounded-lg">
                                    {subItem.content}
                                  </span>
                                </div>
                              )}
                              {subItem.type === "exp" && (
                                <div className="text-[14px] font-sans font-semibold bg-gray-100 px-2 p-1 rounded-lg shsh leading-relaxed">
                                  {subItem.content}
                                </div>
                              )}
                              {subItem.type === "typ" && (
                                <div className="text-[14px] font-sans font-semibold bg-blue-100 px-2 rounded-lglg">
                                  {subItem.content}
                                </div>
                              )}
                              {subItem.type === "sgt" && (
                                <div className="text-[14px] font-sans ">
                                  Bạn có thể thay bằng:{" "}
                                  <span className="bg-[#E6F2F2] text-[#007A7A]  px-2 rounded-lg">
                                    {subItem.content}
                                  </span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </FrameReadingResult>
      )}
    </>
  );
}
