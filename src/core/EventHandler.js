// Event handler
import Logger from './Logger';
import { createRandomId } from "./Utilities";

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
    updatePlayingStatus: "updatePlayingStatus",
    // Toggle drawer open/close
    // args: none
    toggleDrawerState: "toggleDrawerState",

    // (mostly) one-time triggers
    // Emitted when the YouTube API key is fetched
    // args: string
    youtubeApiKeyFetched: "youtubeApiKeyFetched",
    // Emitted when the queueing text field is updated
    // args: string
    searchTextUpdated: "searchTextUpdated",
    // Emitted when the queue is updated
    // args: array
    queueUpdated: "queueUpdated",
    // Emitted when the song info is updated
    // args: object containing song info
    songInfoUpdated: "songInfoUpdated",
    // Emitted when the playing status (progress bar) is updated
    // args: none
    playingStatusUpdated: "playingStatusUpdated",


};

class EventHandler {
    constructor() {
        // Contains actual callbacks, by callbackName
        this.callbacks = {};
        // An object containing callback names, grouped by eventName
        this.subscribers = {};
    }

    subscribeToEvent(eventName, callback = null, callbackName = null) {
        /*
        Subscribes you to an event. Callback is called when the event triggers and
        callbackName is a string that is used to remove this callback when it is no longer needed.
         */
        if (callback === null && callbackName === null) {
            throw new Error("Missing arguments!");
        }

        // 1. Store callback
        // If not provided, randomly generate a callback name
        if (callbackName === null) {
            callbackName = callback.name;
            console.log(callbackName);
            // Check for collisions
            if (this.callbacks.hasOwnProperty(callbackName)) {
                callbackName = `${callbackName}-c`
            }
        }
        if (callback !== null) {
            // Add the callback if present
            // (pro tip: you can subscribe one callback to multiple events
            // by setting the callback to null and providing a callbackName)
            this.callbacks[callbackName] = callback;
        }

        // 2. Register callback name for event
        // Create an object if there are no subscribers yet
        if (!this.subscribers.hasOwnProperty(eventName)) {
            this.subscribers[eventName] = []
        }

        // Push the name, the actual callback is stored inside 'callbacks'
        this.subscribers[eventName].push(callbackName);
        log.debug(`New subscriber for event: ${eventName} with name ${callbackName}`);

        // Useful of you need to unsubscribe in the future
        return callbackName;
    }

    removeCallback(callbackName) {
        if (!this.callbacks.hasOwnProperty(callbackName)) {
            throw new Error("This callbackName is not available!");
        }

        // Remove from 'callbacks', 'subscribers' is fixed in emitEvent if the event doesn't exist
        delete this.callbacks[callbackName];
        log.debug(`Removed callback: ${callbackName}`)

    }

    waitForEventPromise(eventName) {
        /*
        Returns a promise that is resolved when the event is triggered.
        Obviously, this only subscribes once.
         */
        const randomId = createRandomId();

        return new Promise((resolve) => {
            this.subscribeToEvent(eventName, (...args) => {
                this.removeCallback(randomId);
                resolve(...args);
            }, randomId)
        })
    }

    emitEvent(eventName, ...args) {
        // Make sure there are subscribers
        if (!this.subscribers.hasOwnProperty(eventName)) {
            log.debug(`Was about to emit ${eventName}, but no subscribers.`);
            return;
        }

        let callbacks = this.subscribers[eventName];
        callbacks.forEach((cbName) => {
            try {
                // Fetch callback from callbackName
                if (!this.callbacks.hasOwnProperty(cbName)) {
                    // If callback doesn't exist (anymore?), remove it
                    let i = this.subscribers[eventName].indexOf(cbName);
                    // This should always be true, but better safe than sorry
                    if (i > -1) {
                        this.subscribers[eventName].splice(i, 1);
                        log.warn(`Callback ${cbName} was not available, removed from event: ${eventName}.`)
                    }
                }
                else {
                    // Fetch the callback and call it with the provided arguments
                    let cb = this.callbacks[cbName];
                    cb(...args)
                }
            }
            catch(err) {
                log.warn(`Emitting event, but ${cbName} failed.`);
                log.warn(err);
            }
        });
    }
}

const eventHandler = new EventHandler();

export default eventHandler;
export { Events };