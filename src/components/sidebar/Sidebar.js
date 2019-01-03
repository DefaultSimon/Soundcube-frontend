import React, { Component } from 'react';

import eventHandler from '../../api/EventHandler';
import SidebarLink from './SidebarLink';


class Sidebar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            items: [
                {
                    text: "Player",
                    screen: "Player",
                    icon: "/icons/player.svg"
                },
                {
                    text: "Queue",
                    screen: "Queue",
                    icon: "/icons/queue.svg"
                },
                {
                    text: "Music",
                    screen: "Music",
                    icon: "/icons/music.svg"
                },
                {
                    text: "Settings",
                    screen: "Settings",
                    icon: "/icons/settings.svg"
                },
            ]
        }
    }

    loadClickedScreen = (screen) => {
        eventHandler.emitEvent(eventHandler.common.moveToScreen, screen)
    };

    render() {
        return (
            <aside className="sidebar">
                <h3 className="title">Soundcube</h3>
                {this.state.items.map(({ text, screen, icon }) => (
                    <SidebarLink key={text} text={text} icon={icon} onClick={() => this.loadClickedScreen(screen)} />
                ))}
            </aside>
        );
    }
}

export default Sidebar;