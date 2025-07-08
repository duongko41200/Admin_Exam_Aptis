"use strict";

import { model, Schema, Types } from "mongoose";

const DOCUMENT_NAME = "Assignment";
const COLLECTION_NAME = "Assignments";

const assignmentSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: false, default: null },
    dueDate: {
      type: String,
      required: false,
      description: "Deadline for the assignment",
      default: null,
    },
    MaBoDe: { type: Types.ObjectId, required: true, ref: "TestBank" },

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
