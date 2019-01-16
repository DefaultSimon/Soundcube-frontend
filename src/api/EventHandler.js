// Event handler
import Logger from './Logger';

const log = new Logger("EventHandler");

const Events = {
    // Request that ScreenContainer moves to the provided screen
    // args: screenName
    moveToScreen: "moveToScreen",
    // Request that the queue fetches an update from the server
    // args: none
    updateQueue: "updateQueue",
    // Update Queue's state with already fetched data
    // args: queue array
    updateQueueWithData: "updateQueueWithData",
    // Update current song's info
    // args: none
    updateCurrentSong: "updateCurrentSong",
    // Set playing state
    // args: boolean, to enforce status
    updatePlayingStatus: "updatePlayingStatus"
};

class EventHandler {
    constructor() {
        this.subscribers = {};
    }

    subscribeToEvent(eventName, callback) {
        // Create an array if there are none yet
        if (!this.subscribers.hasOwnProperty(eventName)) {
            this.subscribers[eventName] = []
        }

        this.subscribers[eventName].push(callback);
        log.debug(`New subscriber for event: ${eventName}`)
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
export { Events };