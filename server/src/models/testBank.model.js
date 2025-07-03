import mongoose from "mongoose";

const { Schema } = mongoose;

// Define ReadingSchema (assuming you already have this schema)

// Define TestBankSchema
const testBankSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    speaking: {
      part1: {
        type: [Schema.Types.ObjectId],
        ref: "Speaking",
        required: true,
        default: [],
      },
      part2: {
        type: [Schema.Types.ObjectId],
        ref: "Speaking",
        required: true,
        default: [],
      },
      part3: {
        type: [Schema.Types.ObjectId],
        ref: "Speaking",
        required: true,
        default: [],
      },
      part4: {
        type: [Schema.Types.ObjectId],
        ref: "Speaking",
        required: true,
        default: [],
      },
    },
    listening: {
      part1: {
        type: [Schema.Types.ObjectId],
        ref: "Listening",
        required: true,
        default: [],
      },
      part2: {
        type: [Schema.Types.ObjectId],
        ref: "Listening",
        required: true,
        default: [],
      },
      part3: {
        type: [Schema.Types.ObjectId],
        ref: "Listening",
        required: true,
        default: [],
      },
      part4: {
        type: [Schema.Types.ObjectId],
        ref: "Listening",
        required: true,
        default: [],
      },
    },
    reading: {
      part1: {
        type: [Schema.Types.ObjectId],
        ref: "Reading",
        required: true,
        default: [],
      },
      part2: {
        type: [Schema.Types.ObjectId],
        ref: "Reading",
        required: true,
        default: [],
      },
      part3: {
        type: [Schema.Types.ObjectId],
        ref: "Reading",
        required: true,
        default: [],
      },
      part4: {
        type: [Schema.Types.ObjectId],
        ref: "Reading",
        required: true,
        default: [],
      },
      part5: {
        type: [Schema.Types.ObjectId],
        ref: "Reading",
        required: true,
        default: [],
      },
    },
    writing: {
      part1: {
        type: [Schema.Types.ObjectId],
        ref: "Writing",
        required: true,
        default: [],
      },
      part2: {
        type: [Schema.Types.ObjectId],
        ref: "Writing",
        required: true,
        default: [],
      },
      part3: {
        type: [Schema.Types.ObjectId],
        ref: "Writing",
        required: true,
        default: [],
      },
      part4: {
        type: [Schema.Types.ObjectId],
        ref: "Writing",
        required: true,
        default: [],
      },
    },
    classRoomId: {
      type: Schema.Types.ObjectId,
      ref: "ClassRoom",
      required: false,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: "testBanks",
  }
);

// Export ReadingSchema and TestBankSchema

export default mongoose.model("TestBank", testBankSchema);
