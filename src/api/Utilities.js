/*
Various utilities
 */

function resolveTime(seconds) {
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

export { resolveTime };