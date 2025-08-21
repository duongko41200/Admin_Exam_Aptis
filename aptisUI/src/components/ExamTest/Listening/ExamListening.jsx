import { useSelector } from "react-redux";
import "./ExamListening.css";
import ListeningPartFour from "./ListeningPartFour/ListeningPartFour";
import ListeningPartOne from "./ListeningPartOne/ListeningPartOne";
import ListeningPartThree from "./ListeningPartThree/ListeningPartThree";
import ListeningPartTwo from "./ListeningPartTwo/ListeningPartTwo";
import { memo } from "react";

const ExamListening = () => {
  const numberQuestion = useSelector(
    (state) => state.listeningStore.numberQuestion
  );
  const numberQuestionEachPart = useSelector(
    (state) => state.listeningStore.numberQuestionEachPart
  );

  return (
    <>
      <div className="flex flex-col items-center mb-16">
        <div className="flex justify-center mt-14 w-full mb-6">
          <div className="flex flex-col justify-center w-2/3 mb-[calc(3rem+1.5vw)]">
            <div className="font-semibold text-lg">Listening</div>
            <div>
              <div className="mb-6 font-semibold text-lg">
                Question {numberQuestionEachPart} of{" "}
                {(() => {
                  if (numberQuestion === 1) return 13;
                  if (numberQuestion === 2) return 1;
                  if (numberQuestion === 3) return 1;
                  if (numberQuestion === 4) return 1;
                  return 0;
                })()}
              </div>
            </div>
            {numberQuestion === 1 && <ListeningPartOne />}
            {numberQuestion === 2 && <ListeningPartTwo />}
            {numberQuestion === 3 && <ListeningPartThree />}
            {numberQuestion === 4 && <ListeningPartFour />}
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(ExamListening);
