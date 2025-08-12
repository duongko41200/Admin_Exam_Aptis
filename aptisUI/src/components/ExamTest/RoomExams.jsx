"use client";

import { useEffect, useRef, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { timecountSpeaking } from "../../../Constant/speaking.js";
import dataSimpleTest from "../../../data/sampleTest.json";
import {
  SET_DATA_OF_MODAL_LIST,
  SET_TESTBANK_DATA,
} from "../../../store/feature/testBank.js";
import { SET_MOVE_EXAM_SKILL } from "../../../store/general.js";
import FrameRoomExam from "../../components/FrameRoomExam/index.jsx";
import BasicModal from "../../components/Modal/ModalBasic.jsx";
import useAudioRecorder from "../../hook/useAudioRecorder.js";
import ExamListening from "./Listening/ExamListening.jsx";
import ExamReading from "./Reading/ExamReading.jsx";
import ResultTest from "./ResultTest/ResultTest.jsx";
import "./RoomExam.css";
import ExamSpeaking from "./Speaking/ExamSpeaking.jsx";
import ExamWriting from "./Writing/ExamWriting.jsx";

const RoomExam = () => {
  const {
    testBankData,
    currentExamPart,
    numberQuestion,
    numberQuestionWriting,
    numberQuestionSpeaking,
    numberQuestionEachPart,
    numberQuestionEachPartListening,
    numberQuestionListening,
    isModalList,
    isCountdown,
  } = useSelector(
    (state) => ({
      testBankData: state.testBankStore.testBankData,
      currentExamPart: state.generalStore.currentExamPart,
      numberQuestion: state.readingStore.numberQuestion,
      numberQuestionWriting: state.writingStore.numberQuestion,
      numberQuestionSpeaking: state.speakingStore.numberQuestion,
      numberQuestionEachPart: state.speakingStore.numberQuestionEachPart,
      numberQuestionEachPartListening:
        state.listeningStore.numberQuestionEachPart,
      numberQuestionListening: state.listeningStore.numberQuestion,
      isModalList: state.generalStore.isModalList,
      isCountdown: state.generalStore.isCountdown,
    }),
    shallowEqual
  );

  const dispatch = useDispatch();

  /////////// ABOVE REDUX //////////

  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [isPauseCountTime, setIsPauseCountTime] = useState(false);

  const audioRef = useRef(null);
  const audioBeepRef = useRef(null);

  const { startRecording, stopRecording } = useAudioRecorder();

  useEffect(() => {
    if (currentExamPart === "writing") {
      setMinutes(50);
      setTimeLeft(50 * 60);
      dispatch(
        SET_DATA_OF_MODAL_LIST({
          testBankData: testBankData,
          currentExamPart: currentExamPart,
          currentQuestion: numberQuestionWriting,
        })
      );
    } else if (currentExamPart === "reading") {
      setMinutes(30);
      setTimeLeft(30 * 60);
      dispatch(
        SET_DATA_OF_MODAL_LIST({
          testBankData: testBankData,
          currentExamPart: currentExamPart,
          currentQuestion: numberQuestion,
        })
      );
    } else if (currentExamPart === "listening") {
      dispatch(
        SET_DATA_OF_MODAL_LIST({
          testBankData: testBankData,
          currentExamPart: currentExamPart,
          currentQuestion: numberQuestion,
        })
      );
      setMinutes(30);
      setTimeLeft(30 * 60);
    }
  }, [currentExamPart]);

  //// XỬ LÝ THỜI GIAN CHO SPEAKING ////////

  useEffect(() => {
    if (currentExamPart === "speaking") {
      /**
       * b1: check xem part nào đang là part cuối cùng
       * b2: cho đọc câu hỏi
       * b3: đếm thời gian công thu âm
       * b4: lưu file thu âm vào store
       *
       */

      const audioSrc =
        currentExamPart === "speaking"
          ? dataSimpleTest[currentExamPart]?.[
              `part${numberQuestionSpeaking}`
            ]?.[0]?.["questions"]?.[0]?.["subQuestion"]?.[
              numberQuestionEachPart - 1
            ]?.file
          : undefined;

      console.log({ audioSrc });

      if (audioSrc) {
        if (audioRef.current) {
          audioRef.current.pause();
        }

        console.log("audioSrc :::::: ", audioSrc);

        audioRef.current = new Audio(audioSrc);
      }

      if (!window.speechSynthesis) {
        alert("Trình duyệt của bạn không hỗ trợ microphone");
        return;
      }

      setMinutes(0);
      setTimeLeft(timecountSpeaking[numberQuestionSpeaking]);

      playAudio(audioSrc);
    }
  }, [numberQuestionSpeaking, numberQuestionEachPart]);

  ////////////////////////////////////////////

  useEffect(() => {
    if (timeLeft > 0 && isCountdown && isPauseCountTime) {
      if (timeLeft - 1 === 20) {
        setIsDisabled(true);
      }
      const id = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(id);
    }
  }, [timeLeft, isCountdown, isPauseCountTime]);

  ///////////// XỬ LÝ HÀNH ĐỘNG KHI HẾT THỜI GIAN //////////////////////

  const playAudio = async (audioSrc) => {
    if (audioSrc && audioRef.current) {
      try {
        setTimeout(() => {
          audioRef.current.play();
          audioRef.current.onended = () => {
            audioBeepRef.current.play();
            setIsPauseCountTime(true);
            startRecording();

            return;
          };
          return;
        }, 1000);
      } catch (error) {
        console.error("Error playing audio:", error);
      }
    } else {
      setTimeout(() => {
        setIsPauseCountTime(true);
        startRecording();
        return;
      }, 1500);
    }
  };

  // move to next part skill
  const nextPartSkill = async () => {
    await stopRecord();
    dispatch(SET_MOVE_EXAM_SKILL());
    // dispatch(SET_RESET_NUMBER_QUESTION());
    setOpenModal(false);
  };

  const fetchData = async () => {
    try {
      dispatch(SET_TESTBANK_DATA(dataSimpleTest));
    } catch (error) {
      console.log({ error });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <FrameRoomExam
        currentExamPart={currentExamPart}
        finishRecording={finishRecording}
        isDisabled={isDisabled}
        isModalList={isModalList}
        moveExamSkill={moveExamSkill}
        previousQuestion={previousQuestion}
        nextQuestion={nextQuestion}
        hours={hours}
        minutes={minutes}
        seconds={seconds}
        typeZoom="test"
      >
        {currentExamPart === "speaking" && <ExamSpeaking />}
        {currentExamPart === "listening" && <ExamListening />}
        {currentExamPart === "reading" && <ExamReading />}
        {currentExamPart === "writing" && <ExamWriting />}
        {currentExamPart === "result" && <ResultTest />}
      </FrameRoomExam>

      <BasicModal
        open={openModal}
        handleClose={closeModal}
        label="Move to another skill"
      >
        <button
          className="bg-[#45368f] text-white px-6 py-2 pt-3 shadow mr-1 rounded hover:bg-[#45368f] hover:opacity-80"
          onClick={nextPartSkill}
        >
          Next
        </button>
      </BasicModal>

      <audio
        ref={audioBeepRef}
        src="/audio/beep.mp3"
        style={{ display: "none" }}
      ></audio>
    </>
  );
};

export default RoomExam;
