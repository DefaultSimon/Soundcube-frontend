import React, { Component } from 'react';
import '../styles/main.scss';

import soundcubeApi from '../api/Api';
import globalStore from '../api/GlobalStore';
import Logger from '../api/Logger';

import Sidebar from './sidebar/Sidebar';
import ScreenContainer from './ScreenContainer';

const log = new Logger("App");

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
        return (
            <div className="body">
                <Sidebar/>
                <ScreenContainer/>
            </div>
        );
    }
}

export default App;
