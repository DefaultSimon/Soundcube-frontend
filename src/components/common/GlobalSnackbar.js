import React, { Component } from 'react';

import eventHandler, {Events} from "../../core/EventHandler";

import {withStyles} from "@material-ui/core";
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';

//import {LibraryPlus} from "mdi-material-ui";

const styles = theme => ({
    snackbarContent: {
        borderBottomLeftRadius: "0",
        borderBottomRightRadius: "0"
    },
    snackbarText: {
        display: "flex",
        alignItems: "center"
    }
});

class GlobalSnackbar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,
            message: null
        };
        this.snackbarCloseInterval = null;

        eventHandler.subscribeToEvent(Events.showSnackbar, this.showSnackbar, "snackbar_show");
        eventHandler.subscribeToEvent(Events.closeSnackbar, this.closeSnackbar, "snackbar_close");
    }

    /**
     * Shows (opens) the global snackbar
     * @param {string} message - message to show in the snackbar
     * @param {number} autoHideDurationMs - time in ms until the message should disappear
     */
    showSnackbar = (message, autoHideDurationMs = 5000) => {
        clearInterval(this.snackbarCloseInterval);

        this.setState({
            isOpen: true,
            message: message
        });

        this.snackbarCloseInterval = setInterval(() => {
            this.closeSnackbar()
        }, autoHideDurationMs);
    };

    /**
     * Closes the snackbar
     */
    closeSnackbar = () => {
        this.setState({
            isOpen: false,
            message: null
        })
    };

    render() {
        const {classes} = this.props;
        const {isOpen, message} = this.state;

        return (
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                open={isOpen}
                autoHideDuration={null}>
                <SnackbarContent
                    className={classes.snackbarContent}
                    message={<span className={classes.snackbarMessage}>{message}</span>}>
                </SnackbarContent>
            </Snackbar>
        );
    }
}

export default withStyles(styles)(GlobalSnackbar);