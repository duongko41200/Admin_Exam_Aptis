export default function LoadingDot({}) {
	return (
		<>
			<div className="flex flex-col gap-4 justify-center items-center bg-white h-screen dark:invert">
				<div className="text-xl  text-[#007A7A]">
					Đang chấm điểm...
				</div>
				<div className="flex space-x-2  text-[#007A7A]">
					<div className="h-8 w-8 bg-[#007A7A] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
					<div className="h-8 w-8 bg-[#007A7A] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
					<div className="h-8 w-8 bg-[#007A7A] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
				</div>
			</div>
		</>
	);
}
