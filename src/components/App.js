import React, { Component } from 'react';
import '../styles/main.scss';

import SoundcubeApi from '../api/Api';

import Button from './Button';


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      api: new SoundcubeApi()
    }
  }

  render() {
    return (
        <div>
          <h1>Test</h1>
          <Button text={"Ping"} onClickCallback={this.state.api.ping} />
        </div>
    );
  }
}

export default App;
