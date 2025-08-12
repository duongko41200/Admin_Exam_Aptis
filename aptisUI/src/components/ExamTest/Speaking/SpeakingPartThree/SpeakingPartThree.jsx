import React, { useEffect, useState } from "react";
import "../../Reading/ExamReading.css";
import { useSelector } from "react-redux";
import { RES_DATA } from "../../../../consts/global";
// import { SET_RESPONSE_RESULT_READING } from "../../../../../store/feature/testBank";
// import { useNavigate } from "react-router-dom";

const SpeakingPartThree = () => {
  const testBankData = useSelector((state) => state.testBankStore.testBankData);

  const numberQuestionEachPart = useSelector(
    (state) => state.speakingStore.numberQuestionEachPart
  );

  // const [resSpeakingPartThree, setResSpeakingPartThree] = useState();
  const [contentPartThree, setContentPartThree] = useState();
  const [subQuestions, setSubQuestions] = useState([]);

  // const navigate = useNavigate();

  // const dispatch = useDispatch();

  // const selectOption = (e, index) => {
  //   const value = e.target.value;

  //   dispatch(SET_RESPONSE_RESULT_READING({ part: PART_ONE, index, value }));
  // };

  useEffect(() => {
    if (testBankData.speaking.part3.length <= 0) {
      // navigate("/");
      return;
    }
    const SpeakingPartThree = testBankData.speaking.part3[RES_DATA];

    // setResSpeakingPartThree(SpeakingPartThree);
    setContentPartThree(SpeakingPartThree?.questions[RES_DATA]);

    setSubQuestions(SpeakingPartThree?.questions[RES_DATA].subQuestion);
  }, [testBankData]);

  return (
    <div>
      <div className="lrn_stimulus_content lrn_clearfix lrn_question mb-5">
        <b>
          {subQuestions.length > 0 &&
            subQuestions[numberQuestionEachPart - 1].content}
        </b>
      </div>

      {numberQuestionEachPart === 1 && contentPartThree && (
        <div className="flex gap-2">
          <div>
            <img
              src={contentPartThree.image && contentPartThree?.image[0]?.path}
            />
          </div>

          <div>
            <img
              src={contentPartThree.image && contentPartThree?.image[1]?.path}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SpeakingPartThree;
