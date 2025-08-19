import React, { useRef, useState, useEffect } from "react";
import "../../Reading/ExamReading.css";
import { useDispatch, useSelector } from "react-redux";
import {
  SET_ATTEMPTED_QUESTION,
  SET_RESPONSE_RESULT_LISTENING,
} from "../../../../store/feature/testBank";

const convertToWord = {
  1: "A",
  2: "B",
  3: "C",
};

const ListeningPartOne = () => {
  const audioRef = useRef(null);
  const dispatch = useDispatch();
  const numberQuestionEachPart = useSelector(
    (state) => state.listeningStore.numberQuestionEachPart
  );
  const currentListeningData = useSelector(
    (state) => state.listeningStore.currentListeningData
  );
  const isCheckResult = useSelector(
    (state) => state.taiLieuStore.isCheckResult
  );

  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  // Get current sub-question
  const subQ =
    currentListeningData?.subQuestions &&
    currentListeningData.subQuestions[numberQuestionEachPart - 1]
      ? currentListeningData.subQuestions[numberQuestionEachPart - 1]
      : null;

  // Reset selected answer when question changes
  useEffect(() => {
    setSelectedAnswer(null);
  }, [numberQuestionEachPart]);

  // Function to get background color for answer option
  const getAnswerBackgroundColor = (answerContent) => {
    if (!isCheckResult) {
      return "bg-[#eef0f3]"; // Default background when auto check is off
    }

    // When auto check is enabled, show correct answer in green
    if (answerContent === subQ?.correctAnswer) {
      return "bg-green-200"; // Green background for correct answer
    }

    // If user has selected a wrong answer, show it in red
    if (
      selectedAnswer &&
      selectedAnswer === answerContent &&
      answerContent !== subQ?.correctAnswer
    ) {
      return "bg-red-200"; // Red background for wrong selected answer
    }

    return "bg-[#eef0f3]"; // Default background for other answers
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      setIsPlaying(true);
      audioRef.current.play();
    } else {
      setIsPlaying(false);
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const handleAudioEnd = () => {
    setIsPlaying(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="mb-2">{subQ?.content || ".........."}</div>
      {subQ?.file && (
        <>
          <div
            onClick={toggleAudio}
            className="hover:underline cursor-pointer flex gap-2 items-center w-fit"
          >
            <div>
              {!isPlaying ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="size-6 stroke-2 w-[1.6rem] h-[1.6rem] "
                >
                  <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  <path d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="size-6 stroke-2 w-[1.6rem] h-[1.6rem] "
                >
                  <path d="M14.25 9v6m-4.5 0V9M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              )}
            </div>
            <div className="text-lg">Play/Stop</div>
          </div>
          <audio
            ref={audioRef}
            className="hidden"
            key={subQ.file}
            onEnded={handleAudioEnd}
          >
            <source src={subQ.file} type="audio/mp3" />
          </audio>
        </>
      )}
      <div className="flex flex-col gap-1">
        {subQ?.answerList &&
          subQ.answerList.map((item, index) => (
            <div
              className="flex h-[65px] w-full border border-[#d4d4d4] cursor-pointer"
              key={index}
              //   onClick={() => handleClick(item, index)}
            >
              <div
                className={`text-[2rem] w-[4.5rem] text-center h-full flex items-center border border-r-2 border-[#d4d4d4] justify-center`}
              >
                <div>{convertToWord[index + 1]}</div>
              </div>
              <div
                className={`w-full p-[0.7rem] h-full flex items-center text-md ${getAnswerBackgroundColor(
                  item?.content
                )}`}
              >
                <div>{item?.content}</div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ListeningPartOne;
