import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  ImageBackground,
  Image,
  KeyboardAvoidingView,
  Dimensions,
  Button,
  Alert,
} from 'react-native';
import {TextInput} from 'react-native-paper';
import {vw, vh} from 'react-native-expo-viewport-units';
import AsyncStorage from '@react-native-community/async-storage';
import {createStackNavigator, createAppContainer} from 'react-navigation';
import {LineChart} from 'react-native-chart-kit';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';

const data = {
  labels: [],
  datasets: [
    {
      data: [],
    },
  ],
};

export default class WeightScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      weight: null,
      userWeights: null,
      weightDates: [],
      weightValues: [],
      newData: null,
    };
  }

  async componentDidMount() {
    let dates = await AsyncStorage.getItem('weightDates');
    let weights = await AsyncStorage.getItem('weightValues');
    let newData = await AsyncStorage.getItem('newWeights');
    newData = JSON.parse(newData);
    let parsed = weights;
    //this.initializeWeights(dates, weights);
    this.initializeWeights2(newData);
    console.log(parsed);
  }

  initializeWeights2 = async data => {
    await data.sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
    await this.setState({newData: data});
  };

  formatDate = date => {
    d = new Date(date);
    let y = d
      .getFullYear()
      .toString()
      .substr(-2);
    let m = d.getMonth() + 1;
    let d = d.getDate();

    return `${m}/${d}/${y}`;
  };

  render() {
    if (this.state.newData != null) {
      this.state.newData.map(value => {
        data.labels.push(this.formatDate(value.date));
        data.datasets[0].data.push(value.weight);
      });
    }

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
                  Track Your Weight
                </Text>
              </View>
              <ScrollView horizontal={true}>
                {data.labels.length > 0 ? (
                  <LineChart
                    data={data}
                    width={Dimensions.get('window').width - 15}
                    height={220}
                    yAxisLabel={''}
                    yAxisSuffix={'lb'}
                    chartConfig={{
                      backgroundColor: '#e26a00',
                      backgroundGradientFrom: '#264d73',
                      backgroundGradientTo: '#9fbfdf',
                      decimalPlaces: 1,
                      color: (opacity = 1) => `rgba(255,255,255, ${opacity})`,
                      labelColor: (opacity = 1) =>
                        `rgba(255,255,255, ${opacity})`,
                      style: {
                        borderRadius: 16,
                      },
                      propsForDots: {
                        r: '6',
                        strokeWidth: '2',
                        stroke: '#336699',
                      },
                    }}
                    //bezier
                    style={{
                      marginVertical: 8,
                      borderRadius: 16,
                    }}
                  />
                ) : null}
              </ScrollView>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <TextInput
                  style={{
                    width: vw(40),
                  }}
                  label="Weight"
                  theme={{
                    colors: {
                      primary: 'black',
                    },
                  }}
                  value={this.state.userAge}
                  autoCapitalize="none"
                  onChangeText={this.handleAge}
                  keyboardType="number-pad"
                />
                <TouchableOpacity>
                  <View
                    style={{
                      padding: 23,
                      backgroundColor: '#9fbfdf',
                      color: 'black',
                      marginLeft: 5,
                    }}>
                    <Text>Enter</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </ImageBackground>
    );
  }
}
