import { useSelector } from "react-redux";
import "../../Reading/ExamReading.css";

const SpeakingPartThree = () => {
  const numberQuestionEachPart = useSelector(
    (state) => state.speakingStore.numberQuestionEachPart
  );

  const contentPartThree = useSelector(
    (state) => state.speakingStore.currentSpeakingData
  );

  return (
    <div>
      <div className="lrn_stimulus_content lrn_clearfix lrn_question mb-5">
        <b>
          {contentPartThree.subQuestions.length > 0 &&
            contentPartThree.subQuestions[numberQuestionEachPart - 1].content}
        </b>
      </div>

      {numberQuestionEachPart === 1 && contentPartThree && (
        <div className="flex gap-2">
          <div>
            <img src={contentPartThree.img && contentPartThree?.img[0]} width={300} />

          </div>

          <div>
            <img src={contentPartThree.img && contentPartThree?.img[1]} width={300} />
          </div>
        </div>
      )}
    </div>
  );
};

export default SpeakingPartThree;
