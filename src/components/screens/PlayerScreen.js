import React, { Component } from 'react';

import Player from './Player/Player';

// Material-UI
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import Divider from "@material-ui/core/Divider";

const styles = theme => ({
    playerTitle: {
        padding: "15px 0"
    },
    cardWidth: {
        width: "95%",
        padding: "15px 2px 30px 2px"
    },
    divider: {
        height: "2px",
        width: "80%"
    },
    playerComponent: {
        marginTop: "45px"
    }
});

class PlayerScreen extends Component {
    render() {
        const { isVisible, classes } = this.props;

        return (
            <div className={`screen fullwidth ${isVisible ? "visible": ""}`}>
                <Card className={classes.cardWidth}>
                    <div className="screen__card">
                        <Typography component="h3" variant="h3" className={classes.playerTitle}>
                            Player
                        </Typography>
                        <Divider className={classes.divider} />
                        <Player className={classes.playerComponent} />
                    </div>
                </Card>
            </div>
        );
    }
}

export default withStyles(styles)(PlayerScreen);