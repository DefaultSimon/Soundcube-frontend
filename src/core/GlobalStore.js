// Event handler
import Logger from './Logger';

const log = new Logger("GlobalStore");

class GlobalStore {
    constructor() {
        this.store = {}
    }

    /**
     * Stores an object
     * @param {any} key
     * @param {any} object
     */
    putInStore(key, object) {
        this.store[key] = object;
        log.debug(`New object in store under key: ${key}`)
    }

    /**
     * Deletes a key-value pair
     * @param {any} key
     */
    deleteFromStore(key) {
        if (this.store.hasOwnProperty(key)) {
            delete this.store[key];
            log.debug(`Removed object from store: ${key}`)
        }
    }

    /**
     * Returns an object in store by key
     * @param {any} key
     * @returns {any | null}
     */
    getFromStore(key) {
        return this.store.hasOwnProperty(key) ? this.store[key] : null
    }
}

const globalStore = new GlobalStore();

export default globalStore;