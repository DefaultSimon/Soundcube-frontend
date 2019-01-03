import React, { Component } from 'react';

class QueueScreen extends Component {
    render() {
        const { screenContainer, isShown } = this.props;

        return (
            <div className={`screen ${isShown ? "show": ""}`}>
                <div>Queue screen</div>
                <button onClick={() => screenContainer.moveToScreen("Player")}>Move!</button>
            </div>
        );
    }
}

export default QueueScreen;