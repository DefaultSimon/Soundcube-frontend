import React, {Component} from 'react';

// Material-UI
import PlayerTrackProgressBar from "./PlayerTrackProgressBar";
import PlayerControlBar from "./PlayerBar";
import PlayerSongTitle from "./PlayerSongTitle";

class Player extends Component {
    render() {
        const {className} = this.props;

        return (
            <div className={`player flex col flex--middle ${className}`}>
                <PlayerSongTitle />
                {/* TODO make this dynamic */}
                <PlayerTrackProgressBar/>
                <PlayerControlBar/>
            </div>
        );
    }
}

export default Player;