import express from "express";
import {
  createQuestion,
  unansweredQuestions,
  questionComments,
  searchQuestion,
  addTags,
  listQuestionsHavingTags,
} from "../controllers/questionController.js";

const router = express.Router();

router.get("/search", searchQuestion);
router.get("/unanswered", unansweredQuestions);
router.get("/tags", listQuestionsHavingTags);
router.post("/", createQuestion);
router.patch("/comment/:questionId", questionComments);
router.patch("/tags/:questionId", addTags);

export default router;
