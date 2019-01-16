import React, { Component } from 'react';

import soundcubeApi from '../../api/Api';
import eventHandler, { Events } from '../../api/EventHandler';
import Queue from './Queue/Queue';

import TextField from '@material-ui/core/TextField';
import Button from "@material-ui/core/es/Button";

class QueueScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            videoIdInput: "eqY3FaZmh-Y"
        };

        this.api = soundcubeApi;
    }

    queueSong = () => {
        this.api.player_quickQueue(this.state.videoIdInput)
            .then((response) => {
                if (response.status === 200) {
                    eventHandler.emitEvent(Events.updateQueue)
                }
            })
            .catch((err) => {
                eventHandler.emitEvent(Events.updateQueue)
            })
    };

    onInputUpdate = (event) => {
        this.setState({ videoIdInput: event.target.value })
    };

    render() {
        const { screenContainer, isShown } = this.props;

        return (
            <div className={`container screen ${isShown ? "visible": ""}`}>
                <div>Queue screen</div>
                <button onClick={() => screenContainer.moveToScreen("Player")}>Move!</button>
                <button onClick={() => eventHandler.emitEvent(Events.updateQueue)}>Refresh queue</button>

                <div className="queue-song">
                    <TextField
                        id="video_id_input"
                        label="Video ID"
                        value={this.state.videoIdInput}
                        margin="normal"
                        variant="filled"
                        onChange={this.onInputUpdate}
                    />
                    <Button className="submit" variant="contained" onClick={this.queueSong}>
                        Queue video
                    </Button>
                </div>


                <Queue />
            </div>
        );
    }
}

export default QueueScreen;