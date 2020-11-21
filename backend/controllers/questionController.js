import User from "../model/userModel.js";
import Question from "../model/questionModel.js";

import asyncHandler from "express-async-handler";

// @desc Create a new question
// @route POST /api/questions
// @access Public
const createQuestion = asyncHandler(async (req, res) => {
  const { email, title, description } = req.body;

  const userExists = await User.findOne({ email });

  if (!userExists) {
    res.status(400);
    throw new Error("User does not exist");
  }

  const question = await Question.create({
    title,
    description,
    owner: userExists._id,
  });

  if (question) {
    res.status(201).json({
      _id: question._id,
      title: question.title,
      description: question.description,
      owner: question.owner,
    });
  } else {
    res.status(400);
    throw new Error("Invalid Question data");
  }
});

// @desc Lists all unanswered Questions
// @route GET /api/questions/unanswered
// @access Public
const unansweredQuestions = asyncHandler(async (req, res) => {
  const questions = await Question.find({ hasAnswers: false })
    .populate("owner", "name email -_id")
    .select("title description -_id");

  res.json(questions);
});

// @desc Comment on a question
// @route PATCH /api/questions/comment/:questionId
// @access Public
const questionComments = asyncHandler(async (req, res) => {
  const { email, comment } = req.body;

  const userExists = await User.findOne({ email });

  if (!userExists) {
    res.status(400);
    throw new Error("User does not exist");
  }

  const question = await Question.findOne({ _id: req.params.questionId });

  if (question) {
    const comments = [...question.comments];
    comments.push({ user: userExists._id, comment });
    question.comments = comments;

    const updatedQuestionDetail = await question.save();

    res.json(updatedQuestionDetail);
  } else {
    res.status(404);
    throw new Error("Question not found");
  }
});

export { createQuestion, unansweredQuestions, questionComments };
