import React, {Component} from 'react';

import eventHandler, {Events} from "../../../core/EventHandler";

// Material-ui
import TextField from '@material-ui/core/TextField';
// Material icons
import {Close} from "mdi-material-ui";

import QueueSearchChooser from './QueueSearchChooser';

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
                        className="field"/>
                    {/* the Close icon clears the input */}
                    <Close className="button--clear" onClick={() => this.onInputUpdate({target:{value:""}})}/>
                </div>
                <div className="queue__preview">
                    <QueueSearchChooser />
                </div>
            </div>
        );
    }
}

export default QueueAdd;