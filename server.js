require('dotenv').config();
const express = require('express');
const obs_parser = require('./custom_modules/obs_parser');

const app = express();

app
    .route('/')
    .get(async (req, res) => {
        const success = await obs_parser.download();
        if(!success) {
            return res.status(500).send();
        }

        obs_parser.extract_exam_calendar();

        return res.status(200).send('hi');
    });

// start express server
app.listen(process.env.PORT, function() {
    console.log(`Der Server wurd auf Port ${process.env.PORT} gestartet.`);
});