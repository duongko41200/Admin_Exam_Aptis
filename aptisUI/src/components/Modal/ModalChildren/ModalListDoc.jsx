import { SET_UPDATE_CURRENT_NUMBER_QUESTION } from "../../../store/taiLieu";
import { memo } from "react";
import { useDispatch, useSelector } from "react-redux";

function ModalListDoc() {
  const dispatch = useDispatch();
  const listening = useSelector((state) => state.taiLieuStore.listening);
  const currentSkillName = useSelector(
    (state) => state.taiLieuStore.currentSkillName
  );
  const currentPartName = useSelector(
    (state) => state.taiLieuStore.currentPartName
  );
  const moveQuestion = (index) => {
    dispatch(SET_UPDATE_CURRENT_NUMBER_QUESTION(index));
  };
  const currentNumberQuestion = useSelector(
    (state) => state.taiLieuStore.currentNumberQuestion
  );
  const isCheckResult = useSelector(
    (state) => state.taiLieuStore.isCheckResult
  );
  const updateStatusCheckResult = (index) => {
    let style = "";
    console.log({ currentPartName });
    const checkAnswers = (arr) => {
      return arr.every((item) => item.responseUser === item.correctAnswer);
    };

    const getStyle = (isCorrect) => {
      return isCorrect
        ? "bg-green-400 text-white font-semibold"
        : "bg-red-400 text-white font-semibold";
    };

    if (currentSkillName === "listening") {
      if (currentPartName === 1) {
        style = listening[index]?.responseUser
          ? getStyle(
              listening[index]?.responseUser === listening[index]?.correctAnswer
            )
          : "bg-gray-100";
      } else if (currentPartName === 2 || currentPartName === 4) {
        style = getStyle(checkAnswers(listening[index]?.subQuestion));
      }
    } else if (currentSkillName === "reading") {
      if (currentPartName === 1) {
        style = getStyle(checkAnswers(listening[index]?.subQuestion));
      }
      if (currentPartName === 2) {
        style = "bg-green-400 text-white font-semibold";

        const responseUser = listening[index]?.responseUser;
        for (let i = 0; i < responseUser.length; i++) {
          if (responseUser[i] === null) {
            style = "bg-red-400 text-white font-semibold";
            break;
          }
          if (parseInt(responseUser[i].id) != i + 1) {
            style = "bg-red-400 text-white font-semibold";
            break;
          }
        }
      }
      if (currentPartName === 3) {
        const resultReadingFourUser = listening[index]?.answerList.map(
          (item) => ({ ...item })
        );
        const subQuestionReadingFourUser = listening[index]?.subQuestion.map(
          (item) => ({ ...item })
        );
        if (resultReadingFourUser) {
          style = "bg-green-400 text-white font-semibold";
          for (let userItem of resultReadingFourUser) {
            userItem.resultUser = [];
            userItem.resultSystem = [];

            for (let subItem of subQuestionReadingFourUser) {
              if (!subItem.responseUser) {
                style = "";
                continue;
              }
              if (userItem.content === subItem.responseUser) {
                userItem.resultUser.push(subItem.content);
              }
              if (userItem.content === subItem.correctAnswer) {
                userItem.resultSystem.push(subItem.content);
              }
            }

            const isCorrect =
              userItem.resultUser.length === userItem.resultSystem.length &&
              userItem.resultUser.every((userAnswer) =>
                userItem.resultSystem.includes(userAnswer)
              );

            if (!isCorrect) {
              style = "bg-red-400 text-white font-semibold";
              break;
            }
          }
        }
      }

      if (currentPartName === 4) {
        const resultReadingFourUser = listening[index]?.answerList.map(
          (item) => ({
            ...item,
          })
        );
        const subQuestionReadingFourUser = listening[index]?.subQuestion.map(
          (item) => ({ ...item })
        );
        if (resultReadingFourUser) {
          style = "bg-green-400 text-white font-semibold";
          for (let userItem of resultReadingFourUser) {
            userItem.resultUser = [];
            userItem.resultSystem = [];

            for (let subItem of subQuestionReadingFourUser) {
              if (!subItem.responseUser) {
                style = "";
                continue;
              }
              if (userItem.content === subItem.responseUser) {
                userItem.resultUser.push(subItem.content);
              }
              if (userItem.content === subItem.correctAnswer) {
                userItem.resultSystem.push(subItem.content);
              }
            }

            const isCorrect =
              userItem.resultUser.length === userItem.resultSystem.length &&
              userItem.resultUser.every((userAnswer) =>
                userItem.resultSystem.includes(userAnswer)
              );

            if (!isCorrect) {
              style = "bg-red-400 text-white font-semibold";
              break;
            }
          }
        }
      }
    }

    return style;
  };

  return (
    <div className="mt-4 w-full flex gap-2 flex-wrap border border-[#e5e5e5] rounded-[6px] p-2">
      {listening?.map((_, index) =>
        !isCheckResult ? (
          <div
            key={index}
            className={`w-fit text-center sm:w-1/2 lg:w-1/6 py-1 px-2 hover:text-white font-medium cursor-pointer shadow-md hover:bg-[#45368f87] border rounded-lg h-fit ${currentNumberQuestion === index ? "bg-[#45368f] text-white font-semibold" : "bg-gray-100"} `}
            onClick={() => moveQuestion(index)}
          >
            {index + 1}
          </div>
        ) : (
          <div
            key={index}
            className={`w-fit text-center sm:w-1/2 lg:w-1/6 py-1 px-2 hover:text-white font-medium cursor-pointer shadow-md hover:bg-[#45368f87] border rounded-lg h-fit  ${updateStatusCheckResult(
              index
            )}  ${currentNumberQuestion === index && "  bg-violet-900 text-white font-semibold"}  `}
            onClick={() => moveQuestion(index)}
          >
            {index + 1}
          </div>
        )
      )}
    </div>
  );
}

export default memo(ModalListDoc);
