import React, {Component} from 'react';

import eventHandler, {Events} from "../../../core/EventHandler";

// Material-ui
import {withStyles} from "@material-ui/core";
import TextField from '@material-ui/core/TextField';
// Material icons
import {Close} from "mdi-material-ui";

import QueueSearchChooser from './QueueSearchChooser';

const styles = theme => ({
    textFieldSpacing: {
        margin: 15,
        minWidth: 350,
        width: "60%"
    },
    clearButton: {
        cursor: "pointer"
    }
});

class QueueAdd extends Component {
    constructor(props) {
        super(props);

        this.state = {
            searchText: "",
            isLoading: false,

            isSnackbarOpen: false,
            snackbarMessage: null
        };
    }

    /**
     * Triggered when the TextField updates
     */
    onInputUpdate = (event) => {
        this.setState({searchText: event.target.value});

        eventHandler.emitEvent(Events.searchTextUpdated, event.target.value)
    };

    render() {
        const {classes} = this.props;

        return (
            <div>
                <div className="queue__add">
                    <TextField
                        id="video_id_input"
                        label="Search for a video"
                        value={this.state.searchText}
                        margin="normal"
                        variant="filled"
                        onChange={this.onInputUpdate}
                        className={classes.textFieldSpacing}/>
                    {/* the Close icon clears the input */}
                    <Close className={classes.clearButton} onClick={() => this.onInputUpdate({target:{value:""}})}/>
                </div>
                <div className="queue__preview">
                    <QueueSearchChooser />
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(QueueAdd);