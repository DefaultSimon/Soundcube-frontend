import React, {Component} from 'react';

import api from '../../../core/Api';
import Logger from '../../../core/Logger';

import Slider from 'react-rangeslider';
import {VolumeOff, VolumeLow, VolumeMedium, VolumeHigh} from "mdi-material-ui";

const log = new Logger("PlayerBarVolume");

class PlayerBarVolume extends Component {
    constructor(props) {
        super(props);

        this.state = {
            volume: 50
        };

        this.volumeSetTimeout = null;
        this.iconVolumeMap = [
            [0, VolumeOff],
            [15, VolumeLow],
            [50, VolumeMedium],
            [100, VolumeHigh]
        ];

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
        if (!(0 <= value <= 100)) {
            log.warn(`Value was ${value}, not setting.`);
            return;
        }

        // Updates the visible value, but delays sending the request to the server to not flood it when dragging
        this.setState({ volume: value });

        // Rate-limit how fast we send the change to the server
        if (this.volumeSetTimeout !== null) {
            clearTimeout(this.volumeSetTimeout)
        }
        this.volumeSetTimeout = setTimeout(() => {this.setVolume(value)}, 65);
    };

    /**
     * Sends volume change requests to the server
     * @param volume
     */
    setVolume = (volume) => {
        api.player_volume_set(volume)
            .catch((err) => {});
    };


    render() {
        let VolumeIcon;
        for (let el of this.iconVolumeMap) {
            const [vol, iconEl] = el;

            if (this.state.volume <= vol) {
                VolumeIcon = iconEl;
                break;
            }
        }

        return (
            <div className="volume">
                <VolumeIcon className="volume-icon"/>
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
            </div>
        );
    }
}

export default PlayerBarVolume;