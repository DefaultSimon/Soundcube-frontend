// Event handler
import Logger from './Logger';

const log = new Logger("GlobalStore");

class GlobalStore {
    constructor() {
        this.store = {}
    }

    putInStore(key, object) {
        this.store[key] = object;
        log.debug(`New object in store under key: ${key}`)
    }

    deleteFromStore(key) {
        if (this.store.hasOwnProperty(key)) {
            delete this.store[key];
            log.debug(`Removed object from store: ${key}`)
        }
    }

    getFromStore(key) {
        if (this.store.hasOwnProperty(key)) {
            return this.store[key]
        }
        else {
            return null
        }
    }
}

const globalStore = new GlobalStore();

export default globalStore;