"use client";

import useIndexedDB from "@/app/hook/useIndexedDB";
import { getGeminiAiCheck } from "@/services/AI/Gemini";
import { SET_TESTBANK_DATA_RESULT } from "@/store/feature/testBank";
import { convertResponseAi } from "@/utils/convertResponseAi";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  INDEXED_DB_APTIS,
  INDEXED_DB_APTIS_STORE,
  RES_DATA,
  SPACE_BANK,
} from "../../../../../../Constant/global";
import ButtonCheckScore from "../../../../../components/ButtonCheckScore/ButtonCheckScore";
import FrameReadingResult from "../../../../../components/FrameReadingResult/FrameReadingResult";
import LoadingDot from "../../../../../components/Loading/LoadingDot";
import TextareaInput from "../../../../../components/TextareaAutosize/TextareaAutosize";

const TITLE = 0;
const BODY = 1;
const FOOT_FISH = 2;
export default function RenderPartFour() {
  const dispatch = useDispatch();
  const testBankData = useSelector((state) => state.testBankStore.testBankData);
  const resultInIndexedDB = useSelector(
    (state) => state.testBankStore.resultInIndexedDB
  );
  const { updateObjectInDB } = useIndexedDB(
    INDEXED_DB_APTIS,
    INDEXED_DB_APTIS_STORE,
    "id"
  );

  const [isLoading, setIsLoading] = useState(false);

  const [optionTaskPartFour, setOptionTaskParkFour] = useState([
    { id: 1, name: "Task 1", isActive: true },
    { id: 2, name: "Task 2", isActive: false },
  ]);

  const [resWritingPartFour, setResWritingPartFour] = useState();
  const [contentPartFour, setContentPartFour] = useState();
  const [subTitle, setSubTitle] = useState(null);
  const [ResponseAI, setResponseAI] = useState(null);
  const [currentTask, setCurrentTask] = useState(0);
  // const dispatch = useDispatch();

  const checkAIScore = async () => {
    setIsLoading(true);

    try {
      const getAi = await getGeminiAiCheck({
        debai: subTitle.split(SPACE_BANK)[BODY],
        cauhoi: resWritingPartFour[currentTask].content,
        traloi: resWritingPartFour[currentTask].responseUser,
      });

      const callAI = convertResponseAi(getAi);

      let data = [];

      for (const key in callAI) {
        data.push(callAI[key]);
      }

      let testDataClone = structuredClone(testBankData);
      let resultInIndexedDBClone = structuredClone(resultInIndexedDB);

      testDataClone.writing.part4[RES_DATA].questions[RES_DATA].subQuestion[
        currentTask
      ].responseAI = getAi;

      resultInIndexedDBClone.data = testDataClone;
      updateObjectInDB(resultInIndexedDBClone);
      dispatch(SET_TESTBANK_DATA_RESULT(testDataClone));
      setResponseAI(data);
      setIsLoading(false);
    } catch (error) {
      console.log({ error });
      setIsLoading(false);
    }
  };
  const changeTask = (id) => {
    const newOptionTaskPartFour = optionTaskPartFour.map((item) => {
      if (item.id === id + 1) {
        item = { ...item, isActive: true };
      } else {
        item = { ...item, isActive: false };
      }

      return item;
    });

    setOptionTaskParkFour(newOptionTaskPartFour);
    setCurrentTask(id);

    const responseAI =
      testBankData.writing.part4[RES_DATA].questions[RES_DATA].subQuestion[id]
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

  useEffect(() => {
    const writingPartFour = testBankData.writing.part4[RES_DATA];

    setResWritingPartFour(writingPartFour?.questions[RES_DATA].subQuestion);
    setContentPartFour(writingPartFour?.questions[RES_DATA].content);
    setSubTitle(writingPartFour?.questions[RES_DATA].questionTitle);

    const responseAI =
      testBankData.writing.part4[RES_DATA].questions[RES_DATA].subQuestion[0]
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
      {contentPartFour && (
        <FrameReadingResult percentage={50} detailPercentage={100}>
          <div>
            <div className="mb-5 flex flex-col gap-2">
              <div className="font-bold text-md">{contentPartFour}</div>
              <div>{subTitle && subTitle.split(SPACE_BANK)[TITLE]}</div>
              <div className="text-[15px]">
                {subTitle && subTitle.split(SPACE_BANK)[BODY]}
              </div>
              <div>{subTitle && subTitle.split(SPACE_BANK)[FOOT_FISH]}</div>
            </div>
            <div className=" mt-10">
              <div className="flex justify-start flex-col gap-4">
                {resWritingPartFour?.map((question, index) => (
                  <div className="flex flex-col gap-2" key={index}>
                    <div>
                      <div className="text-[0.9rem] font-bold w-fit md:w-[500px]">
                        {question.content}
                      </div>
                    </div>
                    <div>
                      <TextareaInput>
                        <textarea
                          className="text-md text-bold font-normal w-full min-h-[200px] leading-normal p-3 rounded-xl rounded-br-none focus:shadow-outline-purple dark:focus:shadow-outline-purple focus:shadow-lg border border-solid border-slate-300 hover:border-slate-500 dark:hover:border-purple-500 focus:border-slate-500 dark:focus:border-purple-500 dark:border-slate-600 dark:bg-slate-900 text-bold dark:text-slate-300 focus-visible:outline-0 box-border p-[17px] bg-[#f8f8f8] font-sans placeholder:text-black placeholder:text-lg"
                          aria-label="empty textarea"
                          placeholder="Type your answer here"
                          // onChange={(e) => handleChangeTextarea(e, index)}
                          defaultValue={question.responseUser}
                        />
                      </TextareaInput>
                      {/* <Box
									sx={{
										textAlign: 'end',
										padding: '10px',
										fontWeight: '500',
									}}
								>
									Word: {index === 0 ? result1.length : result2.length}/
									{index === 0 ? 75 : 225}
								</Box> */}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {isLoading ? (
            <LoadingDot />
          ) : (
            <div>
              <div className="h-[50px] flex border-b-2 gap-2 items-center  w-full px-2  rounded-md">
                {optionTaskPartFour.map((item, index) => {
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
              <div className="max-h-[400px] md:max-h-[460px] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
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
                        className="flex flex-col min-h-[100px]  w-full h-fit   bg-[#FAFAFA] flex flex-col p-2  font-semibold text-lg rounded-md"
                      >
                        <div className="border border-gray-200 rounded-xl px-2 bg-white">
                          {item.map((subItem, subIndex) => {
                            return (
                              <div
                                key={subIndex}
                                className="flex p-2 text-[14px] font-sans w-full "
                              >
                                {subItem.type === "fmt" && (
                                  <div className=" flex gap-2 w-fit ">
                                    <div className="text-xl min-w-[20px] text-[#007A7A] font-semibold rounded-full">
                                      +
                                    </div>

                                    <div className="text-[14px]  font-sans">
                                      {subItem.content}
                                    </div>
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
            </div>
          )}
        </FrameReadingResult>
      )}
    </>
  );
}
