import React, { Component } from 'react';

import eventHandler, { Events } from '../../api/EventHandler';

// Material UI
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from '@material-ui/core/ListItem'
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";

import { RecordPlayer, PlaylistMusic, LibraryMusic, Tune } from 'mdi-material-ui';


const styles = theme => ({
    listItemIconMargin: {
        marginLeft: 5
    },

    listItemPadding: {
        padding: "0 1px"
    },

    listItemText: {
        fontSize: theme.typography.h6.fontSize
    }
});


class Sidebar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            items: [
                {
                    text: "Player",
                    screen: "Player",
                    icon: RecordPlayer
                },
                {
                    text: "Queue",
                    screen: "Queue",
                    icon: PlaylistMusic
                },
                {
                    text: "Music",
                    screen: "Music",
                    icon: LibraryMusic
                },
                {
                    text: "Settings",
                    screen: "Settings",
                    icon: Tune
                },
            ]
        }
    }

    loadClickedScreen = (screen) => {
        eventHandler.emitEvent(Events.moveToScreen, screen)
    };

    render() {
        const { classes } = this.props;

        return (
            <List component="nav">
            {this.state.items.map(({ text, screen, icon }) => {
                const Icon = icon;

                return (
                    <ListItem key={text} button onClick={() => this.loadClickedScreen(screen)}>
                        <ListItemIcon classes={{ root: classes.listItemIconMargin }}>
                            <Icon/>
                        </ListItemIcon>
                        <ListItemText classes={{ root: classes.listItemPadding, primary: classes.listItemText }} primary={text}/>
                    </ListItem>);
            })}
            </List>
        );
    }
}

export default withStyles(styles)(Sidebar);