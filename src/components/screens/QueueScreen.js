import React, { Component } from 'react';

import QueueList from './Queue/QueueList';
import QueueSectionAdd from "./Queue/QueueAdd";

class QueueScreen extends Component {
    render() {
        const { isVisible } = this.props;

        return (
            <div className={`container screen ${isVisible ? "visible": ""}`}>
                <div className="queue">
                    <QueueSectionAdd />
                    <QueueList />
                </div>
            </div>
        );
    }
}

export default QueueScreen;