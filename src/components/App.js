import React, { Component } from 'react';
import '../styles/main.scss';

// api-related
import soundcubeApi from '../api/Api';
import globalStore from '../api/GlobalStore';
import Logger from '../api/Logger';

// Children
import Sidebar from './sidebar/Sidebar';
import ScreenContainer from './ScreenContainer';

// Material-UI
import { createMuiTheme, withStyles } from "@material-ui/core/styles";
import variables from '../styles/base/_variables.scss';

import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from "@material-ui/core/es/Toolbar/Toolbar";
import Typography from "@material-ui/core/es/Typography/Typography";
import Drawer from "@material-ui/core/es/Drawer/Drawer";

// Utilities
const log = new Logger("App");

// Material-UI palette and other stuff
// Created from variables inside _variables.scss inside /styles/base/
createMuiTheme({
    palette: {
        primary: {
            main: variables.primary
        },
        secondary: {
            main: variables.secondary
        },
        error: {
            main: variables.error
        }
    },
    typography: {
        fontFamily: variables.fontFamily,
        fontSize: variables.fontSize,
    }
});

const styles = theme => ({
    menuIcon: {
        color: "#fff"
    },
    iconButton: {
        marginLeft: -15,
        marginRight: 3
    },

    appBar: {
        zIndex: theme.zIndex.drawer + 1
    },
    drawer: {
        width: 190,
        flexShrink: 0
    },
    drawerPaper: {
        width: 190,
        top: 50
    }
});

class App extends Component {
    constructor(props) {
        super(props);

        // TODO make this dynamic
        globalStore.putInStore("server", {ip: "localhost", port: 5000})
    }

    componentDidMount() {
        // Make sure the server is online
        soundcubeApi.ping()
            .then(function (response) {
                if (response.status !== 200) {
                    log.error("Server is not reachable!")
                }
                else {
                    log.info("Server reachable.")
                }
            })
    }

    render() {
        const { classes } = this.props;

        return (
            <div className="body">
                {/* Resets and stuff */}
                <CssBaseline/>

                {/* Top bar */}
                <AppBar position="fixed" className={classes.appBar}>
                    <Toolbar variant="dense" className="toolbar">
                        <IconButton className={classes.iconButton}>
                            <MenuIcon className={classes.menuIcon} />
                        </IconButton>
                        <Typography variant="h5" color="inherit">
                            Soundcube
                        </Typography>
                    </Toolbar>
                </AppBar>

                {/* Left drawer */}
                <Drawer
                    className={classes.drawer}
                    variant="permanent"
                    classes={{
                        paper: classes.drawerPaper
                    }}>
                    <Sidebar/>
                </Drawer>

                {/* Screens */}
                <main>
                    <ScreenContainer/>
                </main>
            </div>
        );
    }
}

export default withStyles(styles)(App);
