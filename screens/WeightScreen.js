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
import {vw, vh} from 'react-native-expo-viewport-units';
import AsyncStorage from '@react-native-community/async-storage';
import {createStackNavigator, createAppContainer} from 'react-navigation';
import {LineChart} from 'react-native-chart-kit';
import {
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native-gesture-handler';
import {SwipeListView} from 'react-native-swipe-list-view';

import AddWeightModal from '../components/AddWeightModal';
import ModifyWeightModal from '../components/ModifyWeightModal';

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
      modifyModalVisible: false,
    };

    this.addWeight = this.addWeight.bind(this);
    this.modifyWeight = this.modifyWeight.bind(this);
  }

  async componentDidMount() {
    let newData = await AsyncStorage.getItem('newWeights');
    newData = JSON.parse(newData);
    if (newData != null) {
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
    let newWeight = {
      date: date,
      weight: weight,
    };
    console.log('add weight called with date of: ' + this.formatDate(date));
    let dateInUse = this.dateInUse(this.state.newData, this.formatDate(date));
    if (dateInUse) {
      alert('You already have an entry for this date');
    } else {
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
    }
  };

  dateInUse = (list, date) => {
    if (list.some(entry => this.formatDate(entry.date) === date)) {
      return true;
    } else {
      return false;
    }
  };

  showAddModal = () => {
    this.setState({modalVisible: true});
  };

  showModifyModal = item => {
    this.setState({modifyWeight: item.item, modifyModalVisible: true});
  };

  weightDelete = async item => {
    let weights = this.state.newData;
    let newWeights = weights.filter(
      entry =>
        entry.date !== item.item.date && entry.weight !== item.item.weight,
    );
    await AsyncStorage.removeItem('newWeights');
    await AsyncStorage.setItem('newWeights', JSON.stringify(newWeights));
    this.setState({newData: newWeights});
  };

  modifyWeight = async (item, weight) => {
    let weights = this.state.newData;
    let targetWeight = weights.findIndex(
      entry => entry.date === item.date && entry.weight === item.weight,
    );
    weights[targetWeight].weight = weight;
    await AsyncStorage.removeItem('newWeights');
    await AsyncStorage.setItem('newWeights', JSON.stringify(weights.reverse()));
    this.setState({newData: weights.reverse(), modifyModalVisible: false});
  };

  render() {
    data.labels = [];
    data.datasets[0].data = [];
    if (this.state.newData != null && this.state.newData !== []) {
      this.state.newData.slice(0, vh(0.75)).map(value => {
        if (value.weight > 0) {
          data.labels.push(this.formatDate(value.date));
          data.datasets[0].data.push(parseFloat(value.weight));
        }
      });
    }
    let reversedList = this.state.newData.slice().reverse();

    return (
      <ImageBackground
        source={require('../assets/background2.png')}
        style={{width: '100%', height: '100%'}}>
        <AddWeightModal
          visible={this.state.modalVisible}
          date={new Date()}
          addWeight={this.addWeight}
          close={() => this.setState({modalVisible: false})}
        />
        {this.state.modifyModalVisible ? (
          <ModifyWeightModal
            visible={this.state.modifyModalVisible}
            entry={this.state.modifyWeight}
            modifyWeight={this.modifyWeight}
            close={() =>
              this.setState({modifyModalVisible: false, modifyWeight: null})
            }
          />
        ) : null}

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
              <View>
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
              </View>
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
                      backgroundColor: '#66A6C3',
                      color: 'black',
                      marginLeft: 5,

                      marginBottom: 10,
                    }}>
                    <Text style={{color: 'white'}}>Add New Weight</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.flatlistContainer}>
              <SwipeListView
                data={reversedList}
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
                keyExtractor={(item, index) => item.date + index}
                renderHiddenItem={(item, index) => (
                  <View style={styles.backRow}>
                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={() => this.showModifyModal(item)}>
                      <Text>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => this.weightDelete(item)}>
                      <Text>Delete</Text>
                    </TouchableOpacity>
                  </View>
                )}
                leftOpenValue={75}
                rightOpenValue={-140}
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
    backgroundColor: '#507585',
    color: 'white',
  },
  flatlistFirst: {
    padding: 20,
    flexDirection: 'row',
    backgroundColor: '#2b4967',
    color: 'white',
  },
  backRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  editButton: {
    alignContent: 'center',
    color: 'white',
    backgroundColor: '#c2e2db',
    padding: 20,
  },
  deleteButton: {
    color: 'white',
    backgroundColor: '#cf9e73',
    padding: 20,
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
