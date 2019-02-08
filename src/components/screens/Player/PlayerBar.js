import React, { Component } from 'react';

import eventHandler, {Events} from "../../../core/EventHandler";
import soundcubeApi from '../../../core/Api';
import Logger from "../../../core/Logger";

import IconButton from "@material-ui/core/IconButton";
import { withStyles } from "@material-ui/core/styles";

import { SkipPrevious, Play, Pause, Stop, SkipNext } from "mdi-material-ui";

import PlayerBarVolume from "./PlayerBarVolume";

const log = new Logger("PlayerBar");

const styles = theme => ({
    buttonMargins: {
        margin: "2px 8px;"
    }
});

class PlayerBar extends Component {
    constructor(props) {
        super(props);

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
            time: null
        };

        // Subscribe to events
        eventHandler.subscribeToEvent(Events.updateCurrentSong, this.updateSongInfo, "playerbar_updateinfo");

        // Update the current song when loading
        this.updateSongInfo();
    }

    updateSongInfo = () => {
        soundcubeApi.player_getCurrentSong()
            .then((response) => {
                if (response.status === 200) {
                    this.setState({
                        currentSong: response.data["current_song"],
                        isPlaying: response.data["is_playing"],
                        time: response.data["time"]
                    });

                    eventHandler.emitEvent(Events.songInfoUpdated, response.data["current_song"])
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

                eventHandler.emitEvent(Events.songInfoUpdated, null)
            })
    };

    _update_player = (playingStatusOptions) => {
        eventHandler.emitEvent(Events.updatePlayingStatus, playingStatusOptions);
        this.updateSongInfo();
    };

    player_previous = () => {
        log.info("Got action: previous");

        soundcubeApi.player_previous()
            .then(() => this._update_player({ forceIsPlaying: true, startAt: 0, refreshIn: 1.5 }))
            .catch((err) => {
                if (err.requestFailed) {
                    return;
                }
            });
    };
    player_play = () => {
        log.info("Got action: play");

        soundcubeApi.player_resume()
            .then(() => this._update_player({ forceIsPlaying: true, refreshIn: 1.5 }))
            .catch(() => {});
    };
    player_pause = () => {
        log.info("Got action: pause");

        soundcubeApi.player_pause()
            .then(() => this._update_player({ forceIsPlaying: false}))
            .catch(() => {});
    };
    player_stop = () => {
        log.info("Got action: stop");

        soundcubeApi.player_stop()
            .then(() => this._update_player({ forceIsPlaying: false, startAt: 0}))
            .catch((err) => {
                if (err.requestFailed) {
                    return;
                }

                if (err.response.status === 440) {
                    this._update_player({ forceIsPlaying: false, startAt: 0})
                }
            });
    };
    player_next = () => {
        log.info("Got action: next");

        soundcubeApi.player_next()
            .then(() => this._update_player({ forceIsPlaying: true, startAt: 0, refreshIn: 1.5 }))
            .catch(() => {});
    };

    render() {
        const { classes } = this.props;

        return (
            <div className="player__control">
                {
                    // Generates controls with proper callbacks
                    this.buttons.map(({name, svg, onClick}) => {
                        const Icon = svg;

                        return (
                            <IconButton
                                className={classes.buttonMargins}
                                key={name}
                                color="secondary"
                                aria-label={name}
                                onClick={onClick}>
                                <Icon fontSize="large"/>
                            </IconButton>
                        );
                    })
                }
                <PlayerBarVolume/>
            </div>
        );
    }
}

export default withStyles(styles)(PlayerBar);