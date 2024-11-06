require('dotenv').config();
const express = require('express');

const app = express();

app
    .route('/')
    .get((req, res) => {
        return res.status(200).send('hi');
    });

// start express server
app.listen(process.env.PORT, function() {
    console.log(`Der Server wurd auf Port ${process.env.PORT} gestartet.`);
});