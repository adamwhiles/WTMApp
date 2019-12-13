import React from 'react';
import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';
var {vw, vh, vmin, vmax} = require('react-native-expo-viewport-units');

export default class CustomRadioButton extends React.Component {
  render() {
    const {options, value, type, onChange} = this.props;
    if (type === 'userGender') {
      return (
        <View style={styles.buttonContainerGender}>
          {options.map(item => {
            return (
              <View key={item.key} style={styles.buttonContainerGender}>
                <TouchableOpacity
                  style={styles.circle}
                  onPress={() => onChange(type, item.key)}>
                  {value === item.key && <View style={styles.checkedCircle} />}
                </TouchableOpacity>
                <Text style={styles.labelStyle}>{item.text}</Text>
              </View>
            );
          })}
        </View>
      );
    } else {
      return (
        <View>
          {options.map(item => {
            return (
              <View key={item.key} style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.circle}
                  onPress={() => onChange(type, item.key)}>
                  {value === item.key && <View style={styles.checkedCircle} />}
                </TouchableOpacity>
                <Text style={styles.labelStyle}>{item.text}</Text>
              </View>
            );
          })}
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  buttonContainer: {
    marginLeft: 15,
    flexDirection: 'row',
    //justifyContent: 'center',
    //alignItems: 'center',
    marginBottom: 15,
    color: 'white',
  },
  buttonContainerGender: {
    marginLeft: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    color: 'white',
  },
  labelStyle: {
    color: 'white',
    marginLeft: 5,
    fontSize: vh(1.75),
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ACACAC',
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkedCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#66fcf1',
  },
});
