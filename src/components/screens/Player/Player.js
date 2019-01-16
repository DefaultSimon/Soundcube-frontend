import React, { Component } from 'react';

import Logger from '../../../api/Logger';
import soundcubeApi from '../../../api/Api';
import eventHandler, { Events } from '../../../api/EventHandler';

// Material-UI
import { SkipPrevious, Play, Pause, Stop, SkipNext } from "mdi-material-ui";
import IconButton from "@material-ui/core/es/IconButton/IconButton";
import { withStyles } from "@material-ui/core/styles";
import PlayerTrackProgressBar from "./PlayerTrackProgressBar";

const log = new Logger("Player");

const styles = theme => ({

});

class Player extends Component {
    constructor(props) {
        super(props);

        this.api = soundcubeApi;
        this.buttons = [
            {
                name: "skip-previous",
                svg: SkipPrevious,
                onClick: this.player_previous
            },
            {
                name: "play",
                svg: Play,
                onClick: this.player_play
            },
            {
                name: "pause",
                svg: Pause,
                onClick: this.player_pause
            },
            {
                name: "stop",
                svg: Stop,
                onClick: this.player_stop
            },
            {
                name: "next",
                svg: SkipNext,
                onClick: this.player_next
            }
        ];

        this.state = {
            currentSong: null,
            isPlaying: false,
            time: null,
            currentSongProgress: 0
        };

        // Subscribe to events
        eventHandler.subscribeToEvent(Events.updateCurrentSong, this.updateSongInfo);
    }

    componentWillMount() {
        this.updateSongInfo();
    }

    updateSongInfo = () => {
        this.api.player_getCurrentSong()
            .then((response) => {
                if (response.status === 200) {
                    this.setState({
                        currentSong: response.data["current_song"],
                        isPlaying: response.data["is_playing"],
                        time: response.data["time"]
                    })
                }
            })
            .catch((error) => {
                // This is set up the chain if the request has no response
                if (error.requestFailed) {
                    return;
                }

                if (error.response.status === 440) {
                    log.debug("No song is playing");
                    this.setState({ currentSong: null, isPlaying: false, time: null })
                }
                else {
                    log.warn(`Requested current song, got status code ${error.status}`)
                }
            })
    };

    _update_player = (playingStatusOptions) => {
        eventHandler.emitEvent(Events.updatePlayingStatus, playingStatusOptions);
        this.updateSongInfo();
    };

    player_previous = () => {
        log.info("Got action: previous");

        this.api.player_previous()
            .then(() => this._update_player({ forceIsPlaying: true, startAt: 0, refreshIn: 1.5 }))
            .catch(() => {});
    };
    player_play = () => {
        log.info("Got action: play");

        this.api.player_resume()
            .then(() => this._update_player({ forceIsPlaying: true, refreshIn: 1 }))
            .catch(() => {});
    };
    player_pause = () => {
        log.info("Got action: pause");

        this.api.player_pause()
            .then(() => this._update_player({ forceIsPlaying: false}))
            .catch(() => {});
    };
    player_stop = () => {
        log.info("Got action: stop");

        this.api.player_stop()
            .then(() => this._update_player({ forceIsPlaying: false, startAt: 0}))
            .catch((err) => {
                if (err.response.status === 440) {
                    this._update_player({ forceIsPlaying: false, startAt: 0})
                }
            });
    };
    player_next = () => {
        log.info("Got action: next");

        this.api.player_next()
            .then(() => this._update_player({ forceIsPlaying: true, startAt: 0, refreshIn: 1.5 }))
            .catch(() => {});
    };

    render() {
        return (
            <div className="player flex col flex--middle">
                <div className="player__title">
                    {this.state.currentSong !== null ?
                        this.state.currentSong.title
                        : "No song loaded."
                    }
                </div>
                {/* TODO make this dynamic */}
                <PlayerTrackProgressBar />
                <div className="player__control">
                    {
                        // Generates controls with proper callbacks
                        this.buttons.map(({name, svg, onClick}) => {
                            const Icon = svg;

                            return (
                                <IconButton
                                    key={name}
                                    color="secondary"
                                    aria-label={name}
                                    onClick={onClick}>
                                    <Icon fontSize="large"/>
                                </IconButton>
                            );

                        })
                    }
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(Player);