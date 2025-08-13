import { memo } from "react";
import { useSelector } from "react-redux";
import "./ExamWriting.css";
import WritingPartFour from "./WritingPartFour/WritingPartFour";
import WritingPartOne from "./WritingPartOne/WritingPartOne";
import WritingPartThree from "./WritingPartThree/WritingPartThree";
import WritingPartTwo from "./WritingPartTwo/WritingPartTwo";

const ExamWriting = () => {
  const numberQuestion = useSelector(
    (state) => state.writingStore.numberQuestion
  );

  const numberQuestionEachPart = useSelector(
    (state) => state.writingStore.numberQuestionEachPart
  );

  return (
    <>
      <div className="flex flex-col justify-center items-center mb-16 fluid">
        <div className="flex flex-col justify-start mt-16 px-4 w-full">
          <div className="font-semibold text-md">
            Writing - Part {numberQuestion}
          </div>
          <div>
            <div className="row">
              <div className="mb-6 mt-0 font-semibold text-md">
                Question {numberQuestionEachPart} of 4
              </div>
            </div>
          </div>
          {numberQuestion && numberQuestion === 1 && <WritingPartOne />}
          {numberQuestion && numberQuestion === 2 && <WritingPartTwo />}
          {numberQuestion && numberQuestion === 3 && <WritingPartThree />}
          {numberQuestion && numberQuestion === 4 && <WritingPartFour />}
        </div>
      </div>
    </>
  );
};

export default memo(ExamWriting);
