import React, { Component } from 'react';

import soundcubeApi from '../../../api/Api';

import { LibraryPlus } from "mdi-material-ui";
import { withStyles } from "@material-ui/core";

import TextField from '@material-ui/core/TextField';
import Button from "@material-ui/core/es/Button";
import Snackbar from '@material-ui/core/Snackbar';
import CircularProgress from "@material-ui/core/es/CircularProgress/CircularProgress";
import SnackbarContent from "@material-ui/core/es/SnackbarContent/SnackbarContent";
import eventHandler, {Events} from "../../../api/EventHandler";

const styles = theme => ({
    textFieldSpacing: {
        margin: 15,
        minWidth: 350
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

class QueueSectionAdd extends Component {
    constructor(props) {
        super(props);

        this.state = {
            videoIdInput: "eqY3FaZmh-Y",
            isLoading: false,

            isSnackbarOpen: false,
            snackbarMessage: null
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

        const req = this.api.player_quickQueue(this.state.videoIdInput);
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

    onInputUpdate = (event) => {
        this.setState({ videoIdInput: event.target.value })
    };

    render() {
        const { isLoading, isSnackbarOpen, snackbarMessage } = this.state;
        const { classes } = this.props;

        return (
            <div className="queue__add">
                <TextField
                    id="video_id_input"
                    label="Video ID"
                    value={this.state.videoIdInput}
                    margin="normal"
                    variant="filled"
                    onChange={this.onInputUpdate}
                    className={classes.textFieldSpacing} />

                <div className="queue__button">
                    <Button
                        className="submit"
                        variant="contained"
                        onClick={this.queueSong}
                        disabled={isLoading}>
                        Queue video
                    </Button>
                    {isLoading && <CircularProgress size={24} className={classes.loadingProgress} />}

                    <Snackbar
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                        }}
                        open={isSnackbarOpen}
                        autoHideDuration={4000}
                        onClose={this.closeSnackbar}>
                        <SnackbarContent
                            message={<span className={classes.snackbarMessage}>{snackbarMessage}</span>}
                            action={[
                                <LibraryPlus key="lib" />
                            ]}>
                        </SnackbarContent>
                    </Snackbar>
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(QueueSectionAdd);