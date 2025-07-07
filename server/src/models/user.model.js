"use strict";

//!mdbgum: create model partent

import { model, Schema, Types } from "mongoose"; // Erase if already required

// Declare the Schema of the Mongo model
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
    class: {
      type: Number,
      default: null,
    },
    identityCard: {
      type: Number,
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
      type: Array,
      default: [],
    },
    classRoomId: {
      type: Types.ObjectId,
      ref: "ClassRoom",
      required: false,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

// Export the model
export default model(DOCUMENT_NAME, userSchema);
