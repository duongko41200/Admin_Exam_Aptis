"use strict";

import { model, Schema, Types } from "mongoose";

const DOCUMENT_NAME = "StadyProcess";
const COLLECTION_NAME = "StadyProcesses";

const countDetailSchema = new Schema(
  {
    id: { type: String, required: true },
    dateStart: { type: String, required: true },
    score: { type: String, required: true },
  },
  { _id: false }
);

const StudyItemSchema = new Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    numberPart: { type: Number, required: true },
    score: { type: String, required: true },
    skill: { type: String, required: true },
    count: { type: Number, required: true },
    countDetail: { type: [countDetailSchema], required: true },
    updateAt: { type: String, required: true },
  },
  { _id: false }
);

const StadyProcessSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      required: true,
      ref: "User",
    },

    processData: {
      type: [StudyItemSchema],
      required: true,
      description: "Data related to the study process",
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);
const StadyProcessModel = model(DOCUMENT_NAME, StadyProcessSchema);
export default StadyProcessModel;
