require('dotenv').config();
const express = require('express');
const { header, body, query, validationResult } = require('express-validator');

const parse_errors = require('./custom_modules/parse_errors');
const obs_parser = require('./custom_modules/obs_parser');

const app = express();

app
    .route('/')
    .get([
        query('obs_key').notEmpty().withMessage('query parameter \'obs_key\' missing'),
        query('mode').notEmpty().withMessage('query parameter \'mode\' missing'),
        query('prefix').notEmpty().withMessage('query parameter \'prefix\' missing')
    ], async (req, res) => {
        // -------- check for bad request --------
        const errors = parse_errors(validationResult(req));
        if(errors) {
            return res.status(400).json({ errors: errors });
        }

        // get data from request
        const req_obs_key = req.query.obs_key;
        const req_mode = req.query.mode;
        let req_prefix = req.query.prefix;

        // check mode
        if(req_mode != 'white_list' && req_mode != 'black_list') {
            return res.status(400).json({ errors: [ 'query parameter \'mode\' must be \'white_list\' or \'black_list\'' ]});
        }

        // convert prefix to an array if we just received one prefix
        if(typeof(req_prefix) != 'object') {
            req_prefix = [ req_prefix ];
        }
        
        // -------- download calendar --------
        // build download URL
        const download_url = process.env.OBS_ICS_URL + req_obs_key;

        // download
        const status = await obs_parser.download(download_url);

        // check download success
        if(status == 0) {
            return res.status(500).send();
        }
        if(status == 2) {
            return res.status(400).json({ errors: [ 'query parameter \'obs_key\' invalid' ]});
        }

        // -------- extract requested calendar --------
        const new_calendar = obs_parser.extract_calendar(req_mode, req_prefix);

        return res.status(200).send(new_calendar);
    });

// start express server
app.listen(process.env.PORT, function() {
    console.log(`Der Server wurd auf Port ${process.env.PORT} gestartet.`);
});