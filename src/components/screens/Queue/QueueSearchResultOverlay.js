import React, {Component} from "react";

import soundcubeApi from "../../../api/Api";
import eventHandler, {Events} from "../../../api/EventHandler";

import { ShapePolygonPlus, LibraryPlus } from "mdi-material-ui";

import { withStyles } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Snackbar from '@material-ui/core/Snackbar';
import CircularProgress from "@material-ui/core/es/CircularProgress/CircularProgress";
import SnackbarContent from "@material-ui/core/es/SnackbarContent/SnackbarContent";

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

        this.api = soundcubeApi;
    }

    showSnackbar = (message) => {
        this.setState({isSnackbarOpen: true, snackbarMessage: message})
    };

    closeSnackbar = () => {
        this.setState({isSnackbarOpen: false, snackbarMessage: null})
    };

    queueSong = () => {
        this.setState({isLoading: true});

        const req = this.api.player_quickQueue(this.state.videoId);
        const act = req.then((response) => {
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

        Promise.all([req, act])
            .then(([resp, message]) => {
                this.showSnackbar(message);
            })
            .catch((err) => {
                this.showSnackbar("Something went wrong...")
            })
            .finally(() => {
                this.setState({isLoading: false})
            })
    };

    render() {
        const { isVisible, isLoading, classes } = this.props;
        const { snackbarIsOpen, snackbarMessage } = this.state;

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