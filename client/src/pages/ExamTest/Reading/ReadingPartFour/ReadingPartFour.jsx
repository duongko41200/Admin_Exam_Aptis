import { Box, Button, Typography } from '@mui/material';
import './ReadingPartFour.css';
import React, { useState } from 'react';
import {
	DragDropContext,
	Droppable,
	Draggable,
} from 'react-beautiful-dnd';

const initialItems = [
	{ id: '0', content: 'Item 1' },
	{ id: '1', content: 'Item 2' },
	{ id: '2', content: 'Item 3' },
];

const ReadingPartFour = () => {
	const [column1, setColumn1] = useState(Array(3).fill(null)); // Khởi tạo 3 ô trống
	const [column2, setColumn2] = useState(initialItems);
	const [pointActive, setPointActive] = useState(null);

	const onDragEnd = (result) => {
		const { source, destination } = result;

		if (!destination) return; // Không có vị trí đích

		// Nếu kéo từ cột 2 sang cột 1
		if (
			source.droppableId === 'column2' &&
			destination.droppableId.startsWith('droppable-')
		) {
			const newColumn1 = [...column1];
			const newColumn2 = [...column2];
			const targetIndex = parseInt(
				destination.droppableId.split('-')[1]
			);

			// Nếu ô đích không trống
			if (newColumn1[targetIndex]) {
				// Đưa item hiện tại trong ô đích trở lại cột 2
				newColumn2.push(newColumn1[targetIndex]);

				const param = {
					id: newColumn1[targetIndex].id,
					content: newColumn1[targetIndex].content,
				};

				console.log('param', param);
			}

			// Thay thế nội dung ở cột 1
			newColumn1[targetIndex] = newColumn2[source.index];
			newColumn2.splice(source.index, 1); // Xóa item từ cột 2
			setColumn1(newColumn1);
			setColumn2(newColumn2);
		}

		// Nếu kéo từ cột 1 về cột 2
		if (
			source.droppableId.startsWith('droppable-') &&
			destination.droppableId === 'column2'
		) {
			const newColumn1 = [...column1];
			const newColumn2 = [...column2];
			const targetIndex = parseInt(source.droppableId.split('-')[1]);

			// Đặt lại ô ở cột 1
			newColumn2.push(newColumn1[targetIndex]);
			newColumn1[targetIndex] = null; // Đặt lại giá trị
			setColumn1(newColumn1);
			setColumn2(newColumn2);
		}

		// Nếu kéo trong cùng cột 1
		if (
			source.droppableId.startsWith('droppable-') &&
			destination.droppableId.startsWith('droppable-')
		) {
			const newColumn1 = [...column1];
			const sourceIndex = parseInt(source.droppableId.split('-')[1]);
			const destinationIndex = parseInt(
				destination.droppableId.split('-')[1]
			);

			// Hoán đổi vị trí
			const temp = newColumn1[sourceIndex];
			newColumn1[sourceIndex] = newColumn1[destinationIndex];
			newColumn1[destinationIndex] = temp;

			setColumn1(newColumn1);
		}
	};

	const onDragUpdate = (result) => {
		const { source, destination } = result;
		console.log('result', result);
		// Nếu kéo từ cột 2 sang cột 1
		if (
			source.droppableId === 'column2' &&
			destination.droppableId.startsWith('droppable-')
		) {
			const newColumn1 = [...column1];
			const newColumn2 = [...column2];
			const targetIndex = parseInt(
				destination.droppableId.split('-')[1]
			);

			// Nếu ô đích không trống
			if (newColumn1[targetIndex]) {
				// Đưa item hiện tại trong ô đích trở lại cột 2
				newColumn2.push(newColumn1[targetIndex]);

				const param = {
					id: newColumn1[targetIndex].id,
					content: newColumn1[targetIndex].content,
				};

				console.log('param', param);
				setPointActive(newColumn1[targetIndex].id);
			} else {
				setPointActive(null);
				console.log('newColumn1[targetIndex]', newColumn1[targetIndex]);
			}
		}
	};

	return (
		<div className="flex justify-center p-5">
			<DragDropContext
				onDragEnd={onDragEnd}
				onDragUpdate={onDragUpdate}
			>
				<Droppable droppableId="column1" direction="horizontal">
					{(provided) => (
						<div
							ref={provided.innerRef}
							{...provided.droppableProps}
							className="w-1/3 border border-gray-300 p-2 m-2 rounded"
						>
							<h2 className="text-lg font-bold">Column 1</h2>
							{column1.map((item, index) => (
								<Droppable
									key={`droppable-${index}`}
									droppableId={`droppable-${index}`}
								>
									{(provided) => (
										<div
											ref={provided.innerRef}
											{...provided.droppableProps}
											className="border border-gray-200 p-2 my-1 bg-white relative rounded min-h-[50px] flex items-center justify-center"
										>
											{item && item.id !== pointActive ? (
												<Draggable
													key={item.id}
													draggableId={item.id}
													index={index}
												>
													{(provided) => (
														<div
															ref={provided.innerRef}
															{...provided.draggableProps}
															{...provided.dragHandleProps}
															className={`w-full h-full border border-gray-200 p-2 bg-white rounded absolute ${
																item.id === pointActive
																	? 'opacity-10'
																	: ' '
															} top-0 left-0 tranform-none`}
														>
															{item.content}
														</div>
													)}
												</Draggable>
											) : (
												<Box className="text-gray-400 absolute w-full h-full flex justify-center items-center">
													<Box> {item?.content}</Box>
												</Box>
											)}
											{provided.placeholder}
										</div>
									)}
								</Droppable>
							))}
							{provided.placeholder}
						</div>
					)}
				</Droppable>
				<Droppable droppableId="column2">
					{(provided) => (
						<div
							ref={provided.innerRef}
							{...provided.droppableProps}
							className="w-1/3 border border-gray-300 p-2 m-2 rounded"
						>
							<h2 className="text-lg font-bold">Column 2</h2>
							{column2.map((item, index) => (
								<Draggable
									key={item.id}
									draggableId={item.id}
									index={index}
								>
									{(provided) => (
										<div
											ref={provided.innerRef}
											{...provided.draggableProps}
											{...provided.dragHandleProps}
											className="border border-gray-200 p-2 my-1 bg-white rounded"
										>
											{item.content}
										</div>
									)}
								</Draggable>
							))}
							{provided.placeholder}
						</div>
					)}
				</Droppable>
			</DragDropContext>
		</div>
	);
};

export default ReadingPartFour;
