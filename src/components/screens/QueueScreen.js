import React, { Component } from 'react';

import eventHandler, { Events } from '../../api/EventHandler';
import Queue from './Queue/Queue';

import TextField from '@material-ui/core/TextField';
import Button from "@material-ui/core/es/Button";

class QueueScreen extends Component {
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
                        value="eqY3FaZmh-Y"
                        margin="normal"
                        variant="filled"
                    />
                    <Button className="submit" variant="contained">
                        Queue video
                    </Button>
                </div>


                <Queue />
            </div>
        );
    }
}

export default QueueScreen;