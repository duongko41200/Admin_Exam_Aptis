"use strict";

import { model, Schema, Types } from "mongoose";

const DOCUMENT_NAME = "User";
const COLLECTION_NAME = "Users";

const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      maxLength: 150,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    idTelegram: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    identityCard: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    verfify: {
      type: Schema.Types.Boolean,
      default: false,
    },
    roles: {
      type: String,
      default: "USER",
      enum: ["USER", "TEACHER", "ADMIN"],
    },
    classRoomId: {
      type: Types.ObjectId,
      ref: "ClassRoom",
      required: false,
    },
    operationMobile: {
      type: {
        ua: { type: String },
        browser: {
          name: { type: String },
          version: { type: String },
          major: { type: String },
        },
        cpu: {
          architecture: { type: String },
        },
        device: {
          type: Object,
          default: {},
        },
        engine: {
          name: { type: String },
          version: { type: String },
        },
        os: {
          name: { type: String },
          version: { type: String },
        },
      },
      default: {} | null,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
// Virtual populate: 1 user ↔ 1 StadyProcess
userSchema.virtual("studyProcess", {
  ref: "StadyProcess",
  localField: "_id",
  foreignField: "userId",
  justOne: true,
});

export default model(DOCUMENT_NAME, userSchema);
