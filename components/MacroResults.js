import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  AsyncStorage,
  TouchableHighlight,
} from 'react-native';
import {vw, vh} from 'react-native-expo-viewport-units';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faBreadSlice,
  faBacon,
  faCheese,
  faQuestionCircle,
  faVihara,
} from '@fortawesome/free-solid-svg-icons';
import {Switch} from 'react-native-paper';
import InfoModal from './Modal';
export default class MacroResults extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      lowCarb: false,
      bmr: null,
      tdee: null,
      goalCalories: 0,
      recProtein: 0,
      recCarbs: 0,
      recFat: 0,
      lowProtein: 0,
      lowCarbs: 0,
      lowFat: 0,
      tdeeModalVisible: false,
      bmrModalVisible: false,
    };

    this.closeModal = this.closeModal.bind(this);
  }
  componentDidMount() {
    console.log('age is ' + this.props.userAge);
    if (this.props.userAge !== null) {
      let user = {
        age: this.props.userAge,
        gender: this.props.userGender,
        goal: this.props.userGoal,
        activity: this.props.userActivity,
        feet: this.props.userFeet,
        inches: this.props.userInches,
        weight: this.props.userWeight,
      };
      console.log('DUP - Activity is: ' + this.props.userActivity);
      this.calcBMR(user)
        .then(() => {
          this.calcTDEE(user);
        })
        .then(() => {
          this.calculateGoalCalories(user.goal);
        });
      try {
        AsyncStorage.setItem('feet', this.props.userFeet);
        AsyncStorage.setItem('inches', this.props.userInches);
        AsyncStorage.setItem('weight', this.props.userWeight);
        AsyncStorage.setItem('gender', this.props.userGender);
        AsyncStorage.setItem('age', this.props.userAge);
        AsyncStorage.setItem('goal', this.props.userGoal);
        AsyncStorage.setItem('firstRun', 'false');
        AsyncStorage.setItem('activity', this.props.userActivity);
      } catch (error) {
        console.log('async storage error: ' + error);
      }
    }
  }
  closeModal = type => {
    if (type === 'bmr') {
      this.setState({bmrModalVisible: false});
    } else {
      this.setState({tdeeModalVisible: false});
    }
  };

  calcBMR = async user => {
    let totalInches = +user.feet * 12 + +user.inches;
    let BMR = 0;
    if (user.gender === 'male') {
      BMR =
        10 * (user.weight / 2.2046) +
        6.25 * (totalInches / 0.3937) -
        5 * user.age +
        5;
    } else {
      BMR =
        10 * (user.weight / 2.2046) +
        6.25 * (totalInches / 0.3937) -
        5 * user.age -
        161;
    }
    AsyncStorage.setItem('bmr', Math.ceil(BMR).toString());
    await this.setState({bmr: Math.ceil(BMR)});
  };

  calcTDEE = async user => {
    let TDEE = 0;
    switch (user.activity) {
      case 'sedentary':
        TDEE = this.state.bmr * 1.2;
        break;
      case 'lightactive':
        TDEE = this.state.bmr * 1.375;
        break;
      case 'modactive':
        TDEE = this.state.bmr * 1.55;
        break;
      case 'veryactive':
        TDEE = this.state.bmr * 1.725;
        break;
      case 'extremeactive':
        TDEE = this.state.bmr * 1.9;
        break;
      default:
        TDEE = this.state.bmr;
        break;
    }
    AsyncStorage.setItem('tdee', Math.ceil(TDEE).toString());
    await this.setState({tdee: Math.ceil(TDEE)});
  };

  calculateGoalCalories(goal) {
    var newCalories = 0;
    switch (goal) {
      case 'loseslow':
        newCalories = +this.state.tdee - 250;
        break;
      case 'losefast':
        newCalories = +this.state.tdee - 500;
        break;
      case 'maintain':
        newCalories = this.state.tdee;
        break;
      case 'gain':
        newCalories = +this.state.tdee + 500;
        break;
      default:
        newCalories = 0;
        break;
    }

    this.setState({
      goalCalories: newCalories,
      recProtein: Math.round((+newCalories * 0.35) / 4),
      recCarbs: Math.round((+newCalories * 0.35) / 4),
      recFat: Math.round((+newCalories * 0.3) / 9),
      lowProtein: Math.round((+newCalories * 0.4) / 4),
      lowCarbs: Math.round((+newCalories * 0.2) / 4),
      lowFat: Math.round((+newCalories * 0.4) / 9),
    });
    AsyncStorage.setItem('calorieGoal', newCalories.toString());
  }

  render() {
    return (
      <View>
        <InfoModal
          close={this.closeModal}
          visible={this.state.bmrModalVisible}
          type="bmr"
        />
        <InfoModal
          close={this.closeModal}
          visible={this.state.tdeeModalVisible}
          type="tdee"
        />
        <View style={styles.goalcontainer}>
          <View>
            <View style={styles.goalheader}>
              <Text style={styles.goaltitle}>Calorie Goal</Text>
            </View>
            <Text style={styles.goaltext}>
              {this.state.goalCalories} Calories/Day
            </Text>
          </View>
          <View>
            <TouchableHighlight
              onPress={() => this.setState({tdeeModalVisible: true})}>
              <View style={styles.goalheader}>
                <Text style={styles.goaltitle}>TDEE</Text>
                <FontAwesomeIcon
                  icon={faQuestionCircle}
                  color="white"
                  size={16}
                />
              </View>
            </TouchableHighlight>
            <Text style={styles.goaltext}>{this.state.tdee} Calories/Day</Text>
          </View>
          <View>
            <TouchableHighlight
              onPress={() => this.setState({bmrModalVisible: true})}>
              <View style={styles.goalheader}>
                <Text style={styles.goaltitle}>BMR</Text>
                <FontAwesomeIcon
                  icon={faQuestionCircle}
                  color="white"
                  size={16}
                />
              </View>
            </TouchableHighlight>
            <Text style={styles.goaltext}>{this.state.bmr} Calories/Day</Text>
          </View>
        </View>
        <View style={styles.carbswitch}>
          <Switch
            value={this.state.lowCarb}
            onValueChange={() => {
              this.setState({lowCarb: !this.state.lowCarb});
            }}
          />
          <Text
            style={this.state.lowCarb ? styles.lowCarbOn : styles.localCarbOff}>
            Low Carb
          </Text>
        </View>
        <View style={styles.macrocontainer}>
          <View style={styles.macroitem}>
            <FontAwesomeIcon icon={faBreadSlice} size={vh(6)} />
            <Text style={styles.macrotext}>CARBS</Text>
            <View style={styles.line} />
            <Text style={styles.grams}>
              {this.state.lowCarb
                ? this.state.lowCarbs + 'g'
                : this.state.recCarbs + 'g'}
            </Text>
          </View>
          <View style={styles.macroitem}>
            <FontAwesomeIcon icon={faBacon} size={vh(6)} />
            <Text style={styles.macrotext}>PROTEIN</Text>
            <View style={styles.line} />
            <Text style={styles.grams}>
              {this.state.lowCarb
                ? this.state.lowProtein + 'g'
                : this.state.recProtein + 'g'}
            </Text>
          </View>

          <View style={styles.macroitem}>
            <FontAwesomeIcon icon={faCheese} size={vh(6)} />
            <Text style={styles.macrotext}>FAT</Text>
            <View style={styles.line} />
            <Text style={styles.grams}>
              {this.state.lowCarb
                ? this.state.lowFat + 'g'
                : this.state.recFat + 'g'}
            </Text>
          </View>
        </View>
        <TouchableHighlight>
          <Text style={styles.startOver} onPress={this.props.startOver}>
            Start Over
          </Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: vh(5),
    alignSelf: 'center',
    paddingBottom: 15,
  },
  goalcontainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 10,
    marginTop: 20,
    backgroundColor: 'rgba(23,22,26,.9)',
    padding: 10,
    color: '#ffffff',
    height: vh(12),
    alignItems: 'center',
  },
  goalheader: {
    backgroundColor: '#45a29e',
    padding: 10,
    color: '#ffffff',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  startOver: {
    backgroundColor: '#45a29e',
    padding: 10,
    marginTop: 35,
    color: '#ffffff',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  goaltitle: {
    color: 'white',
    marginRight: 2,
    fontSize: vh(2),
  },
  goaltext: {
    color: '#c5c6c7',
    fontSize: vh(1.5),
    alignSelf: 'center',
    paddingTop: 2,
  },
  carbswitch: {
    alignSelf: 'center',
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '50%',
  },
  lowCarbOn: {
    color: 'white',
    backgroundColor: '#45a29e',
    padding: 6,
    borderRadius: 10,
    //borderWidth: 0,
    overflow: 'hidden',
  },
  lowCarbOff: {
    color: 'green',
  },
  macrocontainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  macroitem: {
    alignItems: 'center',
  },
  macrotext: {
    fontSize: vh(4),
  },
  line: {
    backgroundColor: '#45a29e',
    height: vh(0.7),
    width: vh(7),
    marginTop: 5,
  },
  grams: {
    fontSize: vh(3.5),
  },
  stepButtonStyle: {
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: vh(1),
  },
});
