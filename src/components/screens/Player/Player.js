import React, { Component } from 'react';
import ReactSVG from 'react-svg';

import Logger from '../../../api/Logger';
import soundcubeApi from '../../../api/Api';

const log = new Logger("Player");

class Player extends Component {
    constructor(props) {
        super(props);

        this.api = soundcubeApi;
        this.buttons = [
            {
                name: "skip-previous",
                svg: "/icons/skip-previous.svg",
                onClick: this.player_previous
            },
            {
                name: "play",
                svg: "/icons/play.svg",
                onClick: this.player_play
            },
            {
                name: "pause",
                svg: "/icons/pause.svg",
                onClick: this.player_pause
            },
            {
                name: "stop",
                svg: "/icons/stop.svg",
                onClick: this.player_stop
            },
            {
                name: "next",
                svg: "/icons/skip-next.svg",
                onClick: this.player_next
            }
        ];
    }

    player_previous = () => {
        log.info("Got event: previous");
        this.api.player_previous();
    };
    player_play = () => {
        log.info("Got event: play");
        this.api.player_resume();
    };
    player_pause = () => {
        log.info("Got event: pause");
        this.api.player_pause();
    };
    player_stop = () => {
        log.info("Got event: stop");
        this.api.player_stop();
    };
    player_next = () => {
        log.info("Got event: next");
        this.api.player_next();
    };

    render() {
        return (
            <div className="player flex col flex--middle">
                <div className="player__title">Sample Artist - Song 15</div>
                <div className="player__track">
                    <div id="track_full"/>
                    <div id="track_progress"/>
                </div>
                <div className="player__control">
                    {
                        // Generates controls with proper callbacks
                        this.buttons.map(({name, svg, onClick}) => {
                            return <span key={name} onClick={onClick}><ReactSVG svgClassName={name} src={svg} wrapper="span"/></span>
                        })
                    }
                </div>
            </div>
        );
    }
}

export default Player;