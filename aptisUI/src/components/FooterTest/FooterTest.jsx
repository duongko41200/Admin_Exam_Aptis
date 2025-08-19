import { useDispatch, useSelector } from "react-redux";
import {
  SET_AI_SCORE,
  SET_IS_MODAL_INFO,
  SET_IS_MODAL_SETTING,
  SET_MODAL_LIST,
  SET_MODAL_LIST_SUGESTION,
} from "../../store/general";
import ButtonAiMobie from "../ButtonAiMobie";
import {
  SET_DECREMENT_SPEAKING_EACH_PART,
  SET_INCREMENT_SPEAKING_EACH_PART,
} from "../../store/feature/speaking";

export default function FooterTest({
  moveExamSkill,
  isDisabled,
  currentExamPart,
  isSpeakingTaiLieu,
  nextQuestion,
  previousQuestion,
}) {
  const dispatch = useDispatch();
  const { isModalList } = useSelector((state) => state.generalStore);
  const { isModalListSugestion } = useSelector((state) => state.generalStore);
  const { isModalSetting } = useSelector((state) => state.generalStore);
  const { isModalInfo } = useSelector((state) => state.generalStore);
  const { isAiScore } = useSelector((state) => state.generalStore);

  // Default navigation functions for Speaking if not provided
  const defaultNextQuestion = () => {
    dispatch(SET_INCREMENT_SPEAKING_EACH_PART());
  };
  const defaultPreviousQuestion = () => {
    dispatch(SET_DECREMENT_SPEAKING_EACH_PART());
  };

  // Use provided navigation functions or defaults
  const handleNextQuestion = nextQuestion || defaultNextQuestion;
  const handlePreviousQuestion = previousQuestion || defaultPreviousQuestion;

  const isCheckResult = useSelector(
    (state) => state.taiLieuStore.isCheckResult
  );

  const openModalSuggesters = () => {
    dispatch(SET_MODAL_LIST_SUGESTION(!isModalListSugestion));
    dispatch(SET_MODAL_LIST(false));
    dispatch(SET_IS_MODAL_SETTING(false));
    dispatch(SET_IS_MODAL_INFO(false));
    dispatch(SET_AI_SCORE(false));
  };

  const openModalList = () => {
    dispatch(SET_MODAL_LIST(!isModalList));
    dispatch(SET_MODAL_LIST_SUGESTION(false));
    dispatch(SET_IS_MODAL_SETTING(false));
    dispatch(SET_IS_MODAL_INFO(false));
    dispatch(SET_AI_SCORE(false));
  };

  const openModalSetting = () => {
    dispatch(SET_MODAL_LIST_SUGESTION(false));
    dispatch(SET_MODAL_LIST(false));
    dispatch(SET_IS_MODAL_SETTING(!isModalSetting));
    dispatch(SET_IS_MODAL_INFO(false));
    dispatch(SET_AI_SCORE(false));
  };
  const openModalInfo = () => {
    dispatch(SET_MODAL_LIST_SUGESTION(false));
    dispatch(SET_MODAL_LIST(false));
    dispatch(SET_IS_MODAL_SETTING(false));
    dispatch(SET_IS_MODAL_INFO(!isModalInfo));
    dispatch(SET_AI_SCORE(false));
  };

  const showModalAiScore = () => {
    dispatch(SET_AI_SCORE(!isAiScore));
    dispatch(SET_MODAL_LIST_SUGESTION(false));
    dispatch(SET_MODAL_LIST(false));
    dispatch(SET_IS_MODAL_SETTING(false));
    dispatch(SET_IS_MODAL_INFO(false));
  };

  return (
    <>
      <div className="footer-test z-50 fixed bottom-0 left-0 w-full bg-white shadow-md p-4">
        <div className="flex justify-between items-center p-2 rounded-md  border shadow-md">
          <div className="flex items-center gap-1 w-full">
            {((currentExamPart !== "speaking" &&
              currentExamPart !== "result") ||
              isSpeakingTaiLieu) && (
              <IconBox onClick={openModalList}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-5 h-5 stroke-2"
                >
                  <path d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
              </IconBox>
            )}

            <IconBox onClick={openModalInfo}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-5 h-5 stroke-2 bg-black text-white rounded-full"
              >
                <path d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
              </svg>
            </IconBox>
            <IconBox onClick={openModalSetting}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-5 h-5 stroke-2"
              >
                <path d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
            </IconBox>
            <IconBox onClick={openModalSuggesters}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-5 h-5 stroke-2"
              >
                <path d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
              </svg>
            </IconBox>

            {currentExamPart === "writing" && isCheckResult && !isAiScore && (
              <div className="hidden md:block">
                <IconBox onClick={showModalAiScore}>Ai</IconBox>
              </div>
            )}

            {currentExamPart === "writing" && isCheckResult && !isAiScore && (
              <ButtonAiMobie showModalAiScore={showModalAiScore}>
                Ai
              </ButtonAiMobie>
            )}
          </div>
          <div className="flex items-center gap-1">
            {isSpeakingTaiLieu ? (
              <button className="disabled:opacity-50 disabled:cursor-not-allowed disabled:text-gray disabled:hover:text-current hover:text-blue-600">
                <IconBox onClick={moveExamSkill}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-5 h-5 stroke-2"
                  >
                    <path d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25" />
                  </svg>
                </IconBox>
              </button>
            ) : (
              <button
                disabled={currentExamPart === "speaking" && !isDisabled}
                className="disabled:opacity-50 disabled:cursor-not-allowed disabled:text-gray disabled:hover:text-current hover:text-blue-600"
              >
                <IconBox onClick={moveExamSkill}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-5 h-5 stroke-2"
                  >
                    <path d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25" />
                  </svg>
                </IconBox>
              </button>
            )}

            {((currentExamPart !== "speaking" &&
              currentExamPart !== "result") ||
              isSpeakingTaiLieu) && (
              <>
                <button
                  className="text-[#45368f]  px-2 md:px-4 py-2 border border-[#45368f] rounded hover:bg-[#45368f] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handlePreviousQuestion}
                >
                  <div className="flex items-center gap-1 w-full">
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-5 h-5 stroke-2 mr-1"
                      >
                        <path d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                      </svg>
                    </div>
                    <div className="hidden  md:block"> Previous</div>
                  </div>
                </button>
                <button
                  className="bg-[#45368f] text-white px-2 md:px-4 py-2 pt-3 shadow mr-1 rounded hover:bg-[#45368f] hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleNextQuestion}
                >
                  <div className="flex items-center gap-1">
                    <div className="hidden  md:block">Next</div>

                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-5 h-5 stroke-2 ml-1"
                      >
                        <path d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                      </svg>
                    </div>
                  </div>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

const IconBox = ({ children, onClick, classStyle }) => (
  <div
    className={`border border-[#b0b0b0] box-border w-[45px] h-[45px] text-center align-baseline outline-none cursor-pointer rounded-[6px] flex items-center justify-center overflow-hidden ${classStyle}`}
    onClick={onClick}
  >
    {children}
  </div>
);
