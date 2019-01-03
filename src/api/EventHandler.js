// Event handler
import Logger from './logger';

const log = new Logger("EventHandler");

class EventHandler {
    common = {
        moveToScreen: "moveToScreen"
    };

    constructor() {
        this.subscribers = {};
    }

    subscribeToEvent(eventName, callback) {
        // Create an array if there are none yet
        if (!this.subscribers.hasOwnProperty(eventName)) {
            this.subscribers[eventName] = []
        }

        this.subscribers[eventName].push(callback);
        log.info(`New subscriber for event: ${eventName}`)
    }

    emitEvent(eventName, ...args) {
        // Make sure the event exists
        if (!this.subscribers.hasOwnProperty(eventName)) {
            log.error(`No such event: ${eventName}`)
        }

        // Call all callbacks with the provided arguments
        let callbacks = this.subscribers[eventName];
        callbacks.forEach((cb) => {
            cb(...args)
        });
    }
}

const eventHandler = new EventHandler();

export default eventHandler;