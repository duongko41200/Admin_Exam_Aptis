import { memo, useEffect, useRef, useState } from "react";

import { useSelector } from "react-redux";
import { formatAudioTimestamp } from "../../../utils/formatTime";

const ModalSuggestTest = ({ currentExamPart }) => {
  const [contentSugesstion, setContentSugesstion] = useState(null);
  const [file, setFile] = useState(null);
  const audioRef = useRef(null);

  const { isModalListSugestion } = useSelector((state) => state.generalStore);

  const numberQuestionEachPart = useSelector(
    (state) => state.listeningStore.numberQuestionEachPart
  );
  const numberQuestionListening = useSelector(
    (state) => state.listeningStore.numberQuestion
  );
  const numberQuestionWriting = useSelector(
    (state) => state.writingStore.numberQuestion
  );
  const numberQuestionReading = useSelector(
    (state) => state.readingStore.numberQuestion
  );
  const numberQuestionSpeaking = useSelector(
    (state) => state.speakingStore.numberQuestion
  );
  const numberQuestionEachPartSpeaking = useSelector(
    (state) => state.speakingStore.numberQuestionEachPart
  );

  const testBankData = useSelector((state) => state.testBankStore.testBankData);
  const getListeningSuggestion = () => {
    let indexQuestion = 0;
    let listening = "";

    switch (numberQuestionListening) {
      case 1:
        indexQuestion = numberQuestionEachPart - 1;
        listening =
          testBankData.listening[`part${numberQuestionListening}`][0]
            ?.questions[0].subQuestion[indexQuestion].suggestion;
        break;
      case 2:
      case 3:
        listening =
          testBankData.listening[`part${numberQuestionListening}`][0]
            ?.questions[0].suggestion;
        break;
      case 4:
        indexQuestion = numberQuestionEachPart - 16;
        listening =
          testBankData.listening[`part${numberQuestionListening}`][
            indexQuestion
          ]?.questions[0].suggestion;
        break;
      default:
        break;
    }

    try {
      const extractedJson = listening.match(/\[.*\]/s)[0];
      const jsonArray = JSON.parse(extractedJson) || [];

      let fileAudio = "";

      if (numberQuestionListening === 1) {
        fileAudio =
          testBankData.listening[`part${numberQuestionListening}`][0]
            .questions[0].subQuestion[indexQuestion].file;
      }

      if (numberQuestionListening === 2 || numberQuestionListening === 3) {
        fileAudio =
          testBankData.listening[`part${numberQuestionListening}`][0]
            .questions[0].file;
      }
      if (numberQuestionListening === 4) {
        fileAudio =
          testBankData.listening[`part${numberQuestionListening}`][
            indexQuestion
          ].questions[0].file;
      }
      setFile(fileAudio);
      return jsonArray;
    } catch (error) {
      console.log({ error });
      return listening;
    }
  };

  const getReadingSuggestion = () => {
    return testBankData.reading[`part${numberQuestionReading}`][0].data
      .questions.suggestion;
  };

  const getWritingSuggestion = () => {
    return testBankData.writing[`part${numberQuestionWriting}`][0].questions[0]
      .suggestion;
  };
  const getSpeakingSuggestion = () => {
    let indexQuestion = 0;
    let speaking = "";

    switch (numberQuestionSpeaking) {
      case 1:
      case 2:
      case 3:
        indexQuestion = numberQuestionEachPartSpeaking - 1;
        speaking =
          testBankData.speaking[`part${numberQuestionSpeaking}`][0]
            ?.questions[0].subQuestion[indexQuestion].suggestion;
        break;

      case 4:
        speaking =
          testBankData.speaking[`part${numberQuestionSpeaking}`][0]
            ?.questions[0]?.suggestion;
        break;
      default:
        break;
    }

    return speaking;
  };
  const textSuggestions = () => {
    const getSuggestion = () => {
      switch (currentExamPart) {
        case "speaking":
          return getSpeakingSuggestion();
        case "listening":
          return getListeningSuggestion();
        case "reading":
          return getReadingSuggestion();
        case "writing":
          return getWritingSuggestion();
        default:
          return null;
      }
    };

    setContentSugesstion(getSuggestion());
  };
  const MoveToTime = (time) => {
    audioRef.current.currentTime = time;
    audioRef.current.play();
  };

  useEffect(() => {
    textSuggestions();
  }, [
    isModalListSugestion,
    numberQuestionListening,
    numberQuestionEachPart,
    numberQuestionReading,
    numberQuestionWriting,
    currentExamPart,
    numberQuestionSpeaking,
    numberQuestionEachPartSpeaking,
  ]);

  return (
    <>
      {currentExamPart === "listening" &&
      contentSugesstion &&
      Array.isArray(contentSugesstion) ? (
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
          dangerouslySetInnerHTML={{ __html: contentSugesstion }}
        />
      )}
    </>
  );
};

export default memo(ModalSuggestTest);
