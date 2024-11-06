require('dotenv').config();
const https = require('https');

let calendar;

// private
const validate_download = (download) => {
    download = download.trim();

    if(!download.startsWith('BEGIN:VCALENDAR')) {
        return false;
    }
    if(!download.endsWith('END:VCALENDAR')) {
        return false;
    }
    return true;
};

// public
const download_obs_calendar = async () => {
    // return promise
    return new Promise((resolve, reject) => {
        try {
            // start request to h-da obs server
            https.get(process.env.OBS_ICS_URL, (resp) => {
                let data = '';
            
                // A chunk of data has been received.
                resp.on('data', (chunk) => {
                    data += chunk;
                });
            
                // The whole response has been received. Print out the result.
                resp.on('end', () => {
                    // validate downloaded calendar
                    if(!validate_download(data)) {
                        console.log('Content Error: download validation failed');
                        return resolve(false);
                    }

                    // save downloaded calendar
                    calendar = data;

                    // success
                    return resolve(true);
                });
            }).on("error", (err) => {
                console.log("Download Error: " + err.message);
                
                // error occured
                return resolve(false);
            });
        }
        catch {
            console.log('Try Error: Download caught by try-catch');

            // error occured
            return resolve(false);
        }
    });
};

// public
const extract_exam_calendar = () => {
    console.log(calendar);
};

module.exports.download = download_obs_calendar;
module.exports.extract_exam_calendar = extract_exam_calendar;