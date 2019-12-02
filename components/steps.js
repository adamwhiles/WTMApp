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
  KeyboardAvoidingView,
  AsyncStorage,
} from 'react-native';
import {TextInput} from 'react-native-paper';
import CustomRadioButton from './CustomRadioButton';
import {vw, vh} from 'react-native-expo-viewport-units';
import MacroResults from './MacroResults';
import InfoModal from './Modal';
import {thistle} from 'color-name';

export default class Steps extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userGender: 'male',
      userAge: null,
      userWeight: null,
      userFeet: null,
      userInches: null,
      userActivity: 'sedentary',
      userGoal: 'maintain',
      stepErrors: false,
      showFirstRunModal: false,
      disableNext: true,
    };
    this.handleRadioChange = this.handleRadioChange.bind(this);
  }
  async componentDidMount() {
    try {
      let firstTimeRun = await AsyncStorage.getItem('firstRun');
      let bmr = await AsyncStorage.getItem('bmr');
      switch (firstTimeRun) {
        case 'true':
          this.setState({showFirstRunModal: true});
          break;
        case 'false':
          this.setState({showFirstRunModal: false});
          break;
        default:
          this.setState({showFirstRunModal: true});
          break;
      }
      if (bmr !== null) {
        await this.updateEntries();
      }
    } catch (error) {
      console.log(error);
    }
  }

  updateEntries = async () => {
    let feet = await AsyncStorage.getItem('feet');
    let inches = await AsyncStorage.getItem('inches');
    let weight = await AsyncStorage.getItem('weight');
    let age = await AsyncStorage.getItem('age');
    let activity = await AsyncStorage.getItem('activity');
    let goal = await AsyncStorage.getItem('goal');
    let gender = await AsyncStorage.getItem('gender');
    await this.setState({
      userGender: gender,
      userAge: age,
      userActivity: activity,
      userGoal: goal,
      userWeight: weight,
      userInches: inches,
      userFeet: feet,
      showResults: true,
      stepErrors: false,
    });
  };

  handleAge = age => {
    this.setState({userAge: age});
  };
  handleWeight = weight => {
    this.setState({userWeight: weight});
  };
  handleFeet = feet => {
    this.setState({userFeet: feet});
  };

  handleInches = inches => {
    this.setState({userInches: inches});
  };

  handleRadioChange = (type, value) => {
    this.setState({[type]: value});
  };

  closeModal = () => {
    this.setState({showFirstRunModal: false});
  };

  submit = () => {
    let user = {
      age: this.state.userAge,
      gender: this.state.userGender,
      goal: this.state.userGoal,
      activity: this.state.userActivity,
      feet: this.state.userFeet,
      inches: this.state.userInches,
      weight: this.state.userWeight,
    };

    this.props.showResults(user);
  };

  validateFirstStep = () => {
    if (
      this.state.userAge != null &&
      this.state.userFeet != null &&
      this.state.userInches != null &&
      this.state.userWeight != null
    ) {
      this.setState({stepErrors: false});
    } else {
      this.setState({stepErrors: true});
    }
  };

  render() {
    let progressProps = {
      activeStepIconBorderColor: '#66fcf1',
      completedProgressBarColor: '#66fcf1',
      completedStepIconColor: '#66fcf1',
      completedCheckColor: 'black',
      activeLabelColor: 'white',
      activeStepNumColor: 'white',
      labelColor: 'white',
    };

    if (this.state.showResults === true) {
      progressProps.activeStep = 3;
    }
    return (
      <>
        <InfoModal
          close={this.closeModal}
          visible={this.state.showFirstRunModal}
          type="firstrun"
        />
        <ProgressSteps {...progressProps}>
          <ProgressStep
            label="The Basics"
            nextBtnTextStyle={styles.stepButtonStyle}
            errors={this.state.stepErrors}
            onNext={this.validateFirstStep}>
            <View style={{marginBottom: 20}}>
              <CustomRadioButton
                options={genderOptions}
                type="userGender"
                onChange={this.handleRadioChange}
                value={this.state.userGender}
              />
              <View style={{flexDirection: 'row', alignSelf: 'center'}}>
                <TextInput
                  mode="outlined"
                  style={{
                    width: vw(40),
                  }}
                  //underlineColor="black"
                  //selectionColor="#66fcf1"
                  dense="false"
                  label="Age"
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
                <TextInput
                  mode="outlined"
                  style={{
                    width: vw(40),
                    marginLeft: vw(5),
                  }}
                  //underlineColor="black"
                  //selectionColor="#66fcf1"
                  dense="false"
                  theme={{
                    colors: {
                      primary: 'black',
                    },
                  }}
                  //style={styles.inputWeight}
                  label="Weight (lbs)"
                  value={this.state.userWeight}
                  autoCapitalize="none"
                  onChangeText={this.handleWeight}
                  color="lightblue"
                  keyboardType="number-pad"
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignSelf: 'center',
                  marginTop: 10,
                }}>
                <TextInput
                  mode="outlined"
                  style={{
                    width: vw(40),
                  }}
                  //underlineColor="black"
                  //selectionColor="#66fcf1"
                  dense="false"
                  theme={{
                    colors: {
                      primary: 'black',
                    },
                  }}
                  label="Height (FT)"
                  value={this.state.userFeet}
                  //autoCapitalize="none"
                  onChangeText={this.handleFeet}
                  //color="lightblue"
                  keyboardType="number-pad"
                />
                <TextInput
                  mode="outlined"
                  style={{
                    width: vw(40),
                    marginLeft: vw(5),
                  }}
                  //underlineColor="black"
                  //selectionColor="#66fcf1"
                  dense="false"
                  theme={{
                    colors: {
                      primary: 'black',
                    },
                  }}
                  //style={styles.inputWeight}
                  label="Feet (Inch)"
                  autoCapitalize="none"
                  value={this.state.userInches}
                  onChangeText={this.handleInches}
                  color="lightblue"
                  keyboardType="number-pad"
                />
              </View>
            </View>
          </ProgressStep>
          <ProgressStep
            label="Activity Level"
            nextBtnTextStyle={styles.stepButtonStyle}
            previousBtnTextStyle={styles.stepButtonStyle}>
            <View style={{flexDirection: 'row', marginRight: 20}}>
              <CustomRadioButton
                options={activityOptions}
                type="userActivity"
                onChange={this.handleRadioChange}
                value={this.state.userActivity}
              />
            </View>
          </ProgressStep>
          <ProgressStep
            label="Goals"
            nextBtnTextStyle={styles.stepButtonStyle}
            previousBtnTextStyle={styles.stepButtonStyle}
            onSubmit={this.submit}
            nextBtnText="Get My Macros">
            <View>
              <CustomRadioButton
                options={goalOptions}
                type="userGoal"
                onChange={this.handleRadioChange}
                value={this.state.userGoal}
              />
            </View>
          </ProgressStep>
        </ProgressSteps>
      </>
    );
  }
}
let genderOptions = [
  {text: 'Male', key: 'male'},
  {text: 'Female', key: 'female'},
];
let activityOptions = [
  {text: 'Sedentary (Desk Job)', key: 'sedentary'},
  {text: 'Lightly Active (Desk Job + Excercise 1-3 Days)', key: 'lightactive'},
  {text: 'Active (Active Job + Excercise 1-3 Days)', key: 'active'},
  {text: 'Very Active (Active Job + Excercise 3+ Days)', key: 'veryactive'},
  {
    text: 'Extreme (Physically Demanding Job + Excercise 3+ Days)',
    key: 'extreme',
  },
];
let goalOptions = [
  {text: 'Maintain Weight', key: 'maintain'},
  {text: 'Lose Weight Slowly', key: 'loseslow'},
  {text: 'Lose Weight Fast', key: 'losefast'},
  {text: 'Gain Weight (Bulk)', key: 'gain'},
];

const styles = StyleSheet.create({
  container: {
    paddingTop: 23,
  },
  stepButtonStyle: {
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: vh(1),
  },
  inputAge: {
    margin: 15,
    height: 40,
    borderColor: 'lightblue',
    borderWidth: 1,
    borderRadius: 10,
    width: 50,
    paddingLeft: 5,
    fontWeight: 'bold',
  },
  inputWeight: {
    margin: 15,
    height: 40,
    borderColor: 'lightblue',
    borderWidth: 1,
    width: 150,
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
