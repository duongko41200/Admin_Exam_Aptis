import { memo, useEffect, useRef, useState } from "react";

import { useSelector } from "react-redux";
import { formatAudioTimestamp } from "../../../utils/formatTime";

const ModalSuggestDoc = ({ currentExamPart }) => {
  const [contentSugesstion, setContentSugesstion] = useState(null);
  const [file, setFile] = useState(null);
  const audioRef = useRef(null);
  const listening = useSelector((state) => state.taiLieuStore.listening);


  const [suggestion, setSuggestion] = useState(null);
  const currentNumberQuestion = useSelector(
    (state) => state.taiLieuStore.currentNumberQuestion
  );

  // speaking
  const numberQuestion = useSelector(
    (state) => state.speakingStore.numberQuestion
  );

  const subQuestionSpeaking = useSelector(
    (state) => state.speakingStore.currentSpeakingData?.subQuestions
  );
  const currentSpeakingData = useSelector(
    (state) => state.speakingStore.currentSpeakingData
  );

  const numberQuestionEachPart = useSelector(
    (state) => state.speakingStore.numberQuestionEachPart
  );

  //writing
  const currentWritingData = useSelector(
    (state) => state.writingStore.currentWritingData
  );

  // listening
  const currentListeningData = useSelector(
    (state) => state.listeningStore.currentListeningData
  );

  const numberPartListening = useSelector(
    (state) => state.listeningStore.numberQuestion
  );

  const numberQuestionEachPartListening = useSelector(
    (state) => state.listeningStore.numberQuestionEachPart
  );
  const MoveToTime = (time) => {
    audioRef.current.currentTime = time;
    audioRef.current.play();
  };
  useEffect(() => {
    if (listening && currentExamPart === "listening") {
      if (numberPartListening === 1) {
        const extractedJson =
          currentListeningData.subQuestions[
            numberQuestionEachPartListening - 1
          ]?.suggestion?.match(/\[.*\]/s);
        const jsonArray = extractedJson ? JSON.parse(extractedJson) || [] : [];
        console.log({ jsonArray });

        if (jsonArray.length === 0) {
          setSuggestion(
            currentListeningData?.subQuestions[
              numberQuestionEachPartListening - 1
            ].suggestion || null
          );
        }
        let fileAudio = "";

        fileAudio =
          currentListeningData.subQuestions[numberQuestionEachPartListening]
            ?.file;

        setContentSugesstion(jsonArray);
        setFile(fileAudio);

        return;
      }

      console.log("currentListeningData", currentListeningData);

      const extractedJson = currentListeningData.suggestion?.match(/\[.*\]/s);
      const jsonArray = extractedJson ? JSON.parse(extractedJson) || [] : [];
      console.log({ jsonArray });

      if (jsonArray.length === 0) {
        console.log(
          "No suggestion available for this question",
          currentListeningData
        );
        setSuggestion(currentListeningData?.suggestion || null);
      }
      let fileAudio = "";

      fileAudio = currentListeningData?.file;

      setContentSugesstion(jsonArray);
      setFile(fileAudio);

      return;
    }

    if (currentExamPart === "speaking") {
      const subQuestion = subQuestionSpeaking[numberQuestionEachPart - 1];

      if (numberQuestion === 4) {
        setSuggestion(currentSpeakingData?.suggestion || null);
        return;
      }
      if (subQuestion && subQuestion.suggestion) {
        setSuggestion(subQuestion.suggestion);
      } else {
        setSuggestion(null);
      }
    }
    if (currentExamPart === "writing") {
      setSuggestion(currentWritingData?.suggestion || null);
    }
  }, [currentNumberQuestion]);
  return (
    <>
      {currentExamPart === "listening" &&
      contentSugesstion &&
      Array.isArray(contentSugesstion) &&
      contentSugesstion.length > 0 ? (
        <>
          <div className="mb-4">
            <audio
              key={file}
              ref={audioRef}
              controls
              controlsList="nodownload"
              className="w-full  rounded-lg shadow-lg bg-gray-100 text-white p-2"
            >
              <source src={file} type="audio/mp3" />
            </audio>
          </div>
          {contentSugesstion.map((chunk, i) => (
            <div
              key={`${i}-${chunk.text}`}
              className="w-full flex flex-row mb-2  rounded-lg p-4 shadow-xl shadow-black/5 ring-1 ring-slate-700/10 bg-gray-50 text-sm 2xl:text-md"
            >
              <div
                className="mr-5 bg-blue-50 text-blue-500 rounded p-1 text-sm 2xl:text-sm h-fit cursor-pointer hover:bg-blue-100"
                onClick={() => MoveToTime(chunk.timestamp[0])}
              >
                {formatAudioTimestamp(chunk.timestamp[0])}
              </div>
              {chunk.text}
            </div>
          ))}
        </>
      ) : (
        <div
          className="m-0"
          dangerouslySetInnerHTML={{
            __html: suggestion,
          }}
        />
      )}
    </>
  );
};

export default memo(ModalSuggestDoc);
