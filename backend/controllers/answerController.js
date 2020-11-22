import User from "../model/userModel.js";
import Question from "../model/questionModel.js";
import Answer from "../model/answerModel.js";

import asyncHandler from "express-async-handler";

// @desc Answer to a question
// @route POST /api/answers/:questionId
// @access Public
const answerQuestion = asyncHandler(async (req, res) => {
  const { email, answer } = req.body;

  const userExists = await User.findOne({ email });

  if (!userExists) {
    res.status(400);
    throw new Error("User does not exist");
  }

  const question = await Question.findOne({ _id: req.params.questionId });

  if (question) {
    const createdAnswer = await Answer.create({
      answer,
      user: userExists._id,
      toQuestion: question._id,
    });

    if (createdAnswer) {
      if (!question.hasAnswers) {
        question.hasAnswers = true;
        await question.save();
      }
      res.status(201).json({
        _id: createdAnswer._id,
        user: createdAnswer.user,
        toQuestion: createdAnswer.toQuestion,
      });
    } else {
      res.status(400);
      throw new Error("Invalid Answer data");
    }
  } else {
    res.status(404);
    throw new Error("Question not found");
  }
});

// @desc Comment on a answer
// @route PATCH /api/answers/comment/:answerId
// @access Public
const answerComments = asyncHandler(async (req, res) => {
  const { email, comment } = req.body;

  const userExists = await User.findOne({ email });

  if (!userExists) {
    res.status(400);
    throw new Error("User does not exist");
  }

  const answerFound = await Answer.findOne({ _id: req.params.answerId });

  if (answerFound) {
    const comments = [...answerFound.comments];
    comments.push({ user: userExists._id, comment });
    answerFound.comments = comments;

    const updatedAnswer = await answerFound.save();

    res.json(updatedAnswer);
  } else {
    res.status(404);
    throw new Error("Answer not found");
  }
});

// @desc Select a answer
// @route PATCH /api/answers/select/:answerId
// @access Public
const selectAnswer = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const userExists = await User.findOne({ email });

  if (!userExists) {
    res.status(400);
    throw new Error("User does not exist");
  }

  const fetchedAnswer = await Answer.findOne({ _id: req.params.answerId });

  if (fetchedAnswer) {
    if (fetchedAnswer.user.equals(userExists._id)) {
      await Answer.updateMany(
        { toQuestion: fetchedAnswer.toQuestion, selectedAnswer: true },
        { selectedAnswer: false }
      );
      fetchedAnswer.selectedAnswer = true;
      await fetchedAnswer.save();
      res.json(fetchedAnswer);
    } else {
      res.status(400);
      throw new Error("User not authorized to select answer");
    }
  } else {
    res.status(404);
    throw new Error("Answer not found");
  }
});

// @desc Lists all  Answers
// @route GET /api/answers/
// @access Public
const getAllAnswers = asyncHandler(async (req, res) => {
  const answers = await Answer.find({}).populate("owner toQuestion");

  res.json(answers);
});

// @desc Lists all  Answers for a Question
// @route GET /api/answers/:questionId
// @access Public
const getAllAnswersToQuestion = asyncHandler(async (req, res) => {
  if (!req.params.questionId) {
    res.status(400);
    throw new Error("Please provide Question Id");
  }

  const answers = await Answer.find({
    toQuestion: req.params.questionId,
  }).populate("owner toQuestion");
  if (answers) {
    res.json(answers);
  } else {
    res.status(404);
    throw new Error("Question not found");
  }
});

export {
  answerQuestion,
  answerComments,
  selectAnswer,
  getAllAnswersToQuestion,
  getAllAnswers,
};
