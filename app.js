const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const userRouter = require('./routes/userRoutes');
const questionsRouter = require('./routes/questionsRoutes');
const rateLimit = require('express-rate-limit');

const app = express();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10000, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(express.json({ limit: '1mb', extended: true }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(
    cors({
        credentials: true,
        origin: 'https://stack-underflow-niket.netlify.app',
    })
);
app.use(limiter);

app.use(cookieParser());

app.use('/api/v1/users', userRouter);
app.use('/api/v1/questions', questionsRouter);

module.exports = app;
