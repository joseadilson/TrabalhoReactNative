import React, { Component } from 'react';
import {
  AppRegistry,
  View
} from 'react-native';

import ListaLocais from './components/ListaLocais';

class App extends Component {
  render() {
    return (
      <View>
        <ListaLocais />
      </View>
    );
  }
}

AppRegistry.registerComponent('TrabalhoReactNative', () => App);
