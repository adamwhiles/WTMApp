import React from 'react';
import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';
var {vw, vh, vmin, vmax} = require('react-native-expo-viewport-units');

export default class CustomRadioButton extends React.Component {
  render() {
    const {options, value, type, onChange} = this.props;

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

const styles = StyleSheet.create({
  buttonContainer: {
    marginLeft: 15,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 15,
    color: 'white',
  },
  labelStyle: {
    color: 'white',
    marginRight: 18,
    fontSize: vh(1.75),
  },
  circle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
    marginRight: 10,
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
