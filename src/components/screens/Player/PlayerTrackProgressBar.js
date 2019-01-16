import React, { Component } from 'react';

import Logger from '../../../api/Logger';
import soundcubeApi from '../../../api/Api';
import eventHandler, { Events } from '../../../api/EventHandler';

const log = new Logger("PlayerProgressBar");

class PlayerTrackProgressBar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            time: 0,
            totalTime: 0,
            isPlaying: false
        };

        this.api = soundcubeApi;
        this.refreshInterval = null;
        this.interval = null;

        this.intervalIsRunning = false;

        eventHandler.subscribeToEvent(Events.updatePlayingStatus, this.updatePlayingStatus)
    }

    setProgressInterval() {
        log.debug("Setting interval for time updates...");

        // Clear previous interval
        clearInterval(this.interval);
        const delay = 1000;
        this.intervalIsRunning = true;

        // this.setState({isPlaying: true});
        this.interval = setInterval(() => {
            console.debug("Current time is " + this.state.time);
            this.setState({time: parseFloat(this.state.time) + (delay / 1000)})
        }, delay)
    }

    removeProgressInterval() {
        this.intervalIsRunning = false;
        clearInterval(this.interval);
    }

    setRefreshInterval() {
        const refreshInterval = 10000;

        // this.setState({isPlaying: true});
        this.refreshInterval = setInterval(() => {
            log.debug("Refreshing playing state...");
            this.updateTimeInfo()
        }, refreshInterval)
    }

    updateTimeInfo() {
        this.api.player_time_get()
            .then((response) => {
                if (response.status === 200) {

                    const newTime = response.data["time"];
                    const totalTime = response.data["total_length"];
                    const isPlaying = response.data["is_playing"];

                    if (typeof newTime === "undefined" || typeof totalTime === "undefined") {
                        log.error("newTime and totalTime are undefined, this shouldn't happen!!");
                        return;
                    }

                    this.setState({time: parseFloat(newTime), totalTime: parseFloat(totalTime)});
                    if (isPlaying === true) {
                        this.setProgressInterval()
                    }
                    else {
                        this.removeProgressInterval()
                    }
                }

            })
            .catch((err) => {
                if (err.response.status === 441) {
                    // No song is loaded
                    this.removeProgressInterval();
                    // Sample values to set progress bar to zero
                    this.setState({isPlaying: false, time: 0, totalTime: 100});
                }
            });
    }

    componentDidMount() {
        this.updateTimeInfo();
        this.setRefreshInterval();
    }

    componentWillUnmount() {
        this.removeProgressInterval()
    }

    updatePlayingStatus = (options) => {
        const { forceIsPlaying = null, startAt = null, refreshIn = null } = options;

        const canRefresh = refreshIn !== null;

        if (forceIsPlaying === true || forceIsPlaying === false) {
            const currentTime = this.state.time;
            log.debug("Forcing playing status: " + forceIsPlaying);

            console.log(startAt === null);

            if (forceIsPlaying === false) {
                this.removeProgressInterval()
            }

            this.setState({isPlaying: forceIsPlaying, time: startAt === null ? currentTime : startAt});

            // Specifying canRefresh will cause the progress bar to set your values, then check (optionally after some time) for time info.
            if (canRefresh === true) {
                setTimeout(() => this.updateTimeInfo(), refreshIn * 1000)
            }
        }
        else {
            this.updateTimeInfo()
        }
    };

    render() {
        return (
            <div className="player__track">
                <div id="track_full"/>
                <div id="track_progress" style={{width: (this.state.time / this.state.totalTime * 100) + "%"}}/>
            </div>
        );
    }
}

export default PlayerTrackProgressBar;