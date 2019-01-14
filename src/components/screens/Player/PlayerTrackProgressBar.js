import React, { Component } from 'react';

class PlayerTrackProgressBar extends Component {
    render() {
        const { progress } = this.props;

        return (
            <div className="player__track">
                <div id="track_full"/>
                <div id="track_progress" style={{ width: progress + "%" }}/>
            </div>
        );
    }
}

export default PlayerTrackProgressBar;