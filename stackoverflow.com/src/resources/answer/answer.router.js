import { createAnswer, displayAllAnswersByUserId, displayAllAnswersToGivenQuestions } from "./answer.controller.js";
import express from "express";
import answerController from "./answer.controller.js";

const router = express.Router();

// api/answer
router.route("/")
.post(createAnswer)
.get(displayAllAnswersByUserId)

// api/answer/questionId
router.route("/:id")
.get(displayAllAnswersToGivenQuestions)
.put(answerController.updateOne)

export default router;
