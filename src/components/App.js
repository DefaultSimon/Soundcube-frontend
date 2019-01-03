import React, { Component } from 'react';
import '../styles/main.scss';

import SoundcubeApi from '../api/Api';
import eventHandler from '../api/EventHandler';

import Sidebar from './sidebar/Sidebar';
import ScreenContainer from './ScreenContainer';


class App extends Component {
  constructor(props) {
    super(props);

      this.state = {
          api: new SoundcubeApi(),
          eventHandler: eventHandler
      }
  }

  render() {
    return (
        <div className="body">
          <Sidebar />
          <ScreenContainer />
        </div>
    );
  }
}

export default App;
