import { useSelector } from "react-redux";
import "../../Reading/ExamReading.css";

const SpeakingPartTwo = () => {
  const numberQuestionEachPart = useSelector(
    (state) => state.speakingStore.numberQuestionEachPart
  );

  const subQuestionSpeaking = useSelector(
    (state) => state.speakingStore.currentSpeakingData
  );

  return (
    <div>
      <div className="lrn_stimulus_content lrn_clearfix lrn_question mb-5">
        <div>
          {subQuestionSpeaking.subQuestions.length > 0 &&
            subQuestionSpeaking.subQuestions[numberQuestionEachPart - 1]
              ?.content}
        </div>
      </div>
      {numberQuestionEachPart === 1 && numberQuestionEachPart && (
        <img
          src={subQuestionSpeaking.img && subQuestionSpeaking?.img[0]}
          width={300}
        />
      )}
    </div>
  );
};

export default SpeakingPartTwo;
