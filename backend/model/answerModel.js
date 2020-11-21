import mongoose from "mongoose";

const answerSchema = mongoose.Schema(
  {
    answer: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    toQuestion: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Question",
    },
    selectedAnswer: {
      type: Boolean,
      required: true,
      default: false,
    },
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        comment: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Answer = mongoose.model("Answer", answerSchema);

export default Answer;
