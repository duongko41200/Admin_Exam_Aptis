import { useSelector } from "react-redux";
import TextareaInput from "../../../../components/TextareaAutosize/TextareaAutosize";
import "../../Reading/ExamReading.css";

const WritingPartThree = () => {
  const currentWritingData = useSelector(
    (state) => state.writingStore.currentWritingData
  );

  return (
    <div>
      <div className="lrn_stimulus_content lrn_clearfix lrn_question mb-5">
        <b>{currentWritingData?.content}</b>
      </div>
      <div className="lrn_response_innerbody lrn-response-validate-wrapper">
        <div className="lrn_response_input"></div>

        <div className="flex justify-start flex-col gap-4">
          {currentWritingData.subQuestions &&
            currentWritingData.subQuestions.map((item, index) => {
              return (
                <div className="flex flex-col gap-2" key={index}>
                  <div>
                    <div>
                      <div className="text-md  w-fit md:w-[500px]">
                        {index + 1}. {item.content ? item.content : ".........."}
                      </div>
                    </div>
                  </div>
                  <div>
                    <TextareaInput>
                      <textarea
                        className=" text-md text-bold font-normal w-full leading-normal p-3 rounded-xl rounded-br-none  focus:shadow-outline-purple dark:focus:shadow-outline-purple focus:shadow-lg border border-solid border-slate-300 hover:border-slate-500 dark:hover:border-purple-500 focus:border-slate-500 dark:focus:border-purple-500 dark:border-slate-600  dark:bg-slate-900 text-bold dark:text-slate-300 focus-visible:outline-0 div-border p-[17px] bg-[#f8f8f8] font-sans placeholder:text-black placeholder:text-lg"
                        aria-label="empty textarea"
                        placeholder="Type your answer here"
                        disabled
                      />
                    </TextareaInput>
                    <div className="text-right p-2 font-medium">
                      Word: 0 /64
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default WritingPartThree;
