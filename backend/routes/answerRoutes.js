import express from "express";
import {
  answerQuestion,
  answerComments,
  selectAnswer,
} from "../controllers/answerController.js";

const router = express.Router();

// router.post("/", createQuestion);
// router.get("/unanswered", unansweredQuestions);
// router.patch("/comment/:questionId", questionComments);
router.post("/:questionId", answerQuestion);
router.patch("/comment/:answerId", answerComments);
router.patch("/select/:answerId", selectAnswer);
// router.patch("/comment/:id", commentAnswer);

export default router;
