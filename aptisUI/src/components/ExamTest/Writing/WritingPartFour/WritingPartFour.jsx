import { useState } from "react";
import { useSelector } from "react-redux";
import TextareaInput from "../../../../components/TextareaAutosize/TextareaAutosize";
import "../../Reading/ExamReading.css";

const WritingPartFour = () => {
  const currentWritingData = useSelector(
    (state) => state.writingStore.currentWritingData
  );

  const [subTitle, setSubTitle] = useState(null);
  const [result1, setResult1] = useState([]);
  const [result2, setResult2] = useState([]);

  return (
    <div>
      <div className="lrn_stimulus_content lrn_clearfix lrn_question mb-5 flex flex-col gap-2">
        <div
          className="m-0"
          dangerouslySetInnerHTML={{
            __html: currentWritingData?.content || "",
          }}
        />
      </div>
      <div className="lrn_response_innerbody lrn-response-validate-wrapper mt-10">
        <div className="lrn_response_input"></div>
        <div className="flex justify-start flex-col gap-4">
          {currentWritingData.subQuestions.length > 0 &&
            currentWritingData.subQuestions?.map((question, index) => (
              <div className="flex flex-col gap-2" key={index}>
                <div>
                  <div className="text-md font-bold w-fit md:w-[500px]">
                    {index + 1}.{" "}
                    {question.content ? question.content : "......"}
                  </div>
                </div>
                <div>
                  <TextareaInput>
                    <textarea
                      className="text-md text-bold font-normal w-full min-h-[200px] leading-normal p-3 rounded-xl rounded-br-none focus:shadow-outline-purple dark:focus:shadow-outline-purple focus:shadow-lg border border-solid border-slate-300 hover:border-slate-500 dark:hover:border-purple-500 focus:border-slate-500 dark:focus:border-purple-500 dark:border-slate-600 dark:bg-slate-900 text-bold dark:text-slate-300 focus-visible:outline-0 div-border p-[17px] bg-[#f8f8f8] font-sans placeholder:text-black placeholder:text-lg"
                      aria-label="empty textarea"
                      placeholder="Type your answer here"
                      onChange={(e) => handleChangeTextarea(e, index)}
                      defaultValue={question.responseUser}
                    />
                  </TextareaInput>
                  <div className="text-right p-2 font-medium">
                    Word: {index === 0 ? result1.length : result2.length}/
                    {index === 0 ? 75 : 225}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default WritingPartFour;
