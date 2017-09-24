import React, { Component } from 'react';
import {
  AppRegistry,
} from 'react-native';

import Routes from './Routes';

class App extends Component {
  render() {
    return (
      <Routes />
    );
  }
}

AppRegistry.registerComponent('TrabalhoReactNative', () => App);
