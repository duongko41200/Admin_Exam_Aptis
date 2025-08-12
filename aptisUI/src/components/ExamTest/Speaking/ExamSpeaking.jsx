import { memo } from "react";
import { useSelector } from "react-redux";
import "./ExamSpeaking.css";
import SpeakingPartFour from "./SpeakingPartFour/SpeakingPartFour";
import SpeakingPartOne from "./SpeakingPartOne/SpeakingPartOne";
import SpeakingPartThree from "./SpeakingPartThree/SpeakingPartThree";
import SpeakingPartTwo from "./SpeakingPartTwo/SpeakingPartTwo";

const ExamReading = () => {
  // const testBankData = useSelector((state) => state.testBankStore.testBankData);

  const numberQuestion = useSelector(
    (state) => state.speakingStore.numberQuestion
  );
  const numberQuestionEachPart = useSelector(
    (state) => state.speakingStore.numberQuestionEachPart
  );

  return (
    <>
      <div className="flex flex-col justify-center items-center mb-16 fluid">
        <div className="flex flex-col justify-start mt-16 px-4 w-full">
          <div className="font-semibold text-lg">
            Speaking - Part {numberQuestion}
          </div>
          <div>
            <div className="row">
              <div className="mb-6 mt-0 font-semibold text-lg">
                Question {numberQuestionEachPart} of 3
              </div>
            </div>
          </div>
          {numberQuestion && numberQuestion === 1 && <SpeakingPartOne />}
          {numberQuestion && numberQuestion === 2 && <SpeakingPartTwo />}
          {numberQuestion && numberQuestion === 3 && <SpeakingPartThree />}
          {numberQuestion && numberQuestion === 4 && <SpeakingPartFour />}
        </div>
      </div>
    </>
  );
};

export default memo(ExamReading);
