import { useRef } from "react";
import { useSelector } from "react-redux";
import "../../Reading/ExamReading.css";

const convertToWord = {
  1: "A",
  2: "B",
  3: "C",
  4: "D",
};

const ListeningPartTwo = () => {
  const currentListeningData = useSelector(
    (state) => state.listeningStore.currentListeningData
  );
  const isCheckResult = useSelector(
    (state) => state.taiLieuStore.isCheckResult
  );


  const audioRef = useRef(null);

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

  const handleAudioEnd = () => {
    setIsPlaying(false);
  };

  // Function to get select styling based on answer correctness
  // const getSelectStyle = (questionIndex) => {
  //   if (!isCheckResult) {
  //     return "lrn-cloze-select lrn_cloze_response h-full w-full font-medium";
  //   }

  //   // When auto check is enabled, highlight correct answer
  //   const selectedAnswer = selectedAnswers[questionIndex];
  //   const correctAnswer = subQuestions[questionIndex]?.correctAnswer;

  //   // If user selected the correct answer
  //   if (selectedAnswer === correctAnswer && selectedAnswer) {
  //     return "lrn-cloze-select lrn_cloze_response h-full w-full font-medium border-2 border-green-500 bg-green-50";
  //   }
  //   // If user selected wrong answer
  //   else if (selectedAnswer && selectedAnswer !== correctAnswer) {
  //     return "lrn-cloze-select lrn_cloze_response h-full w-full font-medium border-2 border-red-500 bg-red-50";
  //   }
  //   // Default style when auto check is enabled but no answer selected yet
  //   else {
  //     return "lrn-cloze-select lrn_cloze_response h-full w-full font-medium border-2 border-blue-300";
  //   }
  // };

  // Function to get visual indicator for correct answer when auto check is enabled
  // const getCorrectAnswerIndicator = (questionIndex) => {
  //   // if (!isCheckResult) return null;

  //   // const correctAnswer = subQuestions[questionIndex]?.correctAnswer;
  //   // if (!correctAnswer) return null;

  //   return (
  //     <div className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-sm rounded border border-green-300">
  //       Đáp án đúng: {correctAnswer}
  //     </div>
  //   );
  // };

  return (
    <div className="flex flex-col gap-4">
      <div className=" mb-2">
        {currentListeningData && currentListeningData.content}
      </div>
      <div
        onClick={toggleAudio}
        className="hover:underline cursor-pointer flex gap-2 items-center w-fit"
      >
        {/* <div>
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
        <audio
          ref={audioRef}
          className="hidden"
          key={contentPartTwo && contentPartTwo[0]?.file}
          onEnded={handleAudioEnd}
        >
          <source
            src={
              contentPartTwo && contentPartTwo[0]?.file
                ? contentPartTwo[0]?.file
                : null
            }
            type="audio/mp3"
          />
        </audio> */}
      </div>
      <div className="flex flex-col gap-6">
        {currentListeningData.subQuestions.length > 0 &&
          currentListeningData.subQuestions.map((item, index) => (
            <div key={index}>
              <div className="flex h-[40px] w-full cursor-pointer">
                <div className="w-[7rem] text-[15px] h-full flex items-center justify-start">
                  <div> Speaker {convertToWord[index + 1]}</div>
                </div>

                <div className="w-1/2 px-[0.7rem] flex items-center text-md text-black">
                  <select
                    aria-label="Response input area"
                    className="min-w-[150px] w-fit"
                    // className={getSelectStyle(index)}
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
                    {currentListeningData &&
                      currentListeningData.answerList.map((answer, idx) => (
                        <option key={idx} role="option" value={answer.content}>
                          <div className="w-full border bg-black">
                            {idx + 1}. {answer.content}
                            {answer.content}
                          </div>
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
      </div>
      {isCheckResult && (
        <div className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-sm rounded border border-green-300">
          {currentListeningData.subQuestions.map((item, index) => (
            <div key={index}>
              Speaker {convertToWord[index + 1]}:{" "}
              {item.correctAnswer}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListeningPartTwo;
