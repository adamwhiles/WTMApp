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
import {
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native-gesture-handler';

import AddWeightModal from '../components/AddWeightModal';

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
      newData: [],
      modalVisible: false,
    };

    this.addWeight = this.addWeight.bind(this);
  }

  async componentDidMount() {
    let newData = await AsyncStorage.getItem('newWeights');
    newData = JSON.parse(newData);
    if (newData != null) {
      console.log('new data is not null');
      console.log(newData);
      this.initializeWeights2(newData);
    }
  }

  initializeWeights2 = async data => {
    await data.sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
    await this.setState({newData: data, modalVisible: false});
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

  addWeight = async (date, weight) => {
    console.log('add weight called');
    let newWeight = {
      date: date,
      weight: weight,
    };
    this.state.newData.push(newWeight);
    this.initializeWeights2(this.state.newData);
    let currentWeights = await AsyncStorage.getItem('newWeights');
    if (currentWeights === null) {
      let d = new Array();
      d.push(newWeight);
      AsyncStorage.setItem('newWeights', JSON.stringify(d));
    } else {
      try {
        await AsyncStorage.getItem('newWeights').then(weights => {
          weights = JSON.parse(weights);
          weights.push(newWeight);
          AsyncStorage.setItem('newWeights', JSON.stringify(weights));
        });
      } catch (err) {
        console.log(err);
      }
    }
  };

  showAddModal = () => {
    this.setState({modalVisible: true});
  };

  render() {
    data.labels = [];
    data.datasets[0].data = [];
    if (this.state.newData != null && this.state.newData != []) {
      this.state.newData.map(value => {
        console.log('inside map');
        console.log(value.date);
        console.log(value.weight);
        data.labels.push(this.formatDate(value.date));
        data.datasets[0].data.push(parseFloat(value.weight));
        console.log(data);
        console.log(data.datasets[0].data);
      });
    }

    return (
      <ImageBackground
        source={require('../assets/background2.png')}
        style={{width: '100%', height: '100%'}}>
        <AddWeightModal
          visible={this.state.modalVisible}
          date={new Date()}
          addWeight={this.addWeight}
        />
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
                    verticalLabelRotation={30}
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
                        r: '5',
                        strokeWidth: '2',
                        stroke: '#336699',
                      },
                    }}
                    //bezier
                    style={{
                      marginVertical: 8,
                      //padding: 10,
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
                <TouchableOpacity onPress={this.showAddModal}>
                  <View
                    style={{
                      padding: 23,
                      backgroundColor: '#9fbfdf',
                      color: 'black',
                      marginLeft: 5,

                      marginBottom: 10,
                    }}>
                    <Text>Add New Weight</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.flatlistContainer}>
              <FlatList
                data={this.state.newData.reverse()}
                renderItem={({item, index}) => (
                  <View
                    style={
                      index % 2 === 0
                        ? styles.flatlistFirst
                        : styles.flatlistSecond
                    }>
                    <Text style={styles.date}>
                      {this.formatDate(item.date)}
                    </Text>
                    <Text style={styles.weight}>{item.weight}</Text>
                  </View>
                )}
                keyExtractor={item => item.date}
              />
            </View>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  flatlistContainer: {
    height: Dimensions.get('window').height * vh(0.043),
    //marginBottom: 60,
  },
  flatlistSecond: {
    padding: 20,
    flexDirection: 'row',
    backgroundColor: 'rgba(66, 95, 168, 0.4)',
    color: 'white',
  },
  flatlistFirst: {
    padding: 20,
    flexDirection: 'row',
    backgroundColor: 'rgba(86, 126, 227, 0.4)',
    color: 'white',
  },
  date: {
    alignSelf: 'flex-start',
    flex: 1,
    color: 'white',
  },
  weight: {
    alignSelf: 'flex-end',
    color: 'white',
  },
});
