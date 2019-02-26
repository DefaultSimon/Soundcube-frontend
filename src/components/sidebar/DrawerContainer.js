import React, {Component} from 'react';
import Sidebar from "./Sidebar";

import eventHandler, {Events} from "../../core/EventHandler";

import Drawer from "@material-ui/core/Drawer";

class DrawerContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: false
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
        const {isOpen} = this.state;

        // The drawer has a class open, if opened
        const statusClassName = ["drawer", isOpen ? "open": ""].join(" ");

        return (
            <Drawer
                className={statusClassName}
                variant="permanent"
                PaperProps={{
                    className:"drawer--paper"
                }}
                open={isOpen}>
                <Sidebar/>
            </Drawer>
        );
    }
}

export default DrawerContainer;