"use client";

import { getGeminiAiCheck } from "@/services/AI/Gemini";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RES_DATA } from "../../../../../../Constant/global";
import ButtonCheckScore from "../../../../../components/ButtonCheckScore/ButtonCheckScore";
import FrameReadingResult from "../../../../../components/FrameReadingResult/FrameReadingResult";
import TextareaInput from "@/app/components/TextareaAutosize/TextareaAutosize";

export default function RenderPartTwo() {
  const testBankData = useSelector((state) => state.testBankStore.testBankData);

  const [resWritingPartTwo, setResWritingPartTwo] = useState();
  const [contentPartTwo, setContentPartTwo] = useState();

  // const dispatch = useDispatch();

  const checkAIScore = async () => {
    // setIsLoading(true);

    try {
      const callAI = await getGeminiAiCheck();

      let data = [];

      console.log({ callAI });

      for (const key in callAI) {
        data.push(callAI[key]);
      }

      console.log({ data });
      // setResponseAI(data);
      //setIsLoading(false);
    } catch (error) {
      ////setIsLoading(false);
      console.log({ error });
    }
  };

  useEffect(() => {
    const writingPartTwo = testBankData.writing.part2[RES_DATA];

    setResWritingPartTwo(writingPartTwo?.questions[RES_DATA].subQuestion);
    setContentPartTwo(writingPartTwo?.questions[RES_DATA].content);
  }, [testBankData]);
  return (
    <>
      {contentPartTwo && (
        <FrameReadingResult percentage={50}>
          <div>
            <div className="lrn_stimulus_content lrn_clearfix lrn_question mb-5">
              <b>{contentPartTwo}</b>
            </div>
            <div className="lrn_response_innerbody lrn-response-validate-wrapper">
              <div className="lrn_response_input"></div>

              <div className="flex justify-start flex-col gap-6">
                <div>
                  <div>
                    <div>
                      <p>{resWritingPartTwo && resWritingPartTwo[0].content}</p>
                    </div>
                  </div>
                  <div>
                    <TextareaInput>
                      <textarea
                        className=" text-md text-bold font-normal w-full min-h-[200px] leading-normal p-3 rounded-xl rounded-br-none  focus:shadow-outline-purple dark:focus:shadow-outline-purple focus:shadow-lg border border-solid border-slate-300 hover:border-slate-500 dark:hover:border-purple-500 focus:border-slate-500 dark:focus:border-purple-500 dark:border-slate-600 dark:bg-slate-900 text-bold dark:text-slate-300 focus-visible:outline-0 div-border p-[17px] bg-[#f8f8f8] font-sans placeholder:text-black placeholder:text-lg"
                        aria-label="empty textarea"
                        placeholder="Type your answer here"
                        defaultValue={
                          resWritingPartTwo && resWritingPartTwo[0].responseUser
                        }
                        disabled
                      />
                    </TextareaInput>
                    {/* <div
									sx={{
										textAlign: 'end',
										padding: '10px',
										fontWeight: '500',
									}}
								>
									Word:
									{resWritingPartTwo[0].responseUser
										? resWritingPartTwo[0].responseUser.split(' ')
												.length
										: 0}
									/45
								</div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <ButtonCheckScore checkAIScore={checkAIScore} />
          </div>
        </FrameReadingResult>
      )}
    </>
  );
}
