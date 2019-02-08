import React, { Component } from 'react';

import eventHandler, {Events} from "../../../core/EventHandler";

// Material-UI
import PlayerTrackProgressBar from "./PlayerTrackProgressBar";
import PlayerControlBar from "./PlayerBar";

class Player extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentSongTitle: null
        };

        eventHandler.subscribeToEvent(Events.songInfoUpdated, this.onSongUpdate, "player_onsongupdate")
    }

    onSongUpdate = data => {
        const title = data === null ? null : data.title;

        this.setState({
            currentSongTitle: title
        })
    };

    render() {
        const { className } = this.props;

        return (
            <div className={`player flex col flex--middle ${className}`}>
                <div className="player__title">
                    {this.state.currentSongTitle !== null ?
                        this.state.currentSongTitle
                        : "No song loaded."
                    }
                </div>
                {/* TODO make this dynamic */}
                <PlayerTrackProgressBar />
                <PlayerControlBar />
            </div>
        );
    }
}

export default Player;