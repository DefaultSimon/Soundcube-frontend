/*
Logging Helpers
 */

/**
 * Simple Logger that prepends the instance name for easier debugging of bigger projects.
 *
 * Format: [LoggerName] <your message>
 */
class Logger {
    constructor(name) {
        this.name = name;
    }

    _parse(message) {
        return "[" + this.name + "] " + JSON.stringify(message);
    }

    info(message) {
        console.info(this._parse(message))
    }

    log(message) {
        console.log(this._parse(message))
    }

    debug(message) {
        console.debug(this._parse(message))
    }

    warn(message) {
        console.warn(this._parse(message))
    }

    error(message) {
        console.error(this._parse(message))
    }
}

export default Logger;