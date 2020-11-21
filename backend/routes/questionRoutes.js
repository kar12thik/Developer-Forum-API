import express from "express";
import {
  createQuestion,
  unansweredQuestions,
  questionComments,
} from "../controllers/questionController.js";

const router = express.Router();

router.post("/", createQuestion);
router.get("/unanswered", unansweredQuestions);
router.patch("/comment/:questionId", questionComments);

export default router;
