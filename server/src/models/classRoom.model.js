'use strict';

import { model, Schema, Types } from 'mongoose';

const DOCUMENT_NAME = 'ClassRoom';
const COLLECTION_NAME = 'ClassRooms';

const classRoomSchema = new Schema(
	{
		nameRoom: { type: String, required: true, trim: true },
		dateStart: {
			type: String,
			required: false,
			default: null,
			description: 'Start date of the class',
		},
		dateEnd: {
			type: String,
			required: false,
			default: null,
			description: 'End date of the class',
		},

		assignments: [
			{
				assignmentId: {
					type: Types.ObjectId,
					ref: 'Assignment',
					required: false,
					default: null,
				},
				datePublic: { type: String, required: false, default: null },
			},
		],
		isPublic: { type: Boolean, default: false },
	},
	{
		timestamps: true,
		collection: COLLECTION_NAME,
	}
);
const ClassRoomModel = model(DOCUMENT_NAME, classRoomSchema);
export default ClassRoomModel;
