import React, {Component} from 'react';

import eventHandler, {Events} from '../../core/EventHandler';

// Material UI
import {withStyles} from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from '@material-ui/core/ListItem'
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";

import {RecordPlayer, PlaylistMusic, Tune} from 'mdi-material-ui';


const styles = theme => ({
    listItemIconMargin: {
        marginLeft: 5
    },

    listItemPadding: {
        padding: "0 1px"
    },

    listItemText: {
        fontSize: theme.typography.h6.fontSize
    },

    listItemActive: {
        backgroundColor: theme.palette.secondary.light
    }
});


class Drawer extends Component {
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
                    text: "Settings",
                    screen: "Settings",
                    icon: Tune
                },
            ],
            activeScreen: "Player"
        }
    }

    /**
     * Loads (well, shows; screens are always loaded) the required screen
     * @param {string} screen - name of the screen to load
     */
    loadClickedScreen = (screen) => {
        this.setState({activeScreen: screen});
        eventHandler.emitEvent(Events.moveToScreen, screen)
    };

    render() {
        const {classes} = this.props;

        return (
            <List component="nav" className="drawer--list">
                {this.state.items.map(({text, screen, icon}) => {
                    // Uppercase names are converted to components
                    const Icon = icon;
                    // Make the sidebar icon display if it is active
                    const selectedClass = screen === this.state.activeScreen ? "link active" : "link";

                    return (
                        <ListItem key={text} className={selectedClass} button
                                  onClick={() => this.loadClickedScreen(screen)}>
                            <ListItemIcon classes={{root: classes.listItemIconMargin}}>
                                <Icon/>
                            </ListItemIcon>
                            <ListItemText classes={{root: classes.listItemPadding, primary: classes.listItemText}}
                                          primary={text}/>
                        </ListItem>
                    );
                })}
            </List>
        );
    }
}

export default withStyles(styles)(Drawer);