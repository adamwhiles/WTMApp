import React, {Fragment} from 'react';
import {ProgressSteps, ProgressStep} from 'react-native-progress-steps';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  ImageBackground,
  Image,
  TextInput,
  KeyboardAvoidingView,
  AsyncStorage,
} from 'react-native';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import Steps from './components/steps';
import MacroResults from './components/MacroResults';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showResults: false,
    };
    this.showResults = this.showResults.bind(this);
    this.startOver = this.startOver.bind(this);
  }

  async componentDidMount() {
    let bmr = await AsyncStorage.getItem('bmr');
    if (bmr !== null) {
      console.log('in index, bmr is not null');
      this.updateEntries().then(() => this.setState({showResults: true}));
    }
  }

  startOver = () => {
    AsyncStorage.removeItem('bmr');
    this.setState({showResults: false});
  };

  updateEntries = async () => {
    console.log('bmr is not null');
    let feet = await AsyncStorage.getItem('feet');
    let inches = await AsyncStorage.getItem('inches');
    let weight = await AsyncStorage.getItem('weight');
    let age = await AsyncStorage.getItem('age');
    let activity = await AsyncStorage.getItem('activity');
    let goal = await AsyncStorage.getItem('goal');
    let gender = await AsyncStorage.getItem('gender');
    await this.setState({
      gender: gender,
      age: age,
      activity: activity,
      goal: goal,
      weight: weight,
      inches: inches,
      feet: feet,
    });
  };

  showResults = user => {
    this.setState({showResults: true, ...user});
  };

  render() {
    return (
      <ImageBackground
        source={require('./assets/background2.png')}
        style={{width: '100%', height: '100%'}}>
        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior="padding"
          keyboardVerticalOffset="-35"
          enabled>
          <SafeAreaView>
            <View style={{paddingHorizontal: 20, color: '#fff'}}>
              <Image
                source={require('./assets/wtmacro_logo.png')}
                resizeMode="stretch"
                style={{width: '100%'}}
              />
              <View>
                <Text
                  style={{fontSize: 20, color: '#fff', alignSelf: 'center'}}>
                  Calculate Your Macros
                </Text>
              </View>
            </View>
          </SafeAreaView>
          {!this.state.showResults ? (
            <Steps showResults={this.showResults} />
          ) : (
            <MacroResults
              userAge={this.state.age}
              userGender={this.state.gender}
              userActivity={this.state.activity}
              userGoal={this.state.goal}
              userFeet={this.state.feet}
              userInches={this.state.inches}
              userWeight={this.state.weight}
              startOver={this.startOver}
            />
          )}
        </KeyboardAvoidingView>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  inputAge: {
    margin: 15,
    height: 40,
    borderColor: 'lightblue',
    borderWidth: 1,
    width: 50,
    paddingLeft: 5,
    fontWeight: 'bold',
  },
  inputWeight: {
    margin: 15,
    height: 40,
    borderColor: 'lightblue',
    borderWidth: 1,
    width: 75,
    paddingLeft: 5,
    fontWeight: 'bold',
  },
  inputFeet: {
    margin: 15,
    height: 40,
    borderColor: 'lightblue',
    borderWidth: 1,
    width: 50,
    paddingLeft: 5,
    fontWeight: 'bold',
  },
  inputInch: {
    margin: 15,
    height: 40,
    borderColor: 'lightblue',
    borderWidth: 1,
    width: 75,
    paddingLeft: 5,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#7a42f4',
    padding: 10,
    margin: 15,
    height: 40,
  },
  submitButtonText: {
    color: 'white',
  },
});
