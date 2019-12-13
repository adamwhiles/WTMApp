import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  ImageBackground,
  Image,
  KeyboardAvoidingView,
} from 'react-native';
import {Button} from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import {createStackNavigator, createAppContainer} from 'react-navigation';

export default class WeightScreen extends React.Component {
  render() {
    return (
      <ImageBackground
        source={require('../assets/background2.png')}
        style={{width: '100%', height: '100%'}}>
        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior="padding"
          keyboardVerticalOffset="5"
          enabled>
          <SafeAreaView>
            <View
              style={{
                paddingHorizontal: 0,
                color: '#fff',
                alignItems: 'center',
              }}>
              <Image
                source={require('../assets/wtmacro_logo.png')}
                resizeMode="contain"
                style={{width: '95%'}}
              />
              <View>
                <Text
                  style={{fontSize: 20, color: '#fff', alignSelf: 'center'}}>
                  Calculate Your Macros
                </Text>
              </View>
              <Text>Weight Screen</Text>
            </View>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </ImageBackground>
    );
  }
}
