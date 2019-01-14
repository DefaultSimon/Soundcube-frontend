import React, { Component } from 'react';

import Player from './Player/Player';

import eventHandler, { Events } from '../../api/EventHandler';
import soundcubeApi from '../../api/Api';

// Material-UI
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

const styles = theme => ({
    playerTitle: {
        padding: "15px 0"
    },
});

class PlayerScreen extends Component {
    demoQueue = () => {
        soundcubeApi.queue_add("mg2cMqW_hOY", 0, true)
            .then(() => {
                eventHandler.emitEvent(Events.updateCurrentSong)
            })
            .catch((error) => {
                console.log(error);
            })
    };

    render() {
        const { isShown, classes } = this.props;

        return (
            <div className={`screen fullwidth ${isShown ? "visible": ""}`}>
                <Typography component="h3" variant="h3" className={classes.playerTitle}>
                    Player
                </Typography>
                <div>
                    <Button variant="contained" onClick={this.demoQueue}>
                        Load sample song
                    </Button>
                </div>
                <Player/>
            </div>
        );
    }
}

export default withStyles(styles)(PlayerScreen);