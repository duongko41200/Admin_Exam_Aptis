"use strict";

import { model, Schema, Types } from "mongoose";

const DOCUMENT_NAME = "Assignment";
const COLLECTION_NAME = "Assignments";

const assignmentSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String },
    dueDate: {
      type: String,
      required: true,
      description: "Deadline for the assignment",
    },
    timeStamp: { type: Number, default: () => Date.now() },

    skill: {
      type: String,
      enum: ["listening", "speaking", "reading", "writing"],
      required: true,
    },
    partOfSkill: { type: Number, required: true },
    idQues: [{ type: String, required: true }],
    status: { type: String, enum: ["pending", "done"], default: "pending" },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);
const AssignmentModel = model(DOCUMENT_NAME, assignmentSchema);
export default AssignmentModel;
