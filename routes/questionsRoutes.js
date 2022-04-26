const express = require('express');
const questionsController = require('../controllers/questionsController');
const authController = require('./../controllers/authController');

const router = express.Router();

router
    .get('/getAllQuestions', questionsController.getAllQuestions)
    .post(
        '/askQuestion',
        authController.protect,
        questionsController.addQuestion
    )
    .patch(
        '/answerQuestion/:id',
        authController.protect,
        questionsController.answerQuestion
    )
    .patch(
        '/deleteAnswer/:questionID/:answerID',
        authController.protect,
        questionsController.deleteAnswer
    )
    .patch('/vote/:id', authController.protect, questionsController.vote)
    .delete(
        '/deleteQuestion/:id',
        authController.protect,
        questionsController.deleteQuestion
    );

module.exports = router;
