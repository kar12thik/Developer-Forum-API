import express from "express";
import {
  answerQuestion,
  answerComments,
  selectAnswer,
  getAllAnswersToQuestion,
  getAllAnswers,
} from "../controllers/answerController.js";

const router = express.Router();

router.get("/", getAllAnswers);
router.get("/:questionId", getAllAnswersToQuestion);
router.post("/:questionId", answerQuestion);
router.patch("/comment/:answerId", answerComments);
router.patch("/select/:answerId", selectAnswer);

export default router;
