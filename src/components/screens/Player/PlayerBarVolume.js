import React, { Component } from 'react';

import api from '../../../core/Api';
import Logger from '../../../core/Logger';

import Slider from 'react-rangeslider';

const log = new Logger("PlayerBarVolume");

class PlayerBarVolume extends Component {
    constructor(props) {
        super(props);

        this.state = {
            volume: 0
        };

        this.volumeSetTimeout = null;

        api.player_volume_get()
            .then((response) => {
                if (response.status === 200) {
                    this.setState({ volume: response.data["volume"] });
                    log.debug(`Loaded and updated volume to ${response.data['volume']}`)
                }
            })
    }

    onValueChange = (value) => {
        this.setState({ volume: value });

        // Rate-limit how fast we send the change to the server
        if (this.volumeSetTimeout !== null) {
            clearTimeout(this.volumeSetTimeout)
        }
        this.volumeSetTimeout = setTimeout(() => {this.setVolume(value)}, 75);
    };

    setVolume = (volume) => {
        console.log(volume);

        api.player_volume_set(volume)
            .catch((err) => {
                if (err.requestFailed) {
                    return;
                }

                console.log(err.response);
            });
    };


    render() {
        return (
            <div className="slider-container">
                <Slider
                    min={0}
                    max={100}
                    value={this.state.volume}
                    onChange={this.onValueChange}
                    tooltip={false}
                />
                <span className="rangeslider-background"/>
            </div>
        );
    }
}

export default PlayerBarVolume;