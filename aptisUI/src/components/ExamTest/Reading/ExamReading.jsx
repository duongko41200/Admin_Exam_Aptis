import { memo } from "react";
import { useSelector } from "react-redux";
import "./ExamReading.css";
import ReadingPartFive from "./ReadingPartFive/ReadingPartFive";
import ReadingPartFour from "./ReadingPartFour/ReadingPartFour";
import ReadingPartOne from "./ReadingPartOne/ReadingPartOne";
import ReadingPartThree from "./ReadingPartThree/ReadingPartThree";
import ReadingPartTwo from "./ReadingPartTwo/ReadingPartTwo";

const ExamReading = () => {
  const numberQuestion = useSelector(
    (state) => state.readingStore.numberQuestion
  );

  return (
    <>
      <div className="flex flex-col items-center mb-16">
        <div className="flex justify-center mt-14 p-4 w-full">
          <div className="flex flex-col justify-center p-4 w-2/3 mb-[calc(3rem+1.5vw)]">
            <div className="font-semibold text-lg">Reading</div>
            <div>
              <div className="mb-6 font-semibold text-lg">
                Question {numberQuestion} of 5
              </div>
            </div>
            {numberQuestion === 1 && <ReadingPartOne />}
            {numberQuestion === 2 && <ReadingPartTwo />}
            {numberQuestion === 3 && <ReadingPartThree />}
            {numberQuestion === 4 && <ReadingPartFour />}
            {numberQuestion === 5 && <ReadingPartFive />}
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(ExamReading);
