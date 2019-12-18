import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {Dialog, Portal, Text, TextInput} from 'react-native-paper';
import {vw, vh} from 'react-native-expo-viewport-units';

export default class ModifyWeightModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {weight: null};
  }

  handleWeight = weight => {
    this.setState({weight: weight});
  };
  submit = () => {
    let weightRegEx = /^\d{1,3}\.?\d{1}$/;
    if (this.state.weight === 0 || this.state.weight === null) {
      alert('Please Enter A Valid Weight');
    } else {
      let isValid = weightRegEx.test(this.state.weight);
      if (isValid) {
        this.props.modifyWeight(this.props.entry, this.state.weight);
      } else {
        alert('Please Enter A Valid Weight (ex 136 or 136.2)');
      }
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
            <View>
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
                  placeholder={this.props.entry.weight}
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
                    <Text>Edit Weight</Text>
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
            </View>
          </Dialog.ScrollArea>
        </Dialog>
      </Portal>
    );
  }
}

const styles = {
  modalStyle: {
    paddingVertical: 10,
    //backgroundColor: 'rgba(23,22,26,.9)',
  },
  headline: {
    color: '#66fcf1',
    fontSize: vh(5),
  },
  basicHeadline: {
    fontSize: vh(4),
    color: '#c5c6c7',
  },
  boldText: {
    fontWeight: 'bold',
    color: '#c5c6c7',
  },
  normalText: {
    fontSize: vh(1.75),
    color: '#c5c6c7',
  },
};
