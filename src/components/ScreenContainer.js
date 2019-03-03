import React, {Component} from 'react';
// Screen imports
import PlayerScreen from './screens/PlayerScreen';
import QueueScreen from "./screens/QueueScreen";
// Other imports
import eventHandler, {Events} from '../core/EventHandler';


class ScreenContainer extends Component {
    constructor(props) {
        super(props);

        // Register to events
        eventHandler.subscribeToEvent(Events.moveToScreen, this.moveToScreen, "sc_move");

        this.defaultScreen = "Player";

        this.state = {
            screens: {
                "Player": {
                    screen: PlayerScreen
                },
                "Queue": {
                    screen: QueueScreen
                },
                // TODO
                /*
                "Settings": {
                    screen: SettingsScreen
                }
                */
            },
            currentScreen: this.defaultScreen
        }
    }

    moveToScreen = (screenName) => {
        // Make sure the screen exists
        if (this.state.screens[screenName] === null) {
            return false;
        }

        this.setState({
            currentScreen: screenName
        });
        return true;
    };

    render() {
        const screenContainerThis = this;

        return (
            <React.Fragment>
                <div className="screens">
                    { // This will render all screens but show only the main one
                        Object.keys(this.state.screens).map((item) => {
                            const ThisComponent = this.state.screens[item].screen;
                            // Pass the isShown prop to the component if needed
                            let isVisible = item === this.state.currentScreen;

                            return <ThisComponent key={item} screenContainer={screenContainerThis} isVisible={isVisible}/>
                        })}
                </div>

            </React.Fragment>

        );
    }
}

export default ScreenContainer;