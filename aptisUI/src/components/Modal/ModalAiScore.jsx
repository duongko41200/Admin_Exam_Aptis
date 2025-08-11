import { SPACE_BANK } from "../../consts/global";
import { getAiCheckWriting, getAiCheckWriting_4 } from "../../services/AI/Gemini";
import { SET_AI_SCORE } from "../../store/general";
import { SET_RESPONSE_SCORE_AI } from "../../store/taiLieu";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ButtonCheckScore from "../ButtonCheckScore/ButtonCheckScore";
import LoadingDot from "../Loading/LoadingDot";
import MarkdownRenderer from "../MarkdownRenderer";

const BODY = 1;
const ModalAiScore = () => {
  const dispatch = useDispatch();
  const listening = useSelector((state) => state.taiLieuStore.listening);
  const currentNumberQuestion = useSelector(
    (state) => state.taiLieuStore.currentNumberQuestion
  );
  const currentPartName = useSelector(
    (state) => state.taiLieuStore.currentPartName
  );
  const [optionTaskPartFour, setOptionTaskParkFour] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [ResponseAI, setResponseAI] = useState(null);
  const [currentTask, setCurrentTask] = useState(0);

  const isAiScore = useSelector((state) => state.generalStore.isAiScore);
  const closeModelList = () => {
    dispatch(SET_AI_SCORE(false));
  };
  const checkAIScore = async () => {
    setIsLoading(true);

    console.log(
      "listening[currentNumberQuestion]?",
      listening[currentNumberQuestion]
    );
    try {
      let getAi = " ";

      if (currentPartName === 4) {
        getAi = await getAiCheckWriting_4({
          debai:
            listening[currentNumberQuestion]?.questionTitle.split(SPACE_BANK)[
              BODY
            ],
          cauhoi:
            listening[currentNumberQuestion]?.subQuestion[currentTask].content,
          traloi:
            listening[currentNumberQuestion]?.subQuestion[currentTask]
              .responseUser,
        });
      }

      if (currentPartName === 3) {
        const subQuestion = listening[currentNumberQuestion]?.subQuestion;
        let question = "";
        let answer = "";
        for (let i = 0; i < subQuestion.length; i++) {
          question = `${question}` + `${i + 1}.${subQuestion[i].content}`;
          answer =
            ` ${answer}` + ` ${i + 1}.${subQuestion[i]?.responseUser || ""}`;
        }

        console.log("question", question);
        console.log("answer", answer);

        getAi = await getAiCheckWriting({
          debai: listening[currentNumberQuestion]?.content + question,
          content: answer,
        });
      }

      // const callAI = convertResponseAi(getAi);
      // let data = [];
      // for (const key in callAI) {
      //   data.push(callAI[key]);
      // }
      //   let testDataClone = structuredClone(testBankData);
      //   let resultInIndexedDBClone = structuredClone(resultInIndexedDB);
      //   testDataClone.writing.part4[RES_DATA].questions[RES_DATA].subQuestion[
      // 	currentTask
      //   ].responseAI = getAi;
      //   resultInIndexedDBClone.data = testDataClone;
      //   updateObjectInDB(resultInIndexedDBClone);
      //   dispatch(SET_TESTBANK_DATA_RESULT(testDataClone));

      setResponseAI(getAi);

      dispatch(SET_RESPONSE_SCORE_AI({ index: currentTask, value: getAi }));
      setIsLoading(false);
    } catch (error) {
      console.log({ error });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (
      listening[currentNumberQuestion]["subQuestion"][currentTask].responseAI
    ) {
      const getResponseAI =
        listening[currentNumberQuestion]["subQuestion"][currentTask].responseAI;

      setResponseAI(getResponseAI);

      return;
    }
    setResponseAI(null);
  }, [currentTask, currentNumberQuestion]);

  useEffect(() => {
    console.log("currentSkillName sdfsd", currentPartName);
    if (currentPartName === 4) {
      setOptionTaskParkFour([
        { id: 1, name: "Task 1", isActive: true },
        { id: 2, name: "Task 2", isActive: false },
      ]);
    }
  }, []);

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
  };
  return (
    <div>
      {isAiScore && (
        <div>
          <div className="fixed top-[0.675rem] left-[0.675rem] w-[calc(100%-2rem)] md:w-[25rem] h-[calc(100%-0.675rem*3-3.75rem)] bg-white border border-[#f8f8f8] shadow-[0_0_20px_2px_var(--primary-100,_#cbcdf4)] rounded-md p-4 overflow-auto overflow-x-hidden z-50">
            <div className="w-full mb-[2rem] h-[45px] flex justify-between items-center">
              <div className="text-lg font-medium text-[#161616]">
                Chấm điểm với AI - {currentTask + 1}
              </div>
              <div
                className="w-[50px] h-[50px] border border-[#0000001f] flex justify-center items-center rounded-[6px] cursor-pointer hover:bg-[#f4f4f5]"
                onClick={closeModelList}
              >
                <div className="text-xl font-medium">X</div>
              </div>
            </div>
            <div className="w-full mb-[1rem] h-[calc(100%-0.675rem*3-3.75rem)] flex flex-col items-center border border-[#e5e5e5] rounded-[6px]">
              {isLoading ? (
                <LoadingDot />
              ) : (
                <div className="w-full px-2">
                  <div className="h-[50px] flex border-b-2 gap-2 items-center  w-full  rounded-md">
                    {optionTaskPartFour &&
                      optionTaskPartFour.length > 0 &&
                      optionTaskPartFour.map((item, index) => {
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
                  {!ResponseAI && (
                    <ButtonCheckScore checkAIScore={checkAIScore} />
                  )}
                  <div className=" h-full overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
                    {ResponseAI && (
                      <div className="flex flex-col gap-4 mt-2 py-2">
                        <div className="h-[60px] w-full shadow-[3px 3px 4px 0px rgba(0, 0, 0, 0.2)] border flex justify-center items-center bg-green-100 border-[#007A7A] text-[#007A7A] font-bold text-lg rounded-md">
                          <div onClick={checkAIScore}>
                            Đánh giá chi tiết từ AI
                          </div>
                        </div>
                      </div>
                    )}

                    {ResponseAI !== "" && (
                      <MarkdownRenderer>{ResponseAI}</MarkdownRenderer>
                    )}

                    {/* {ResponseAI !== "" &&
                      ResponseAI &&
                      ResponseAI.map((item, index) => {
                        return (
                          <div
                            key={index}
                            className="flex flex-col min-h-[100px]  w-full h-fit   bg-[#FAFAFA] flex flex-col py-2  font-semibold text-lg rounded-md"
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
                      })} */}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModalAiScore;
