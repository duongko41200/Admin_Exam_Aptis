import { memo } from "react";
import { useSelector } from "react-redux";
import "./ExamWriting.css";
import WritingPartFour from "./WritingPartFour/WritingPartFour";
import WritingPartOne from "./WritingPartOne/WritingPartOne";
import WritingPartThree from "./WritingPartThree/WritingPartThree";
import WritingPartTwo from "./WritingPartTwo/WritingPartTwo";

const ExamReading = () => {
  const numberQuestion = useSelector(
    (state) => state.writingStore.numberQuestion
  );

  return (
    <>
      <div className="flex flex-col justify-center items-center mb-20">
        <div
          className="flex flex-col justify-start mt-[3.25rem] p-4 mb-[calc(3rem+1.5vw)]"
          style={{ width: "calc(100% - 500px)" }}
        >
          <div className="font-semibold text-[1.275rem]">Writing</div>
          <div>
            <div className="row">
              <div className="mb-[1.5em] mt-0 font-semibold text-[1.275rem]">
                Question {numberQuestion} of 4
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

export default memo(ExamReading);
