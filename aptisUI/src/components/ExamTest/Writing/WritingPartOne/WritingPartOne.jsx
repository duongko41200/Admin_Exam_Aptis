import { useSelector } from "react-redux";
import TextareaInput from "../../../../components/TextareaAutosize/TextareaAutosize";
import "../../Reading/ExamReading.css";

const WritingPartOne = () => {
  const currentWritingData = useSelector(
    (state) => state.writingStore.currentWritingData
  );

  return (
    <div>
      <div className="lrn_stimulus_content lrn_clearfix lrn_question mb-5">
        <div>{currentWritingData?.content}</div>
      </div>
      <div className="lrn_response_innerbody lrn-response-validate-wrapper">
        <div className="lrn_response_input"></div>

        <div className="flex justify-start flex-col gap-6">
          {currentWritingData.subQuestions &&
            currentWritingData.subQuestions.map((item, index) => {
              return (
                <div key={index}>
                  <div>
                    <div>
                      <div className="text-lg mb-1">
                        {index + 1}.{item.content ? item.content : ".........."}{" "}
                      </div>
                    </div>
                  </div>
                  <div>
                    <TextareaInput>
                      <textarea
                        className=" text-md text-bold font-normal w-full leading-normal p-2 rounded-xl rounded-br-none  focus:shadow-outline-purple dark:focus:shadow-outline-purple focus:shadow-lg border border-solid border-slate-300 hover:border-slate-500 dark:hover:border-purple-500 focus:border-slate-500 dark:focus:border-purple-500 dark:border-slate-600  dark:bg-slate-900 text-bold dark:text-slate-300 focus-visible:outline-0 div-border bg-[#f8f8f8] font-sans placeholder:text-black h-[50px] placeholder:text-[17px] text-black"
                        aria-label="empty textarea"
                        placeholder="Type your answer here"
                        disabled
                      />
                    </TextareaInput>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default WritingPartOne;
