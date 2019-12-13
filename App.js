import React from 'react';
import {createAppContainer} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import HomeScreen from './screens/HomeScreen';
import WeightScreen from './screens/WeightScreen';

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}

const AppNavigator = createBottomTabNavigator(
  {
    Home: HomeScreen,
    Weight: WeightScreen,
  },
  {
    defaultNavigationOptions: ({navigation}) => ({
      tabBarIcon: ({focused, horizontal, tintColor}) => {
        const {routeName} = navigation.state;
        let IconComponent = Ionicons;
        let iconName;
        if (routeName === 'Home') {
          iconName = 'ios-calculator';
        } else if (routeName === 'Weight') {
          iconName = 'ios-body';
        }
        return <IconComponent name={iconName} size={30} color={tintColor} />;
      },
    }),
    tabBarOptions: {
      activeTintColor: '#2b547e',
      inactiveTintColor: 'gray',
      style: {
        backgroundColor: 'rgba(17,17,84, .1);',
      },
    },
  },
);

const AppContainer = createAppContainer(AppNavigator);
