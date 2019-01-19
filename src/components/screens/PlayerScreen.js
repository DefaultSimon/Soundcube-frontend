import React, { Component } from 'react';

import Player from './Player/Player';

// Material-UI
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/es/Card/Card";

const styles = theme => ({
    playerTitle: {
        padding: "15px 0"
    },
    cardWidth: {
        width: "95%",
        padding: "15px 2px 30px 2px"
    }
});

class PlayerScreen extends Component {
    render() {
        const { isShown, classes } = this.props;

        return (
            <div className={`screen fullwidth ${isShown ? "visible": ""}`}>
                <Card className={classes.cardWidth}>
                    <div className="screen__card">
                        <Typography component="h3" variant="h3" className={classes.playerTitle}>
                            Player
                        </Typography>
                        <Player/>
                    </div>
                </Card>
            </div>
        );
    }
}

export default withStyles(styles)(PlayerScreen);