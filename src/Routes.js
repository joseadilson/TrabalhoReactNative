import React from 'react';
import {
  AppRegistry,
  View
} from 'react-native';
import { StackNavigator } from 'react-navigation';

import ListPlaces from './components/ListPlaces';
import DetailsItems from './components/DetailsItems';

const Routes = StackNavigator({
  ListPlaces: { screen: ListPlaces },
  DetailsItems: { screen: DetailsItems }
})

export default Routes;
