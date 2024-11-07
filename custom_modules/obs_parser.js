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
/*
    resolve cases:
        0: failiure
        1: success
        2: bad download url
*/
const download_obs_calendar = async (download_url) => {
    // return promise
    return new Promise((resolve, reject) => {
        try {
            // start request to h-da obs server
            https.get(download_url, (resp) => {
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
                        return resolve(2);
                    }

                    // save downloaded calendar
                    calendar = data;

                    // success
                    return resolve(1);
                });
            }).on("error", (err) => {
                console.log("Download Error: " + err.message);
                
                // error occured
                return resolve(0);
            });
        }
        catch {
            console.log('Try Error: Download caught by try-catch');

            // error occured
            return resolve(0);
        }
    });
};

// private
// test whether event should be keept
const keep_event = (mode, prefix, event) => {
    // get event summary
    let event_summary = event.find((event_line) => {
        return event_line.startsWith('SUMMARY;')
    });
    // get event summary after first ':'
    // SUMMARY;LANGUAGE=de-DE:V: IT-Sicherheit   ->    V: IT-Sicherheit
    event_summary = event_summary.substring(event_summary.indexOf(':') + 1);

    // does summary match prefix
    let match = false;
    for(let i = 0; i < prefix.length; i++) {
        if(event_summary.startsWith(prefix[i])) {
            match = true;
            break;
        }
    }

    // apply mode
    if(mode == 'white_list') {
        return match;
    }
    else { // black_list
        return !match;
    }
};

// public
const extract_calendar = (mode, prefix) => {
    let state = 0; // 0: not in event, 1: in event
    let new_calendar = '';
    let current_event = [];

    let calendar_lines = calendar.split(/\r?\n/);
    for(let i = 0; i < calendar_lines.length; i++) { // for each line
        const line = calendar_lines[i];

        // start of event
        if(line.startsWith('BEGIN:VEVENT')) {
            state = 1; // in event
            current_event = []; // clear current_event
        }

        switch(state) {
            case 0: // not in event
                new_calendar += line + '\r\n';
                break;

            case 1: // in event
                current_event.push(line);
                break;
        }

        // end of event
        if(line.startsWith('END:VEVENT')) {
            state = 0; // not in event
            
            // test whether event should be keept
            if(keep_event(mode, prefix, current_event)) {
                // add event to calendar
                for(let j = 0; j < current_event.length; j++) { // for each line in current event
                    const event_line = current_event[j];
                    new_calendar += event_line + '\r\n';
                }
            }
        }
    }

    return new_calendar;
};

module.exports.download = download_obs_calendar;
module.exports.extract_calendar = extract_calendar;