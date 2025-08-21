import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import "../../Reading/ExamReading.css";

const convertToWord = {
  1: "A",
  2: "B",
  3: "C",
  4: "D",
};

const ListeningPartFour = () => {
  const audioRef = useRef(null);
  const testBankData = useSelector((state) => state.testBankStore.testBankData);
  const isCheckResult = useSelector(
    (state) => state.taiLieuStore.isCheckResult
  );
  const currentListeningData = useSelector(
    (state) => state.listeningStore.currentListeningData
  );

  console.log({ currentListeningData });

  const numberQuestionEachPart = useSelector(
    (state) => state.listeningStore.numberQuestionEachPart
  );

  const [isPlaying, setIsPlaying] = useState(false);

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

  return (
    <div className="flex flex-col gap-4">
      <div className=" mb-2">{currentListeningData.content}</div>

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
        key={
          numberQuestionEachPart >= 16 &&
          numberQuestionEachPart <= 17 &&
          testBankData.listening.part4[numberQuestionEachPart - 16] &&
          testBankData.listening.part4[numberQuestionEachPart - 16]
            .questions[0] &&
          testBankData.listening.part4[numberQuestionEachPart - 16].questions[0]
            .file
        }
        onEnded={handleAudioEnd}
      >
        <source
          src={
            numberQuestionEachPart >= 16 &&
            numberQuestionEachPart <= 17 &&
            testBankData.listening.part4[numberQuestionEachPart - 16] &&
            testBankData.listening.part4[numberQuestionEachPart - 16]
              .questions[0] &&
            testBankData.listening.part4[numberQuestionEachPart - 16]
              .questions[0].file
              ? testBankData.listening.part4[numberQuestionEachPart - 16]
                  .questions[0].file
              : null
          }
          type="audio/mp3"
        />
      </audio>
      <div>
        <div className="flex flex-col gap-8">
          {currentListeningData &&
            currentListeningData?.subQuestions.map((item, index) => (
              <div className="flex flex-col gap-2" key={index}>
                <div>{item.content ? item.content : "..."}</div>
                <div className="flex flex-col gap-1">
                  {item.answerList.map((answer, idx) => (
                    <div
                      className="flex h-[65px] w-full  border border-[#d4d4d4] cursor-pointer "
                      key={idx}
                      onClick={() => {
                        handleClick(answer, idx, index);
                      }}
                    >
                      <div
                        className={`text-[2rem] w-[4.5rem]  text-center h-full flex items-center border border-r-2 border-[#d4d4d4] justify-center ${
                          isCheckResult &&
                          item.correctAnswer === answer.content &&
                          item.correctAnswer
                            ? "bg-green-200"
                            : "hover:bg-[#f8f9fa]"
                        }`}
                      >
                        <div>{convertToWord[idx + 1]}</div>
                      </div>

                      <div
                        className={`w-full p-[0.7rem] text-sm md:text-md h-full flex items-center ${
                          isCheckResult &&
                          item.correctAnswer === answer.content &&
                          item.correctAnswer
                            ? "bg-green-200"
                            : "hover:bg-[#f8f9fa]"
                        }`}
                      >
                        <div>{answer?.content}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ListeningPartFour;
