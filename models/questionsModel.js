const mongoose = require('mongoose');

const questionsSchema = mongoose.Schema({
    questionTitle: {
        type: String,
        required: [true, 'Question title is required !'],
    },
    questionBody: {
        type: String,
        required: [true, 'Question body is required !'],
    },
    questionTags: {
        type: [String],
        required: [true, 'A questions must contain atleast 1 tag'],
    },
    votes: {
        type: Number,
        default: 0,
    },
    upVotes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
    },
    downVotes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
    },
    noOfAnswers: {
        type: Number,
        default: 0,
    },
    postedOn: {
        type: Date,
        default: Date.now(),
    },
    views: {
        type: Number,
        default: 0,
    },
    userPosted: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    answers: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
            votes: {
                type: Number,
                default: 0,
            },
            answerBody: String,
            answeredOn: {
                type: Date,
                default: Date.now(),
            },
        },
    ],
});

const Questions = mongoose.model('Questions', questionsSchema);

module.exports = Questions;
