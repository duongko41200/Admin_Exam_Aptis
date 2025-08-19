import React, { useEffect, useRef, useState } from "react";
import "../../Reading/ExamReading.css";
import { useDispatch, useSelector } from "react-redux";
import { RES_DATA } from "../../../../consts/global";
import {
  SET_ATTEMPTED_QUESTION,
  SET_RESPONSE_RESULT_LISTENING,
} from "../../../../store/feature/testBank";

const ListeningPartThree = () => {
  const testBankData = useSelector((state) => state.testBankStore.testBankData);
  const isCheckResult = useSelector(
    (state) => state.taiLieuStore.isCheckResult
  );
  const audioRef = useRef(null);
  const numberQuestionEachPart = useSelector(
    (state) => state.listeningStore.numberQuestionEachPart
  );

  // const [resSpeakingPartTwo, setResSpeakingPartTwo] = useState();
  const [contentPartTwo, setContentPartTwo] = useState();
  const [subQuestions, setSubQuestions] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  // const navigate = useNavigate();

  const dispatch = useDispatch();

  const selectOption = (e, index) => {
    const selectedValue = e.target.value;

    // Update selected answers state
    setSelectedAnswers((prev) => ({
      ...prev,
      [index]: selectedValue,
    }));

    dispatch(
      SET_RESPONSE_RESULT_LISTENING({
        part: 3,
        index: index,
        value: selectedValue,
        number: 0,
      })
    );

    dispatch(
      SET_ATTEMPTED_QUESTION({
        part: numberQuestionEachPart,
        numberQuestion: 3,
        currentExamPart: "listening",
      })
    );
  };
  const toggleAudio = () => {
    if (audioRef.current.paused) {
      setIsPlaying(true);
      audioRef.current.play();
    } else {
      setIsPlaying(false);
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  useEffect(() => {
    if (testBankData.speaking.part1.length <= 0) {
      // navigate("/");
      return;
    }

    const ListeningPartThree = testBankData.listening.part3[RES_DATA];

    // setResSpeakingPartTwo(ListeningPartThree);
    setContentPartTwo(ListeningPartThree?.questions);

    setSubQuestions(ListeningPartThree?.questions[RES_DATA].subQuestion);

    // Reset selected answers when part changes
    setSelectedAnswers({});
  }, [testBankData]);

  const handleAudioEnd = () => {
    setIsPlaying(false);
  };

  // Function to get select styling based on answer correctness
  const getSelectStyle = (questionIndex) => {
    if (!isCheckResult) {
      return "lrn-cloze-select lrn_cloze_response h-full w-full font-medium";
    }

    // When auto check is enabled, highlight correct answer
    const selectedAnswer = selectedAnswers[questionIndex];
    const correctAnswer = subQuestions[questionIndex]?.correctAnswer;

    // If user selected the correct answer
    if (selectedAnswer === correctAnswer && selectedAnswer) {
      return "lrn-cloze-select lrn_cloze_response h-full w-full font-medium border-2 border-green-500 bg-green-50";
    }
    // If user selected wrong answer
    else if (selectedAnswer && selectedAnswer !== correctAnswer) {
      return "lrn-cloze-select lrn_cloze_response h-full w-full font-medium border-2 border-red-500 bg-red-50";
    }
    // Default style when auto check is enabled but no answer selected yet
    else {
      return "lrn-cloze-select lrn_cloze_response h-full w-full font-medium border-2 border-blue-300";
    }
  };

  // Function to get visual indicator for correct answer when auto check is enabled
  const getCorrectAnswerIndicator = (questionIndex) => {
    if (!isCheckResult) return null;

    const correctAnswer = subQuestions[questionIndex]?.correctAnswer;
    if (!correctAnswer) return null;

    return (
      <div className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-sm rounded border border-green-300">
        Đáp án đúng: {correctAnswer}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4 ">
      <div className=" mb-2">
        {contentPartTwo &&
          contentPartTwo[RES_DATA] &&
          contentPartTwo[RES_DATA].content}
      </div>

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
        key={contentPartTwo && contentPartTwo[RES_DATA]?.file}
        onEnded={handleAudioEnd}
      >
        <source
          src={
            contentPartTwo && contentPartTwo[RES_DATA]?.file
              ? contentPartTwo[RES_DATA]?.file
              : null
          }
          type="audio/mp3"
        />
      </audio>
      <div className="flex flex-col gap-6">
        <div className="font-medium">Who expresses which opinion?</div>
        {subQuestions.length > 0 &&
          subQuestions.map((item, index) => (
            <div key={index}>
              <div className="flex h-[40px] w-full cursor-pointer">
                <div className="w-fit text-[15px] h-full flex items-center font-medium justify-start">
                  <div>
                    {index + 1}. {item.content}
                  </div>
                </div>

                <div className="w-fit px-[0.8rem] flex items-center text-md">
                  <select
                    aria-label="Response input area"
                    className={getSelectStyle(index)}
                    data-inputid="1"
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
                    {contentPartTwo[RES_DATA] &&
                      contentPartTwo[RES_DATA].answerList.map((answer, idx) => (
                        <option key={idx} role="option" value={answer.content}>
                          {answer.content}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              {getCorrectAnswerIndicator(index)}
            </div>
          ))}
      </div>
    </div>
  );
};

export default ListeningPartThree;
