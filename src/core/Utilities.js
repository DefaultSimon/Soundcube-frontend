/*
Various utilities
 */

/**
 * Pads a string with leading zeroes (up to 10)
 * @param {float | int} num - number to pad
 * @param {int} size - how big the number should be at the end
 * @returns {string} - the formatted number
 */
function padNumber(num, size){
    return ('0000000000' + num).substr(-size);
}
export {padNumber};

/**
 * Formats time with text (example: 12m3s)
 * @param {object} data - object containing fields years,days,hours,minutes,seconds
 * @returns {string} - the human-readable time
 */
function timeFormatWithText(data) {
    const { years, days, hours, minutes, seconds } = data;
    
    let fields = [];
    if (years) {
        fields.push(`${years}y`)
    }
    if (days) {
        fields.push(`${days}d`)
    }
    if (hours) {
        fields.push(`${hours}h`)
    }
    if (minutes) {
        fields.push(`${minutes}m`)
    }
    if (seconds) {
        fields.push(`${seconds}s`)
    }

    return fields.join(" ")
}
export { timeFormatWithText };

/**
 * Formats time with colons (example: 12:03)
 * @param {object} data - object containing fields years,days,hours,minutes,seconds
 * @returns {string} - the human-readable (colon-separated) time
 */
function timeFormatWithColon(data) {
    const { years, days, hours, minutes, seconds } = data;

    let fields = [];
    if (years) { fields.push(years) }
    if (days) { fields.push(days) }
    if (hours) { fields.push(hours) }
    // Always push at least minutes and seconds, with zero padded values
    fields.push(padNumber(minutes, 2));
    fields.push(padNumber(seconds, 2));

    return fields.join(":")
}
export { timeFormatWithColon };

/**
 * Formats seconds into a readable representation.
 * @param {number} seconds - amount of seconds
 * @param {function} formatter - the formatter to use (default is timeFormatWithText, timeFormatWithColon is also available)
 * @returns {string} - the human-readable representation of time
 */
function resolveTime(seconds, formatter= timeFormatWithText) {
    /*
    Converts seconds into a human-friendly representation
     */
    let years = 0,
        days = 0,
        hours = 0,
        minutes = 0;

    while (seconds > 60) {
        if (seconds >= (60 * 60 * 24 * 365)) {
            seconds -= 60 * 60 * 24 * 365;
            years += 1;
        }
        else if (seconds >= (60 * 60 * 24)) {
            seconds -= 60 * 60 * 24;
            days += 1;
        }
        else if (seconds >= (60 * 60)) {
            seconds -= 60 * 60;
            hours += 1;
        }
        else if (seconds >= 60) {
            seconds -= 60;
            minutes += 1;
        }
    }

    // Allows use of custom formatting
    return formatter({years: years, days: days, hours: hours, minutes: minutes, seconds: seconds})
}
export { resolveTime };

/**
 * Makes the promise retryable with provided handlers, delays and maximum retires, etc.
 * @param {Promise} promise - promise to modify
 * @param {int} maxRetries - how many retries to allow
 * @param {number} retryDelay - how many ms to wait between retries
 * @param {function} afterFail - function to call in the .catch() handler after failing
 * @returns {Promise}
 */
function makePromiseRetryable(promise, maxRetries, retryDelay, afterFail) {
    /*
    Wraps a promise in retry handlers, returns the wrapped promise
     */
    for(let i=0; i<maxRetries; i++) {
        //sa = sa.catch(attempt).catch(rejectDelay);
        promise = promise
            .catch((err) => {
                err = afterFail(err);

                return new Promise(function(resolve, reject) {
                    setTimeout(reject.bind(null, err), retryDelay);
                });
            })
    }

    return promise;
}
export { makePromiseRetryable };

/**
 * Creates a random 10-character ID
 * @returns {string}
 */
function createRandomId() {
    // by gordonbrander on GitHub:
    // https://gist.github.com/gordonbrander/2230317
    return Math.random().toString(36).substr(2, 10)
}
export { createRandomId };