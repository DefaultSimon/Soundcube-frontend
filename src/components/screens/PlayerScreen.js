import React, { Component } from 'react';

import Player from './Player/Player';

import soundcubeApi from '../../api/Api';

class PlayerScreen extends Component {
    render() {
        const { screenContainer, isShown } = this.props;

        return (
            <div className={`screen fullwidth ${isShown ? "visible": ""}`}>
                <div>Player screen</div>
                <div>
                    <button onClick={() => screenContainer.moveToScreen("Queue")}>Move!</button>
                    <button onClick={() => soundcubeApi.player_quickQueue("mg2cMqW_hOY")}>Load sample song</button>
                </div>
                <Player/>
            </div>
        );
    }
}

export default PlayerScreen;