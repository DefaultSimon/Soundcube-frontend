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
    snackbarContent: {
        borderBottomLeftRadius: "0",
        borderBottomRightRadius: "0"
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

            videoId: props.itemInfo.id,

            isLoading: false,
            isLoaded: false
        };
    }

    /**
     * Shows the snackbar
     * @param {string} message - Message to show
     */
    showSnackbar = (message) => {
        this.setState({snackbarIsOpen: true, snackbarMessage: message})
    };
    /**
     * Closes the snackbar (if open)
     */
    closeSnackbar = () => {
        this.setState({snackbarIsOpen: false, snackbarMessage: null})
    };

    /**
     * Queues a song and requests a queue update
     */
    queueSong = () => {
        this.setState({isLoading: true, isLoaded: false});

        const req = api.player_quickQueue(this.state.videoId);
        const proc = req.then((response) => {
            if (response.status === 200) {
                eventHandler.emitEvent(Events.updateQueue);
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
                this.showSnackbar("Song queued!");
            })
            .catch((err) => {
                this.showSnackbar("Something went wrong while queueing...");
                log.warn(`Something went wrong while quickQueueing: ${err}`)

            })
            .finally(() => {
                this.setState({isLoading: false, isLoaded: true});
                // The closing animation takes .5s
                setTimeout(() => {
                    this.props.closeSelf();
                    this.setState({isLoaded: false})
                }, 550)
            })
    };

    render() {
        const {isVisible, classes} = this.props;
        const {snackbarIsOpen, snackbarMessage, isLoading, isLoaded} = this.state;

        const overlayClasses = ["overlay",
                                isVisible  ? "visible": "",
                                isLoading ? "loading" : "",
                                isLoaded ? "loaded": ""].join(" ");

        return (
            <td className={overlayClasses}>
                <Button className="queue-button" variant="outlined" onClick={this.queueSong}>
                    <span className="panel">
                        <ShapePolygonPlus className="icon"/>
                        <span>Add song to queue</span>
                    </span>
                    <span className="panel">
                        <CircularProgress size={24} className="progress"/>
                    </span>
                </Button>

                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    open={snackbarIsOpen}
                    autoHideDuration={4000}
                    onClose={this.closeSnackbar}>
                    <SnackbarContent
                        className={classes.snackbarContent}
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