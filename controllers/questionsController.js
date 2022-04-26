const Questions = require('../models/questionsModel');
const catchAsync = require('../utils/catchAsync');

exports.addQuestion = catchAsync(async (req, res, next) => {
    req.body.userPosted = req.user.id;
    let question = await Questions.create(req.body);
    question = await question.populate('userPosted');
    res.status(200).json({
        status: 'success',
        data: {
            question,
        },
    });
});

exports.getAllQuestions = catchAsync(async (req, res, next) => {
    const questions = await Questions.find()
        .populate('userPosted')
        .populate('answers.user');
    res.status(200).json({
        status: 'success',
        data: {
            questions,
        },
    });
});

exports.answerQuestion = catchAsync(async (req, res, next) => {
    req.body.user = req.user;
    const id = req.params.id;
    let question = await Questions.findById(id);
    question.answers.push(req.body);
    let updatedQuestion = await Questions.findByIdAndUpdate(
        id,
        question
    ).populate('answers.user');
    res.status(200).json({
        status: 'success',
        data: {
            updatedQuestion,
        },
    });
});

exports.deleteQuestion = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const user = req.user._id;
    let question = await Questions.findById(id);
    const ouser = question.userPosted;
    if (JSON.stringify(user) === JSON.stringify(ouser))
        question = await Questions.findByIdAndDelete(id);
    res.status(200).json({
        status: 'success',
        data: {
            question,
        },
    });
});

exports.deleteAnswer = catchAsync(async (req, res, next) => {
    const qid = req.params.questionID;
    const aid = req.params.answerID;
    const user = req.user._id;
    let question = await Questions.findById(qid);
    let answers = question.answers;
    let otherAnswers = answers.filter(
        (a) => JSON.stringify(a._id) !== JSON.stringify(aid)
    );
    let deletedAnswer = answers.filter(
        (a) => JSON.stringify(a._id) === JSON.stringify(aid)
    );
    const ouser = deletedAnswer[0].user;
    let updatedQuestion;

    if (JSON.stringify(user) === JSON.stringify(ouser)) {
        updatedQuestion = await Questions.findByIdAndUpdate(qid, {
            answers: otherAnswers,
        });
    }
    res.status(200).json({
        status: 'success',
        data: {
            updatedQuestion,
        },
    });
});

exports.vote = catchAsync(async (req, res, next) => {
    const user = req.user._id;
    const id = req.params.id;
    let question = await Questions.findById(id);
    const type = req.body.vote;
    if (type === 'upvote') {
        if (question.upVotes.includes(user)) {
            question.upVotes = question.upVotes.filter(
                (a) => JSON.stringify(a) !== JSON.stringify(user)
            );
        } else {
            if (question.downVotes.includes(user)) {
                question.downVotes = question.downVotes.filter(
                    (a) => JSON.stringify(a) !== JSON.stringify(user)
                );
            }
            question.upVotes = question.upVotes.push(user);
        }
    } else if (type === 'downvote') {
        if (question.downVotes.includes(user)) {
            question.downVotes = question.downVotes.filter(
                (a) => JSON.stringify(a) !== JSON.stringify(user)
            );
        } else {
            if (question.upVotes.includes(user)) {
                question.upVotes = question.upVotes.filter(
                    (a) => JSON.stringify(a) !== JSON.stringify(user)
                );
            }
            question.downVotes = question.downVotes.push(user);
        }
    }

    question = await Questions.findByIdAndUpdate(id, question, { new: true });

    res.status(200).json({
        status: 'success',
        data: {
            question,
        },
    });
});
