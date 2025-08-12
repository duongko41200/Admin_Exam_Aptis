"use client";

import React, { useEffect, useState } from "react";
import "../../Reading/ExamReading.css";
import { useSelector } from "react-redux";
import { RES_DATA } from "../../../../consts/global";
// import { useNavigate } from "react-router-dom";
// import { useRouter } from "next/router";

const SpeakingPartOne = () => {
  const subQuestionSpeaking = useSelector(
    (state) => state.speakingStore.currentSpeakingData?.subQuestions
  );

  const numberQuestionEachPart = useSelector(
    (state) => state.speakingStore.numberQuestionEachPart
  );

  return (
    <div>
      <div className="lrn_stimulus_content lrn_clearfix lrn_question mb-5 text-md">
        <div>
          {subQuestionSpeaking.length > 0 &&
            subQuestionSpeaking[numberQuestionEachPart - 1]?.content}
        </div>
      </div>
    </div>
  );
};

export default SpeakingPartOne;
