import React from 'react';
import './SpinnerLoading.css';
function SpinnerLoading({ show, children }) {
	return (
		<>
			<div className="relative min-h-[520px]">
				{show === true && (
					<>
						<div className=" absolute w-full h-full flex justify-center bg-white opacity-50 items-center z-10"></div>

						<div className=" absolute w-full h-full flex justify-center items-center z-10">
							<div className="loader"> </div>
						</div>
					</>
				)}
				{children}
			</div>
		</>
	);
}

export default SpinnerLoading;
