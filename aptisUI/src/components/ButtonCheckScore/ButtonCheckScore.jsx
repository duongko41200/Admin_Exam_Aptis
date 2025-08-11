
const ButtonCheckScore = ({ checkAIScore }) => {
  return (
    <div className="flex flex-col mt-2 gap-4 p-2 w-full">
      <div
        className="h-[60px] w-full shadow-[3px 3px 4px 0px rgba(0, 0, 0, 0.2)] border flex justify-center items-center bg-[#007A7A] text-white font-bold text-lg rounded-md cursor-pointer hover:bg-[#146868]"
        onClick={checkAIScore}
      >
        <div>Chấm Điểm AI</div>
      </div>
      <div className="min-h-[100px] w-full h-fit border bg-[#FAFAFA] flex flex-col font-bold text-lg rounded-md">
        {[
          "Nhận đánh giá chi tiết từ AI",
          "Nhận bài chữa mẫu AI",
          "Tìm & sửa lỗi ngữ pháp",
          "Chấm sát với form của Aptis",
          'Goi y cach cai thien',
        ].map((text, index) => (
          <div key={index} className="flex p-2 text-[14px] gap-4 font-sans font-semibold items-center">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="text-green-600 w-5 h-5 stroke-2"
              >
                <path d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <div>{text}</div>
          </div>
        ))}

      </div>
    </div>
  );
};

export default ButtonCheckScore;
