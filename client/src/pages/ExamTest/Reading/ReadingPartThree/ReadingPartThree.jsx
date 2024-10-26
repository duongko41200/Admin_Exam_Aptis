import { Box } from '@mui/material';
import './ReadingPartThree.css';
import React, { useState } from 'react';
import {
	DragDropContext,
	Droppable,
	Draggable,
} from 'react-beautiful-dnd';

import DragHandleIcon from '@mui/icons-material/DragHandle';

const initialItems = [
	{
		id: '1',
		content: `For this reason it is easy for them to take a wrong turn and get lost.`,
	},
	{
		id: '2',
		content:
			'For this reason it is easy for them to take a wrong turn and get lost.22 2',
	},
	{
		id: '3',
		content:
			'For this reason it is easy for them to take a wrong turn and get lost.333',
	},
	{
		id: '4',
		content:
			'For this reason it is easy for them to take a wrong turn and get lost.44',
	},
	{
		id: '5',
		content:
			'For this reason it is easy for them to take a wrong turn and get lost.55',
	},
];

const ReadingPartThree = () => {
	const [column1, setColumn1] = useState(Array(5).fill(null)); // Khởi tạo 3 ô trống
	const [column2, setColumn2] = useState(initialItems);
	const [pointActive, setPointActive] = useState(null);

	const onDragEnd = (result) => {
		const { source, destination } = result;

		if (!destination) {
			return; // Không có vị trí đích
		}

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
		setPointActive(null);
	};

	const onDragStart = (start) => {
		console.log('start', start);
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
				setPointActive(newColumn1[targetIndex].id);
			} else {
				setPointActive(null);
				console.log('newColumn1[targetIndex]', newColumn1[targetIndex]);
			}
		}

		if (
			source.droppableId.startsWith('droppable-') &&
			destination.droppableId.startsWith('droppable-')
		) {
			console.log('source.droppableId', source.droppableId);
			const targetIndex = parseInt(
				destination.droppableId.split('-')[1]
			);
			const newColumn1 = [...column1];
			if (newColumn1[targetIndex]) {
				// Đưa item hiện tại trong ô đích trở lại cột 2
				setPointActive(newColumn1[targetIndex].id);
			} else {
				setPointActive(null);
				console.log('newColumn1[targetIndex]', newColumn1[targetIndex]);
			}
		}
	};

	return (
		<>
			<Box>
				<Box sx={{ fontWeight: '400', fontSize: '16px' }}>
					<strong>
						The sentences below are from a report. Put the sentences in
						the right order. The first sentence is done for you.&nbsp;
					</strong>
				</Box>
				<DragDropContext
					onDragEnd={onDragEnd}
					onDragStart={onDragStart}
					onDragUpdate={onDragUpdate}
				>
					<Box
						sx={{
							border:
								'1px solid var(--secondary-400, #b0b0b0) !important',
							display: 'flex',
							maxWidth: 'fit-content',
							marginTop: '1rem',
						}}
					>
						{/* Box Left  */}
						<Box className=" box-left">
							<Droppable droppableId="column1">
								{(provided) => (
									<Box
										ref={provided.innerRef}
										{...provided.droppableProps}
										className="w-1/1    rounded"
										sx={{
											display: 'flex',
											flexDirection: 'column',
											gap: 4,
											height: '600px',
										}}
									>
										<Box
											sx={{
												maxWidth: '400px',
											}}
										>
											<Box
												sx={{
													fontFamily: 'Inter, sans-serif !important',
													fontSize: '15px',
												}}
											>
												<strong>Signs on the coast road</strong>
											</Box>
											<Box>
												<p className="m-0">
													This report gives information about the
													traffic problems on the coast road.
												</p>
											</Box>
										</Box>
										{column1.map((item, index) => (
											<Droppable
												key={`droppable-${index}`}
												droppableId={`droppable-${index}`}
												direction="vertical"
											>
												{(provided) => (
													<Box
														ref={provided.innerRef}
														{...provided.droppableProps}
														className="bg-white border rounded min-h-[50px] flex items-center justify-center"
														sx={{
															width: '400px',
															maxWidth: '400xx',
															minHeight: '2.5em',
															backgroundColor: '#F4F6F9',
															borderRadius: '2px',
															position: 'relative',
														}}
													>
														{item && item.id !== pointActive ? (
															<Draggable
																key={item.id}
																draggableId={item.id}
																index={index}
																direction="vertical"
															>
																{(provided) => (
																	<Box
																		sx={{
																			width: '400px',
																			border: '2px dashed #939393',
																			minHeight: '2.5em',
																			backgroundColor: '#F4F6F9',
																			borderRadius: '2px',
																			padding: '5px',
																			fontSize: '14px',

																			position: 'absolute',
																			padding: '5px',
																			fontSize: '14px',
																		}}
																		ref={provided.innerRef}
																		{...provided.draggableProps}
																		{...provided.dragHandleProps}
																	>
																		{item.content}
																	</Box>
																)}
															</Draggable>
														) : (
															<Box
																sx={{
																	width: '100%',
																	height: '100%',
																	maxWidth: '400xx',
																	border: '2px dashed #939393',
																	minHeight: '50px',
																	backgroundColor: '#F4F6F9',
																	borderRadius: '2px',
																	position: 'absolute',
																	padding: '5px',
																	fontSize: '14px',
																}}
															>
																{item?.content}
															</Box>
														)}
														{provided.placeholder}
													</Box>
												)}
											</Droppable>
										))}
										{provided.placeholder}
									</Box>
								)}
							</Droppable>
						</Box>

						{/* box right */}
						<Box
							className="colum-right"
							sx={{
								backgroundColor: '#F4F6F9',
								minWidth: '279px',
								height: 'auto',
								padding: '14px',
								overflow: 'hidden',
								maxWidth: '279px',
								display: 'flex',
								flexDirection: 'column',
								gap: '0.5rem',
							}}
						>
							{/* // box element */}

							{/* //Draggable items */}
							<Droppable droppableId="column2" direction="horizontal">
								{(provided) => (
									<div
										ref={provided.innerRef}
										{...provided.droppableProps}
										className="w-1/1 h-full  rounded"
									>
										{column2.map((item, index) => (
											<Draggable
												key={item.id}
												draggableId={item.id}
												index={index}
												direction="vertical"
											>
												{(provided) => (
													<div
														ref={provided.innerRef}
														{...provided.draggableProps}
														{...provided.dragHandleProps}
														className="border border-gray-200 my-1 bg-white rounded"
													>
														<Draggable
															key={item.id}
															draggableId={item.id}
															index={index}
															direction="vertical"
														>
															{(provided) => (
																<Box
																	sx={{
																		width: '250px',
																		height: '100px',
																		border: '1px solid #939393',
																		backgroundColor: '#fff',
																		borderRadius: '2px',
																	}}
																>
																	<Box sx={{ textAlign: 'center' }}>
																		<DragHandleIcon />
																	</Box>

																	<Box
																		sx={{
																			textAlign: 'left',
																			fontSize: '14px',
																			padding: '7px 9px',
																		}}
																	>
																		{item.content}
																	</Box>
																</Box>
															)}
														</Draggable>
														{provided.placeholder}
													</div>
												)}
											</Draggable>
										))}
										{provided.placeholder}
									</div>
								)}
							</Droppable>
						</Box>
					</Box>
				</DragDropContext>
			</Box>
		</>
	);
};

export default ReadingPartThree;
