import React, {Component} from "react";

import api from "../../../core/Api";
import Logger from "../../../core/Logger";
import eventHandler, {Events} from "../../../core/EventHandler";

import {LibraryPlus, ShapePolygonPlus} from "mdi-material-ui";

// Material-UI
import {withStyles} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Snackbar from '@material-ui/core/Snackbar';
import CircularProgress from "@material-ui/core/es/CircularProgress/CircularProgress";
import SnackbarContent from "@material-ui/core/es/SnackbarContent/SnackbarContent";

const log = new Logger("QueueSearchResultOverlay");

const styles = theme => ({
    button: {
        color: "white",
        background: theme.palette.primary.main,
        borderColor: "white",
        pointerEvents: "all"
    },
    buttonIcon: {
        marginRight: "8px"
    },

    loadingProgress: {
        position: "absolute",
        // 12px is half of the width/height
        top: "calc(50% - 12px)",
        left: "calc(50% - 12px)",
        color: theme.palette.primary.light
    },
    snackbarText: {
        display: "flex",
        alignItems: "center"
    }
});

class QueueSearchResultOverlay extends Component {
    constructor(props) {
        super(props);

        this.state = {
            snackbarIsOpen: false,
            snackbarMessage: null,
            videoId: props.itemInfo.id
        };
    }

    /**
     * Shows the snackbar
     * @param {string} message - Message to show
     */
    showSnackbar = (message) => {
        this.setState({isSnackbarOpen: true, snackbarMessage: message})
    };
    /**
     * Closes the snackbar (if open)
     */
    closeSnackbar = () => {
        this.setState({isSnackbarOpen: false, snackbarMessage: null})
    };

    /**
     * Queues a song and requests a queue update
     */
    queueSong = () => {
        this.setState({isLoading: true});

        const req = api.player_quickQueue(this.state.videoId);
        const proc = req.then((response) => {
            if (response.status === 200) {
                eventHandler.emitEvent(Events.updateQueue);
                return "Song queued!"
            }
        })
            .catch((err) => {
                if (err.requestFailed) {
                    return
                }

                eventHandler.emitEvent(Events.updateQueue);
            });

        Promise.all([req, proc])
            .then(([resp, message]) => {
                this.showSnackbar(message);
            })
            .catch((err) => {
                this.showSnackbar("Something went wrong...");
                log.warn(`Something went wrong while quickQueueing: ${err}`)

            })
            .finally(() => {
                this.setState({isLoading: false})
            })
    };

    render() {
        const {isVisible, isLoading, classes} = this.props;
        const {snackbarIsOpen, snackbarMessage} = this.state;

        return (
            <td className={`overlay ${isVisible ? 'visible' : ''}`}>
                <Button className={classes.button} variant="outlined" onClick={this.queueSong}>
                    <ShapePolygonPlus className={classes.buttonIcon}/>
                    <span>Add song to queue</span>
                </Button>

                {isLoading && <CircularProgress size={24} className={classes.loadingProgress}/>}
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    open={snackbarIsOpen}
                    autoHideDuration={4000}
                    onClose={this.closeSnackbar}>
                    <SnackbarContent
                        message={<span className={classes.snackbarMessage}>{snackbarMessage}</span>}
                        action={[
                            <LibraryPlus key="lib"/>
                        ]}>
                    </SnackbarContent>
                </Snackbar>
            </td>
        );
    }
}

export default withStyles(styles)(QueueSearchResultOverlay);