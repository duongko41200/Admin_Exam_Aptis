"use client";

import { useDispatch, useSelector } from "react-redux";
import ModalListSugestion from "..//Modal/ModalListSugestion.jsx";
import FooterTest from "../FooterTest/FooterTest.jsx";
import ModalAiScore from "../Modal/ModalAiScore.jsx";
import ModalCountDown from "../Modal/ModalCoutdown.jsx";
import ModalInfo from "../Modal/ModalInfo.jsx";
import ModalList from "../Modal/ModalList.jsx";
import ModalSetting from "../Modal/ModalSetting.jsx";

export default function FrameRoomExam({
  currentExamPart = null,
  finishRecording,
  isDisabled = false,
  isModalList = false,
  moveExamSkill,
  previousQuestion,
  typeZoom,
  nextQuestion,
  hours = 0,
  minutes = 0,
  seconds = 0,
  children = 0,
  startRecord,
  isShowModalAiScore = false,
  isSpeakingTaiLieu = false,
  isScreenTaiLieu = false,
  stopRecording,
}) {
  const dispatch = useDispatch();
  const currentPartName = useSelector(
    (state) => state.taiLieuStore.currentPartName
  );
  const currentSkillName = useSelector(
    (state) => state.taiLieuStore.currentSkillName
  );
  const { isShowFullQuestion } = useSelector((state) => state.taiLieuStore);
  const { isModalSetting } = useSelector((state) => state.generalStore);
  const { isModalListSugestion } = useSelector((state) => state.generalStore);
  const { isModalInfo } = useSelector((state) => state.generalStore);

  const { isRecord } = useSelector((state) => state.generalStore);

  const handleRecord = () => {
    if (!isRecord) {
      startRecord();
    } else {
      stopRecording();
    }
    dispatch(SET_IS_RECORD(!isRecord));
  };

  return (
    <>
      <div className=" h-full w-full  min-h-full ">
        {currentExamPart && currentExamPart !== "result" && (
          <div>
            <>
              <div
                className={`flex justify-end items-center p-4 h-[3.75rem] w-[calc(100%-3rem)] bg-white fixed z-10 `}
              >
                <div className="px-8">
                  <div className="text-[#161616] font-bold text-[20px] 2xl:text-2xl mt-1">
                    <span>{hours.toString().padStart(2, "0")}</span>:
                    <span>{minutes.toString().padStart(2, "0")}</span>:
                    <span>{seconds.toString().padStart(2, "0")}</span>
                  </div>
                  <div className="text-md 2xl:text-md font-sans font-medium">
                    Time remaining
                  </div>
                </div>
              </div>
            </>
          </div>
        )}

        {children}
        <ModalList open={isModalList} typeZoom={typeZoom} />
        <ModalListSugestion
          currentExamPart={currentExamPart}
          typeZoom={typeZoom}
        />
        <ModalSetting isSpeakingTaiLieu={isSpeakingTaiLieu} />
        <ModalInfo currentExamPart={currentExamPart} />

        {isShowModalAiScore && currentExamPart === "writing" && (
          <ModalAiScore />
        )}

        {(isModalSetting ||
          isModalList ||
          isModalListSugestion ||
          isModalInfo) &&
          isScreenTaiLieu && (
            <div className="absolute top-0 h-full w-full left-0 h-[calc(100%-0.675rem*3-3.75rem)] bg-white opacity-20  border border-[#f8f8f8]  rounded-md p-4 overflow-auto overflow-x-hidden z-10 md:hidden"></div>
          )}

        {/* <ButtonAiMobie>Ai</ButtonAiMobie> */}

        {/* ////////////////////////// FOOTER //////////////////////////
				////////////////////////// FOOTER ////////////////////////// */}

        <div
          className={`md:hidden cursor-pointer fixed ${
            isRecord ? "animate-pulse-border" : ""
          }  ${
            currentPartName === 2 || currentPartName === 3
              ? "bottom-[13rem]"
              : "bottom-[8rem]"
          } left-[50%]  transform -translate-x-1/2 translate-y-1/2 mt-4 ${
            !isRecord
              ? "bg-[#512da8] border-violet-900"
              : "bg-red-700 border-red-900"
          } text-white text-base rounded-full flex justify-center items-center h-[60px] w-[60px] border-2 disabled:bg-gray-300 disabled:opacity-50 disabled:text-gray-400 shadow-[0_0_20px_2px_#cbcdf4] ${
            isSpeakingTaiLieu &&
            (isShowFullQuestion || currentSkillName != "speaking")
              ? "hidden"
              : ""
          }`}
          onClick={handleRecord}
        >
          {!isRecord ? (
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-8 w-8"
              >
                <path d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
              </svg>
            </div>
          ) : (
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-8 w-8"
              >
                <path d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
              </svg>
            </div>
          )}
        </div>
        <button
          className={` md:hidden fixed bottom-[6rem] left-[0.675rem] w-[calc(100%-0.675rem*2)]  mt-4 bg-[#512da8] text-white text-base rounded-lg  h-[50px] hover:bg-[#673ab7] disabled:bg-gray-300 disabled:opacity-50 disabled:text-gray-400 shadow-[0_0_20px_2px_#cbcdf4] ${
            isSpeakingTaiLieu &&
            (currentPartName === 1 ||
              currentPartName === 4 ||
              isShowFullQuestion ||
              currentSkillName != "speaking")
              ? "hidden"
              : ""
          }`}
          onClick={finishRecording}
          disabled={!isDisabled}
        >
          Finish Recording
        </button>
        <FooterTest
          moveExamSkill={moveExamSkill}
          previousQuestion={previousQuestion}
          nextQuestion={nextQuestion}
          isDisabled={isDisabled}
          currentExamPart={currentExamPart}
          isSpeakingTaiLieu={isSpeakingTaiLieu}
        />
      </div>
    </>
  );
}
