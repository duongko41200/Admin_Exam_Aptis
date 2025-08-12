import React, { useEffect, useState } from "react";
import "../../Reading/ExamReading.css";
import { useSelector } from "react-redux";
import { RES_DATA } from "../../../../consts/global";
// import { SET_RESPONSE_RESULT_READING } from "../../../../../store/feature/testBank";
// import { useNavigate } from "react-router-dom";

const SpeakingPartFour = () => {
  const numberQuestionEachPart = useSelector(
    (state) => state.speakingStore.numberQuestionEachPart
  );

  const subQuestions = useSelector(
    (state) => state.speakingStore.currentSpeakingData?.subQuestions
  );

  return (
    <div>
      <div className="lrn_stimulus_content lrn_clearfix lrn_question mb-5 flex flex-col gap-4">
        {subQuestions &&
          subQuestions?.length > 0 &&
          subQuestions.map((item, index) => {
            return (
              <div key={index}>
                <div>{item.content}</div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default SpeakingPartFour;
