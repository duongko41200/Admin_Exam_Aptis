import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RES_DATA } from "../../../../consts/global";
import "../../Reading/ExamReading.css";

const ListeningPartThree = () => {
  const isCheckResult = useSelector(
    (state) => state.taiLieuStore.isCheckResult
  );

  const currentListeningData = useSelector(
    (state) => state.listeningStore.currentListeningData
  );

  const audioRef = useRef(null);

  // const [resSpeakingPartTwo, setResSpeakingPartTwo] = useState();
  const [contentPartTwo, setContentPartTwo] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  // const navigate = useNavigate();

  const selectOption = (e, index) => {
    const selectedValue = e.target.value;

    // Update selected answers state
    setSelectedAnswers((prev) => ({
      ...prev,
      [index]: selectedValue,
    }));
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

  const handleAudioEnd = () => {
    setIsPlaying(false);
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
        <div className="font-medium">{currentListeningData.content}</div>
        {currentListeningData?.subQuestions.length > 0 &&
          currentListeningData?.subQuestions.map((item, index) => (
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
                    className="min-w-[100px] w-fit"
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
                          {answer.content}
                        </option>
                      ))}
                  </select>
                </div>

                {isCheckResult && (
                  <div className="min-w-[50px] w-fit px-[0.8rem] flex items-center text-md bg-green-200">
                    {item.correctAnswer}
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ListeningPartThree;
