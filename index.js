/**
 * @format
 */
import * as React from 'react';
import {AppRegistry} from 'react-native';
import AppNavigator from './App';
import {name as appName} from './app.json';
import {Provider as PaperProvider} from 'react-native-paper';

export default function Main() {
  return (
    <PaperProvider>
      <AppNavigator />
    </PaperProvider>
  );
}

AppRegistry.registerComponent(appName, () => Main);
