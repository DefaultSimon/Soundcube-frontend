import React, { Component } from 'react';

import Logger from '../../../api/Logger';
import soundcubeApi from '../../../api/Api';
import eventHandler, { Events } from '../../../api/EventHandler';
import { resolveTime, timeFormatWithColon } from '../../../api/Utilities';

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
        this.interval = null;

        this.playerTrack = React.createRef();

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

    removeRefreshInterval() {
        clearInterval(this.refreshInterval);
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
        this.removeProgressInterval();
        this.removeRefreshInterval();
    }

    updatePlayingStatus = (options) => {
        const { forceIsPlaying = null, startAt = null, refreshIn = null } = options;

        const canRefresh = refreshIn !== null;

        if (forceIsPlaying === true || forceIsPlaying === false) {
            const currentTime = this.state.time;
            log.debug("Forcing playing status: " + forceIsPlaying);

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

    handleMouseClick = (e) => {
        const x = e.nativeEvent.offsetX;
        const totalWidth = this.playerTrack.current.offsetWidth;

        // Calculate percentage offset inside the progress bar
        const amount = (x / totalWidth).toFixed(4);
        const timeSeconds = (amount * this.state.totalTime).toFixed(2);

        log.debug(`Clicked at ${(amount * 100).toFixed(1)}%, changing time to ${timeSeconds}...`);

        this.api.player_time_set(timeSeconds)
            .then((response) => {
                if (response.status === 200) {
                    log.info("Changed time!");

                    this.setState({time: timeSeconds});
                    setTimeout(() => {
                        this.updateTimeInfo()
                    }, 2000)
                }
            })
            .catch((err) => {
                if (err.requestFailed) {
                    return;
                }

                if (err.response.status === 441) {
                    log.warn("Can't change time, internal error / outside time bounds.")
                }
            })
    };

    render() {
        return (
            <div className="player__progress">
                <div ref={this.playerTrack} className="track" onClick={this.handleMouseClick}>
                    <div id="track_full"/>
                    <div id="track_progress" style={{width: (this.state.time / this.state.totalTime * 100) + "%"}}/>
                </div>
                <div className="time">
                    <span>{resolveTime(parseInt(this.state.time), timeFormatWithColon)}</span>
                    <span>{resolveTime(this.state.totalTime, timeFormatWithColon)}</span>
                </div>
            </div>
        );
    }
}

export default PlayerTrackProgressBar;