import React, { useEffect, useState } from "react";
import {  useSelector } from "react-redux";
import { RES_DATA } from "@/Constant/global";
import FrameReadingResult from "@/app/components/FrameReadingResult/FrameReadingResult.jsx";

const ResultTestSpeaking = ({ numberLession }) => {
  const testBankData = useSelector((state) => state.testBankStore.testBankData);
  const isShowResult = useSelector((state) => state.generalStore.isShowResult);
//   const numberQuestionEachPart = useSelector(
//     (state) => state.speakingStore.numberQuestionEachPart
//   );

//   const [resSpeakingPartOne, setResSpeakingPartOne] = useState();
  const [subQuestionsPartOne, setSubQuestionsPartOne] = useState([]);
  const [contentPartOne, setContentPartOne] = useState(null);
//   const [resSpeakingPartTwo, setResSpeakingPartTwo] = useState();
  const [contentPartTwo, setContentPartTwo] = useState(null);
  const [subQuestionsPartTwo, setSubQuestionsPartTwo] = useState([]);
//   const [resSpeakingPartThree, setResSpeakingPartThree] = useState();
  const [contentPartThree, setContentPartThree] = useState(null);
  const [subQuestionsPartThree, setSubQuestionsThree] = useState([]);
//   const [resSpeakingPartFour, setResSpeakingPartFour] = useState();
  const [contentPartFour, setContentPartFour] = useState(null);
  const [subQuestionsPartFour, setSubQuestionsPartFour] = useState([]);

  useEffect(() => {
    const SpeakingPartOne = testBankData.speaking.part1[RES_DATA];
    const SpeakingPartTwo = testBankData.speaking.part2[RES_DATA];
    const SpeakingPartThree = testBankData.speaking.part3[RES_DATA];
    const SpeakingPartFour = testBankData.speaking.part4[RES_DATA];

    // setResSpeakingPartFour(SpeakingPartFour);
    setContentPartFour(SpeakingPartFour?.questions[RES_DATA]);

    setSubQuestionsPartFour(SpeakingPartFour?.questions[RES_DATA].subQuestion);

    // setResSpeakingPartThree(SpeakingPartThree);
    setContentPartThree(SpeakingPartThree?.questions[RES_DATA]);

    setSubQuestionsThree(SpeakingPartThree?.questions[RES_DATA].subQuestion);

    // setResSpeakingPartTwo(SpeakingPartTwo);
    setContentPartTwo(SpeakingPartTwo?.questions[RES_DATA]);

    setSubQuestionsPartTwo(SpeakingPartTwo?.questions[RES_DATA].subQuestion);
    // setResSpeakingPartOne(SpeakingPartOne);
    setContentPartOne(SpeakingPartOne?.questions);
    setSubQuestionsPartOne(SpeakingPartOne?.questions[RES_DATA].subQuestion);
  }, [testBankData]);

  const renderPartOne = () => (
    <FrameReadingResult defaultWidth={true}>
      <div className="flex flex-col gap-8">
        <div className="font-bold text-[17px]">
          {contentPartOne && contentPartOne[0].content}
        </div>
        {subQuestionsPartOne.length > 0 &&
          subQuestionsPartOne.map((item, index) => {
            return (
              <div key={index}>
                <div className="lrn_stimulus_content lrn_clearfix lrn_question mb-5">
                  <b>
                    {index + 11}. {item.content}
                  </b>
                </div>

                {item.responseUser ? (
                  <div style={{ marginTop: "20px" }}>
                    <audio
                      controls
                      src={item.responseUser}
                      className="w-full max-w-lg bg-white rounded-lg p-2 shadow-lg outline-none custom-audio"
                    ></audio>

                    {/* <a
							href={item.responseUser}
							download="recording.mp3"
							style={{ display: 'block', marginTop: '10px' }}
						>
							Tải xuống
						</a> */}
                  </div>
                ) : (
                  <audio
                    controls
                    src="#"
                    className="w-full max-w-lg bg-white rounded-lg p-2 shadow-lg outline-none custom-audio"
                  ></audio>
                )}
              </div>
            );
          })}
      </div>
      <></>
    </FrameReadingResult>
  );

  const renderPartTwo = () => (
    <FrameReadingResult defaultWidth={true}>
      <div className="flex flex-col gap-8">
        <div className="font-bold text-[17px]">
          {contentPartTwo && contentPartTwo.content}
        </div>
        {subQuestionsPartTwo.length > 0 &&
          subQuestionsPartTwo.map((item, index) => {
            return (
              <div key={index}>
                <div className="lrn_stimulus_content lrn_clearfix lrn_question mb-5">
                  <b>
                    {index + 1}. {item.content}
                  </b>
                </div>
                <div>
                  {index === 0 && contentPartTwo && (
                    <img
                      src={
                        contentPartTwo.image && contentPartTwo?.image[0]?.path
                      }
                    />
                  )}
                </div>

                {item.responseUser ? (
                  <div style={{ marginTop: "20px" }}>
                    <audio
                      controls
                      src={item.responseUser}
                      className="w-full max-w-lg bg-white rounded-lg p-2 shadow-lg outline-none custom-audio"
                    ></audio>
                  </div>
                ) : (
                  <audio
                    controls
                    src="#"
                    className="w-full max-w-lg bg-white rounded-lg p-2 shadow-lg outline-none custom-audio"
                  ></audio>
                )}
              </div>
            );
          })}
      </div>
      <></>
    </FrameReadingResult>
  );
  const renderPartThree = () => (
    <FrameReadingResult defaultWidth={true}>
      <div className="flex flex-col gap-8">
        <div className="font-bold text-[17px]">
          {contentPartThree && contentPartThree.content}
        </div>
        {subQuestionsPartThree.length > 0 &&
          subQuestionsPartThree.map((item, index) => {
            return (
              <div key={index}>
                <div className="lrn_stimulus_content lrn_clearfix lrn_question mb-5">
                  <b>
                    {index + 1}. {item.content}
                  </b>
                </div>
                <div>
                  {index === 0 && contentPartThree && (
                    <div className="flex gap-2">
                      <div>
                        <img
                          src={
                            contentPartThree.image &&
                            contentPartThree?.image[0]?.path
                          }
                        />
                      </div>

                      <div>
                        <img
                          src={
                            contentPartThree.image &&
                            contentPartThree?.image[1]?.path
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>

                {item.responseUser ? (
                  <div style={{ marginTop: "20px" }}>
                    <audio
                      controls
                      src={item.responseUser}
                      className="w-full max-w-lg bg-white rounded-lg p-2 shadow-lg outline-none custom-audio"
                    ></audio>
                  </div>
                ) : (
                  <audio
                    controls
                    src="#"
                    className="w-full max-w-lg bg-white rounded-lg p-2 shadow-lg outline-none custom-audio"
                  ></audio>
                )}
              </div>
            );
          })}
      </div>
      <></>
    </FrameReadingResult>
  );
  const renderPartFour = () => (
    <FrameReadingResult defaultWidth={true}>
      <div className="flex flex-col gap-6">
        <div className="font-bold text-[17px]">
          {contentPartFour && contentPartFour.content}
        </div>
        {subQuestionsPartFour.length > 0 &&
          subQuestionsPartFour.map((item, index) => {
            return (
              <div key={index}>
                <div className="lrn_stimulus_content lrn_clearfix lrn_question mb-5">
                  <b>
                    {index + 11}. {item.content}
                  </b>
                </div>

                {/* {item.responseUser && (
                  <div style={{ marginTop: "20px" }}>
                    <audio
                      controls
                      src={item.responseUser}
                      className="w-full max-w-lg bg-white rounded-lg p-2 shadow-lg outline-none custom-audio"
                    ></audio>
                  </div>
                )} */}
              </div>
            );
          })}

        <div style={{ marginTop: "20px" }}>
          <audio
            controls
            src={subQuestionsPartFour[0]?.responseUser}
            className="w-full max-w-lg bg-white rounded-lg p-2 shadow-lg outline-none custom-audio"
          ></audio>
        </div>
      </div>
      <></>
    </FrameReadingResult>
  );

  return (
    <div
		className="bg-[#f8f9fa] flex flex-col gap-10 md:w-[calc(100vw-var(--sidebar-width))]"
		style={{ "--sidebar-width": !isShowResult ? "270px" : "358px" }}
    >
      {numberLession === 1 && renderPartOne()}
      {numberLession === 2 && renderPartTwo()}
      {numberLession === 3 && renderPartThree()}
      {numberLession === 4 && renderPartFour()}
    </div>
  );
};

export default ResultTestSpeaking;
