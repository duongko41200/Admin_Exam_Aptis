import mongoose, { Schema } from 'mongoose';

// SubLecture Schema (refactored)
const subLectureSchema = new Schema(
	{
		subLectureTitle: {
			type: String,
			required: true, // Ensures sub-lecture always has a title
		},
		summaryLecture: {
			type: String,
			required: false, // Optional field for a short description of the sub-lecture
		},
		note: {
			type: String,
			required: false, // Optional field for additional notes
		},

		durationInMinutes: {
			type: Number, // Duration in minutes (a more precise unit of time)
			required: false, // It's expected to be provided
			min: 0, // Duration cannot be negative

			default: 0, // Default to 0 if not specified
		},
		videoUrl: {
			type: String,
			required: false, // Optional URL for the video related to this sub-lecture
			//   match: /^https?:\/\/.*\.(mp4|webm|ogg)$/i, // Basic validation for video URL format
		},

		isPreviewFree: {
			type: Boolean,
			default: false, // Default to false if not specified (i.e., not free preview)
		},
	},
	{ _id: false } // No need for an _id field in the sub-lecture schema itself
);

// Main Lecture Schema (refactored)
const lectureSchema = new Schema(
	{
		lectureTitle: {
			type: String,
			required: true, // Title is mandatory
		},
		lectureDescription: {
			type: String,
			required: false, // Optional field for a detailed lecture description
		},
		numberLecture: {
			type: Number, // Represents the order of the sub-lecture in the main lecture
			required: true, // Ensures this field is always provided
			min: 1, // Minimum value is 1 (first sub-lecture)
		}, // Represents the order of the sub-lecture in the main lecture
		lectureType: {
			type: String, // Represents the type/category of the lecture (e.g., "Theory", "Practical", etc.)
			// enum: ['Theory', 'Practical', 'Review', 'Exercise'], // Example of acceptable types
			required: true, // Optional field
		},
		subLectures: [subLectureSchema], // Embedded array of sub-lectures
	},
	{ timestamps: true } // Automatically manage createdAt and updatedAt timestamps
);

export const LecturesModel = mongoose.model('Lecture', lectureSchema);
