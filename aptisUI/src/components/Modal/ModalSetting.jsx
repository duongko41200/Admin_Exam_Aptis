import { memo, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import {
  SET_IS_COUNTDOWN,
  SET_IS_MODAL_SETTING,
  SET_IS_ZOOM_SUGGESTION,
} from "../../store/general";
import SwitchToggle from "../Toggle/SwitchToggle";
import {
  SET_CHECK_RESULT,
  SET_IS_SHOW_FULL_QUESTION,
  SET_PLAY_RECORD,
} from "../../store/taiLieu";

const ModalSetting = ({ isSpeakingTaiLieu }) => {
  const dispatch = useDispatch();

  const [isCheckedCountdown, setIsCheckedCountdown] = useState(true);
  const [isCheckedZoom, setIsCheckedZoom] = useState(false);
  const [isCheckedResult, setIsCheckedResult] = useState(false);
  const { isPlayRecord } = useSelector((state) => state.generalStore);
  const { isModalSetting } = useSelector((state) => state.generalStore);
  const { currentSkillName } = useSelector((state) => state.taiLieuStore);
  const { isShowFullQuestion } = useSelector((state) => state.taiLieuStore);

  const handleCheckboxChange = () => {
    setIsCheckedCountdown(!isCheckedCountdown);
    dispatch(SET_IS_COUNTDOWN(!isCheckedCountdown));
    dispatch(SET_PLAY_RECORD(!isPlayRecord));
  };
  const handleCheckboxChangeZoom = () => {
    setIsCheckedZoom(!isCheckedZoom);
    dispatch(SET_IS_ZOOM_SUGGESTION(!isCheckedZoom));
  };
  const handleCheckResult = () => {
    if (currentSkillName == "speaking" && isSpeakingTaiLieu) {
      dispatch(SET_IS_SHOW_FULL_QUESTION(!isShowFullQuestion));
    }
    setIsCheckedResult(!isCheckedResult);
    dispatch(SET_CHECK_RESULT(!isCheckedResult));
  };

  const closeModelList = () => {
    dispatch(SET_IS_MODAL_SETTING(false));
  };

  return (
    <div>
      {isModalSetting && (
        <div>
          <div
            className=" fixed top-[0.675rem] left-[0.675rem] w-[21rem] md:w-[20rem] 2xl:w-[30rem] h-[calc(100%-0.675rem*3-3.75rem)] 
  bg-white border border-[#f8f8f8] shadow-[0_0_20px_2px_var(--primary-100,#cbcdf4)] 
  rounded-md p-[0.675rem] overflow-auto overflow-x-hidden z-[1000] bg-gray-50"
          >
            <div className="w-full mb-[2rem] h-[45px] flex justify-between items-center">
              <div className="text-2xl text-[#161616]  sans-serif  text-[#161616] font-bold">
                SETTING
              </div>
              <div
                className="w-[50px] h-[50px] border border-[#0000001f] flex justify-center items-center rounded-[6px] cursor-pointer hover:bg-[#f4f4f5]"
                onClick={closeModelList}
              >
                <div className="text-xl font-medium">X</div>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between gap-4 rounded-lg border border-black border-dashed dark:border-dark-strokes font-sans p-4 shadow-sm text-gray-600 text-md">
                <div> Bật/Tắt thời gian</div>

                <div>
                  <SwitchToggle
                    handleCheckboxChange={handleCheckboxChange}
                    isChecked={isCheckedCountdown}
                  />{" "}
                </div>
              </div>
              <div className="flex justify-between gap-4 rounded-lg border border-black border-dashed dark:border-dark-strokes p-4 font-sans shadow-sm text-gray-600 text-md">
                <div>Phóng to khung gợi ý </div>

                <div>
                  <SwitchToggle
                    handleCheckboxChange={handleCheckboxChangeZoom}
                    isChecked={isCheckedZoom}
                  />{" "}
                </div>
              </div>
              <div className="flex justify-between gap-4 rounded-lg border border-black border-dashed dark:border-dark-strokes p-4 font-sans shadow-sm text-gray-600 text-md">
                <div>Auto check đáp án </div>

                <div>
                  <SwitchToggle
                    handleCheckboxChange={handleCheckResult}
                    isChecked={isCheckedResult}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(ModalSetting);
