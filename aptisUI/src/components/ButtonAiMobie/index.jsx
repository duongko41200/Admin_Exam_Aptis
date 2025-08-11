const ButtonAiMobie = ({ children, showModalAiScore }) => {
	return (
    <div
      className="md:hidden fixed bottom-[6rem] right-4 flex items-center justify-center bg-gray-300 border border-2 border-opacity-50 border-gray-400 bg-opacity-20 z-10 w-[45px] h-[45px] p-4 rounded-lg shadow-lg text-opacity-50 text-gray-800 hover:bg-white hover:border-[#45368f] hover:text-[#45368f] opacity-100 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
      onClick={showModalAiScore}
    >
      <div className="border border-2  rounded-lg px-2 py-1  flex items-center border-gray-400 border-opacity-50 justify-center hover:border-[#45368f]">
        <div>{children}</div>
      </div>
    </div>
  );
};

export default ButtonAiMobie;
