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

// @desc Lists Question by Title and Description
// @route GET /api/questions/search
// @access Public
const searchQuestion = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (title && description) {
    const questions = await Question.find({ title, description })
      .populate("owner", "name email -_id")
      .select("title description -_id");

    if (questions.length !== 0) {
      res.json(questions);
    } else {
      res.status(404);
      throw new Error("Question not found");
    }
  } else {
    res.status(404);
    throw new Error("Invalid Params for Question");
  }
});

// @desc Add Tags to Question
// @route PATCH /api/answers/tags/:questionId
// @access Public
const addTags = asyncHandler(async (req, res) => {
  const { email, tags } = req.body;

  const userExists = await User.findOne({ email });

  if (!userExists) {
    res.status(400);
    throw new Error("User does not exist");
  }

  const question = await Question.findOne({ _id: req.params.questionId });

  if (question) {
    if (question.owner.equals(userExists._id)) {
      const tagList = [...question.tags];

      if (tags && tags.length !== 0) {
        tags.forEach((tag) => tagList.push(tag));
        question.tags = tagList;

        const updatedQuestion = await question.save();
        res.json(updatedQuestion);
      } else {
        res.status(404);
        throw new Error("Invalid Tag Data");
      }
    } else {
      res.status(400);
      throw new Error("User not authorized to add tags");
    }
  } else {
    res.status(404);
    throw new Error("Question not found");
  }
});

// @desc Lists all Questions Having Tags matching the search Tag
// @route GET /api/questions/tags
// @access Public
const listQuestionsHavingTags = asyncHandler(async (req, res) => {
  const { tag } = req.body;

  if (tag) {
    const questions = await Question.find({ "tags.tag": tag })
      .populate("owner", "name email -_id")
      .select("title description -_id");

    if (questions.length !== 0) {
      res.json(questions);
    } else {
      res.status(404);
      throw new Error("Question not found");
    }
  } else {
    res.status(404);
    throw new Error("Invalid Params for Tag Data");
  }
});

export {
  createQuestion,
  unansweredQuestions,
  questionComments,
  searchQuestion,
  addTags,
  listQuestionsHavingTags,
};
