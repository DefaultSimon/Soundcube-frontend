import React, { Component } from 'react';

import eventHandler, {Events} from "../../../core/EventHandler";

class PlayerSongTitle extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentTitle: null
        };

        eventHandler.subscribeToEvent(Events.songInfoUpdated, this.songInfoChanged, "player_titlechanged")
    }

    /**
     * Update the song with new data, extracts the title
     * @param {object} data - An object containing the new song information
     */
    songInfoChanged = data => {
        const title = data === null ? null : data.title;

        this.setState({
            currentTitle: title
        })

    };

    render() {
        return (
            <div className="player__title">
                {this.state.currentTitle !== null ?
                    this.state.currentTitle
                    : "No song loaded."
                }
            </div>
        );
    }
}

export default PlayerSongTitle;