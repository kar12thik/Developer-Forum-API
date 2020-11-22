import express from "express";
import {
  answerQuestion,
  answerComments,
  selectAnswer,
} from "../controllers/answerController.js";

const router = express.Router();

router.post("/:questionId", answerQuestion);
router.patch("/comment/:answerId", answerComments);
router.patch("/select/:answerId", selectAnswer);

export default router;
