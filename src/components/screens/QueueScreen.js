import React, { Component } from 'react';

import Queue from './Queue/Queue';

class QueueScreen extends Component {
    render() {
        const { screenContainer, isShown } = this.props;

        return (
            <div className={`container screen ${isShown ? "visible": ""}`}>
                <div>Queue screen</div>
                <button onClick={() => screenContainer.moveToScreen("Player")}>Move!</button>
                <Queue />
            </div>
        );
    }
}

export default QueueScreen;