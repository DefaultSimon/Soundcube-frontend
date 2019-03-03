import React, {Component} from "react";

import api from "../../../core/Api";
import Logger from "../../../core/Logger";
import eventHandler, {Events} from "../../../core/EventHandler";

import {ShapePolygonPlus} from "mdi-material-ui";

// Material-UI
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

const log = new Logger("QueueSearchResultOverlay");



class QueueSearchResultOverlay extends Component {
    constructor(props) {
        super(props);

        this.state = {
            videoId: props.itemInfo.id,

            isLoading: false,
            isLoaded: false
        };
    }

    /**
     * Queues a song and requests a queue update
     */
    queueSong = () => {
        this.setState({isLoading: true, isLoaded: false});

        const req = api.player_quickQueue(this.state.videoId);
        const proc = req.then((response) => {
            if (response.status === 200) {
                eventHandler.emitEvent(Events.updateQueue);
            }
        })
            .catch((err) => {
                if (err.requestFailed) {
                    return
                }

                eventHandler.emitEvent(Events.updateQueue);
            });

        Promise.all([req, proc])
            .then(([resp, message]) => {
                eventHandler.emitEvent(Events.showSnackbar, "Song queued!");
            })
            .catch((err) => {
                eventHandler.emitEvent(Events.showSnackbar, "Something went wrong while queueing...");
                log.warn(`Something went wrong while quickQueueing: ${err}`)

            })
            .finally(() => {
                this.setState({isLoading: false, isLoaded: true});
                // The closing animation takes .5s
                setTimeout(() => {
                    this.props.closeSelf();
                    this.setState({isLoaded: false})
                }, 550)
            })
    };

    render() {
        const {isVisible} = this.props;
        const {isLoading, isLoaded} = this.state;

        const overlayClasses = ["overlay",
                                isVisible  ? "visible": "",
                                isLoading ? "loading" : "",
                                isLoaded ? "loaded": ""].join(" ");

        return (
            <tr className={overlayClasses}>
                <Button className="queue-button" variant="outlined" onClick={this.queueSong}>
                    <span className="panel">
                        <ShapePolygonPlus className="icon"/>
                        <span>Add song to queue</span>
                    </span>
                    <span className="panel">
                        <CircularProgress size={24} className="progress"/>
                    </span>
                </Button>
            </tr>
        );
    }
}

export default QueueSearchResultOverlay;