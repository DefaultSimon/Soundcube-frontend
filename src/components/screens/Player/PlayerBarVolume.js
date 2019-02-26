import React, {Component} from 'react';

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

    /**
     * Called when the slider changes, rate-limits how often the volume should be changed
     * @param {int} value - A number from 0 to 100
     */
    onValueChange = (value) => {
        this.setState({ volume: value });

        // Rate-limit how fast we send the change to the server
        if (this.volumeSetTimeout !== null) {
            clearTimeout(this.volumeSetTimeout)
        }
        this.volumeSetTimeout = setTimeout(() => {this.setVolume(value)}, 80);
    };

    /**
     * Sends volume change requests to the server
     * @param volume
     */
    setVolume = (volume) => {
        console.log(volume);

        api.player_volume_set(volume)
            .catch((err) => {});
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