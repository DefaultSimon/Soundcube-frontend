import React, { Component } from 'react';

class PlayerScreen extends Component {
    render() {
        const { screenContainer, isShown } = this.props;

        return (
            <div className={`screen ${isShown ? "show": ""}`}>
                <div>Player screen</div>
                <button onClick={() => screenContainer.moveToScreen("Queue")}>Move!</button>
            </div>
        );
    }
}

export default PlayerScreen;