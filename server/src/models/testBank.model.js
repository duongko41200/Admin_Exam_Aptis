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
        type: [Number],
        required: true,
        default: [],
      },
      part2: {
        type: [Number],
        required: true,
        default: [],
      },
      part3: {
        type: [Number],
        required: true,
        default: [],
      },
      part4: {
        type: [Number],
        required: true,
        default: [],
      },
      part5: {
        type: [Number],
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
  },
  {
    timestamps: true,
    collection: "testBanks",
  }
);

// Export ReadingSchema and TestBankSchema

export default mongoose.model("TestBank", testBankSchema);
