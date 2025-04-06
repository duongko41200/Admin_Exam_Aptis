import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
	{
		courseTitle: {
			type: String,
			required: true,
		},
		subTitle: { type: String, required: false },
		description: { type: String, required: false },

		courseType: {
			type: String, // the loai khoa hoc
			required: true,
		},

		courseThumbnail: {
			type: String,
			default: null,
		},
		enrolledStudentsRole: { // ma khoa hoc co the luu ma khoa hocj bang id
			type: Number,
			default: 0,
		},
		lectures: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Lecture',
			},
		],

		isPublished: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

export const CourseModel = mongoose.model('Course', courseSchema);
