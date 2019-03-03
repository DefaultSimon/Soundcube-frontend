import React, {Component} from 'react';
import '../styles/main.scss';
// api-related
import api from '../core/Api';
import eventHandler, {Events} from '../core/EventHandler';
import globalStore from '../core/GlobalStore';
import Logger from '../core/Logger';
import {makePromiseRetryable} from "../core/Utilities";
// Components
import DrawerContainer from "./sidebar/DrawerContainer";
import GlobalSnackbar from "./common/GlobalSnackbar";
import ScreenContainer from './ScreenContainer';
// Material-UI
import {createMuiTheme, withStyles} from "@material-ui/core/styles";
import variables from '../styles/base/_variables.scss';

import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from "@material-ui/core/es/Toolbar/Toolbar";
import Typography from "@material-ui/core/es/Typography/Typography";


// Utilities
const log = new Logger("App"),
      logAuth = new Logger("Auth");

// Material-UI palette and other stuff
// Created from variables inside _variables.scss inside /styles/base/
createMuiTheme({
    palette: {
        primary: {
            main: variables.primary
        },
        secondary: {
            main: variables.secondary
        },
        error: {
            main: variables.error
        }
    },
    typography: {
        useNextVariants: true,

        fontFamily: variables.fontFamily,
        fontSize: variables.fontSize,
    }
});

const styles = theme => ({
    menuIcon: {
        color: "#fff"
    },
    iconButton: {
        marginLeft: -15,
        marginRight: 3
    },

    appBar: {
        zIndex: theme.zIndex.drawer + 1
    }
});

const loadingBar = document.getElementById("loading-bar"),
      rootElement = document.getElementById("root"),
      loadingText2 = document.getElementById("loading-text2");


class App extends Component {
    constructor(props) {
        super(props);

        // Loads common stuff and changes the loading screen
        this.loadApp();
    }

    /**
     * Request a YouTube API key from the server
     * @returns {Promise}
     */
    fetchYoutubeApiKey = () => {
        /*
        Important: return the Promise, not a completed job!
        */
        logAuth.debug(`Fetching the YouTube API key from backend...`);

        return api.auth_getYoutubeApiKey()
            .then((response) => {
                if (response.status === 200) {
                    if (!response.data.hasOwnProperty("api_key")) {
                        logAuth.error("Fetched youtube API key, got 200 OK, but no key!");
                        throw response;
                    }

                    logAuth.debug("Got YouTube API key from server!");
                    globalStore.putInStore("youtubeApiKey", response.data["api_key"]);
                    eventHandler.emitEvent(Events.youtubeApiKeyFetched, response.data["api_key"]);
                }
            })
    };

    /**
     * Pings the server to check if it is responding
     * @returns {Promise}
     */
    checkServerAvailability = () => {
        /*
        Important: return the Promise, not a completed job!
        */
        log.debug("Checking server availability...");

        return api.ping()
            .then((response) => {
                if (response.status !== 200) {
                    log.error("Server is not reachable!");
                    throw response;
                } else {
                    log.info("Server reachable.");
                }
            })
    };

    /**
     * Called when the app is initially mounted. Shows loading progress and makes sure the mounted app is not visible
     * until everything is loaded and ready.
     */
    loadApp() {
        // Make sure the server is online, then load necessary resources
        const maxRetries = 4,
            retryDelay = 2000;

        // Set up handlers for some events
        let pQueue = eventHandler.waitForEventPromise(Events.queueUpdated);
        let pPlayingStatus = eventHandler.waitForEventPromise(Events.playingStatusUpdated);
        let pSongInfo = eventHandler.waitForEventPromise(Events.songInfoUpdated);

        new Promise(async (resolve, reject) => {
            // 1: Check server availability

            loadingText2.innerHTML = "Checking server availability...";

            // Make the promise retry n times with some error handlers and await it
            await makePromiseRetryable(
                this.checkServerAvailability(), maxRetries, retryDelay,
                (r) => {
                    // This increments the fail counter
                    if (!r.hasOwnProperty("failCount")) {
                        r.failCount = 0
                    }
                    r.failCount += 1;

                    loadingText2.innerHTML = `Checking server availability... <br>Failed, retrying (${r.failCount}/${maxRetries})`;
                    return r;
                })
                .then(() => {
                    loadingText2.innerHTML = "Available!"
                }).catch(() => {
                    loadingText2.innerHTML = "Server is not available.";
                    reject();
                });

            resolve();
        }).then(async () => {
            // 2: Fetch YouTube api key from backend

            loadingText2.innerHTML = "Fetching resources...";

            await makePromiseRetryable(
                this.fetchYoutubeApiKey(), maxRetries, retryDelay,
                (r) => {
                    if (!r.hasOwnProperty("failCount")) {
                        r.failCount = 0
                    }
                    r.failCount += 1;

                    loadingText2.innerHTML = `Fetching resources... <br>Failed, retrying (${r.failCount}/${maxRetries})`;
                    return r;
                })
                .then(() => {
                    loadingText2.innerHTML = "Fetched..."
                })
                .catch((err) => {
                    loadingText2.innerHTML = "Something went wrong, try reloading the page a while later.";
                    throw err;
                });
        }).then(async () => {
            // 3: wait for queue and player load

            loadingText2.innerHTML = "Waiting for queue to update...";
            await pQueue;

            loadingText2.innerHTML = "Waiting for player to update... (1/2)";
            await pPlayingStatus;

            loadingText2.innerHTML = "Waiting for player to update... (2/2)";
            await pSongInfo;

            loadingText2.innerHTML = "All done!"

        }).then(() => {
            // Fade-out the loading bar and fade-in the mounted content
            loadingBar.classList.add("loaded");
            rootElement.classList.add("visible");
        })
    }

    render() {
        const {classes} = this.props;

        return (
            <div className="body">
                {/* Resets and stuff */}
                <CssBaseline/>

                {/* Top bar */}
                <AppBar position="fixed" className={classes.appBar}>
                    <Toolbar variant="dense" className="toolbar"
                             onClick={() => eventHandler.emitEvent(Events.toggleDrawerState)}>
                        <IconButton className={classes.iconButton}>
                            <MenuIcon className={classes.menuIcon}/>
                        </IconButton>
                        <Typography variant="h5" color="inherit">
                            Soundcube
                        </Typography>
                    </Toolbar>
                </AppBar>

                {/* Left drawer */}
                <DrawerContainer/>

                {/* Screens */}
                <main>
                    <ScreenContainer/>
                </main>

                {/* The one and only snackbar */}
                <GlobalSnackbar/>
            </div>
        );
    }
}

export default withStyles(styles)(App);
