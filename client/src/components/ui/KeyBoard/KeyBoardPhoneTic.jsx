import React, { useState } from 'react';
import './KeyBoardPhoneTic.css';
import { IPA_CHARS } from '../../../Constant/ipa';

function KeyBoardPhoneTic({
	EnterPhoneTic,
	ClickButtonEnter,
    deletePhoneTic,
    
}) {
	return (
		<div className="flex flex-col mt-4 p-2 border shadow-md bg-gray-100 rounded-b-xl">
			<div className="flex gap-1 justify-center">
				{IPA_CHARS.slice(0, 7).map((value, idx) => {
					return (
						<div
							key={idx}
							className="bg-white rounded-md border min-w-[40px] w-fit text-center text-sm flex-1 "
							onClick={() => {
								EnterPhoneTic(value);
							}}
						>
							<div>{value}</div>
						</div>
					);
				})}
			</div>
			<div className="flex gap-1 justify-center">
				{IPA_CHARS.slice(8, 15).map((value, idx) => {
					return (
						<div
							key={idx}
							className="bg-white rounded-md border min-w-[40px] w-fit text-center text-sm flex-1 mt-1"
							onClick={() => {
								EnterPhoneTic(value);
							}}
						>
							<div>{value}</div>
						</div>
					);
				})}
			</div>
			<div className="flex gap-1 justify-center">
				{IPA_CHARS.slice(15, 22).map((value, idx) => {
					return (
						<div
							key={idx}
							className="bg-white rounded-md border min-w-[40px] w-fit text-center text-sm flex-1 mt-1"
							onClick={() => {
								EnterPhoneTic(value);
							}}
						>
							<div>{value}</div>
						</div>
					);
				})}
			</div>
			<div className="flex gap-1 justify-center">
				{IPA_CHARS.slice(22, 29).map((value, idx) => {
					return (
						<div
							key={idx}
							className="bg-white rounded-md border min-w-[40px] w-fit text-center text-sm flex-1 mt-1"
							onClick={() => {
								EnterPhoneTic(value);
							}}
						>
							<div>{value}</div>
						</div>
					);
				})}
			</div>
			<div className="flex gap-1 justify-center">
				{IPA_CHARS.slice(29, 36).map((value, idx) => {
					return (
						<div
							key={idx}
							className="bg-white rounded-md border min-w-[40px] w-fit text-center text-sm flex-1 mt-1"
							onClick={() => {
								EnterPhoneTic(value);
							}}
						>
							<div>{value}</div>
						</div>
					);
				})}
			</div>

			<div className="flex gap-1 justify-center">
				{IPA_CHARS.slice(36, 43).map((value, idx) => {
					return (
						<>
							<div
								key={idx}
								className="bg-white rounded-md border min-w-[40px] w-fit text-center text-sm flex-1 mt-1"
								onClick={() => {
									EnterPhoneTic(value);
								}}
							>
								<div>{value}</div>
							</div>
						</>
					);
				})}
			</div>

			<div className="flex gap-1 justify-between">
				{IPA_CHARS.slice(43, 45).map((value, idx) => {
					return (
						<>
							<div
								key={idx}
								className="bg-white rounded-md border min-w-[40px] w-fit text-center text-sm  flex-1 mt-1"
								onClick={() => {
									EnterPhoneTic(value);
								}}
							>
								<div>{value}</div>
							</div>
						</>
					);
				})}

				<div
					className="bg-white rounded-md border min-w-[115px] w-fit text-center text-sm flex-1 mt-1"
					onClick={() => {
						EnterPhoneTic(' ');
					}}
				>
					Space
				</div>

				<div
					className="bg-red-200 rounded-md border min-w-[60px] w-fit text-center   text-sm flex-1 mt-1"
					onClick={deletePhoneTic}
				>
					Xóa
				</div>
				<div
					className="bg-gray-200 rounded-md border min-w-[60px] w-fit text-center  text-sm flex-1 mt-1 "
					onClick={ClickButtonEnter}
				>
					Enter
				</div>
			</div>
		</div>
	);
}

export default KeyBoardPhoneTic;
