import React, {Component} from 'react';
import Sidebar from "./Sidebar";

import eventHandler, {Events} from "../../core/EventHandler";

import {withStyles} from "@material-ui/core";
import Drawer from "@material-ui/core/Drawer";

const drawerWidth = 190;

const styles = theme => ({
    drawer: {
        width: drawerWidth,
        flexShrink: 0
    },
    drawerPaper: {
        top: 42
    },

    open: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    close: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing.unit * 7 + 1
    },
});

class DrawerContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: true
        };

        eventHandler.subscribeToEvent(Events.toggleDrawerState, this.toggleDrawerState)
    }

    /**
     * Open/Close the drawer
     */
    toggleDrawerState = () => {
        this.setState({
            isOpen: !this.state.isOpen
        })
    };

    render() {
        const {classes} = this.props,
              {isOpen} = this.state;

        const drawerClass = [classes.drawer, isOpen ? classes.open : classes.close].join(" "),
              paperClass = [classes.drawerPaper, isOpen ? classes.open : classes.close].join(" ");

        return (
            <Drawer
                className={classes.drawer}
                variant="permanent"
                classes={{
                    root: drawerClass,
                    paper: paperClass
                }}
                open={isOpen}>
                <Sidebar/>
            </Drawer>
        );
    }
}

export default withStyles(styles)(DrawerContainer);