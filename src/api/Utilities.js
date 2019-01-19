/*
Various utilities
 */

function pad(num, size){
    return ('00000' + num).substr(-size);
}

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

function timeFormatWithColon(data) {
    const { years, days, hours, minutes, seconds } = data;

    let fields = [];
    if (years) { fields.push(years) }
    if (days) { fields.push(days) }
    if (hours) { fields.push(hours) }
    // Always push at least minutes and seconds, with zero padded values
    fields.push(pad(minutes, 2));
    fields.push(pad(seconds, 2));

    return fields.join(":")
}

export { timeFormatWithColon };

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