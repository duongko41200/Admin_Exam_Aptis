"use strict";

import { model, Schema, Types } from "mongoose";

const DOCUMENT_NAME = "ClassRoom";
const COLLECTION_NAME = "ClassRooms";

const classRoomSchema = new Schema(
  {
    nameRoom: { type: String, required: true, trim: true },
    dateStart: { type: String, required: true },
    dateEnd: { type: String, required: true },

    assignments: [
      {
        assignmentId: {
          type: Types.ObjectId,
          ref: "Assignment",
          required: true,
        },
        datePublic: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

export default model(DOCUMENT_NAME, classRoomSchema);
