import React from 'react';
import {View, TouchableOpacity, KeyboardAvoidingView} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Dialog, Portal, Text, TextInput} from 'react-native-paper';
import {vw, vh} from 'react-native-expo-viewport-units';

export default class AddWeightModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date(), weight: null};
  }

  handleWeight = weight => {
    this.setState({weight: weight});
  };
  setDate = (event, newDate) => {
    this.setState({date: newDate});
  };
  submit = () => {
    let weightRegEx = /^\d{2,3}\.\d{1}$/;
    if (this.state.weight > 0 && this.state.weight !== null) {
      let isValid = weightRegEx.test(this.state.weight);
      if (isValid) {
        this.props.addWeight(this.state.date, this.state.weight);
      } else {
        alert('Please Enter A Valid Weight (ex 136 or 136.2)');
      }
    } else {
      alert('Please Enter A Valid Weight');
    }
  };
  render() {
    return (
      <Portal>
        <Dialog
          style={styles.modalStyle}
          visible={this.props.visible}
          onDismiss={() => this.props.close()}
          dismissable={false}>
          <Dialog.ScrollArea>
            <KeyboardAvoidingView>
              <DateTimePicker
                value={this.state.date}
                mode={'date'}
                onChange={this.setDate}
                maximumDate={new Date()}
              />
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <TextInput
                  style={{
                    width: vw(25),
                  }}
                  label="Weight"
                  theme={{
                    colors: {
                      primary: 'black',
                    },
                  }}
                  value={this.state.weight}
                  autoCapitalize="none"
                  onChangeText={this.handleWeight}
                  keyboardType="numeric"
                />
                <TouchableOpacity onPress={() => this.submit()}>
                  <View
                    style={{
                      padding: 23,
                      backgroundColor: '#c5c6c7',
                      color: 'black',
                      marginLeft: 5,
                    }}>
                    <Text>Add Weight</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.props.close()}>
                  <View
                    style={{
                      padding: 23,
                      backgroundColor: 'salmon',
                      color: 'black',
                      marginLeft: 5,
                    }}>
                    <Text>Close</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </Dialog.ScrollArea>
        </Dialog>
      </Portal>
    );
  }
}

const styles = {
  modalStyle: {
    paddingVertical: 10,
    marginBottom: 150,
  },
};
