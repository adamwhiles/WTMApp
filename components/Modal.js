import React from 'react';
import {ScrollView} from 'react-native';
import {Dialog, Portal, Text} from 'react-native-paper';
import {vw, vh} from 'react-native-expo-viewport-units';

export default function InfoModal(props) {
  let info = null;
  if (props.type === 'bmr') {
    info = (
      <ScrollView>
        <Text style={styles.headline}>What is BMR?</Text>
        <Text style={styles.normalText}>
          {'    '}BMR stands for basal metabolic rate. Your BMR is the caloric
          needs of your body when it's at rest. This is the amount of calories
          your body needs if you were to lay in bed for the entire day without
          moving.
        </Text>
        <Text style={styles.basicHeadline}>Mifflin St. Jeor Equation</Text>
        <Text style={styles.normalText}>
          <Text style={styles.boldText}>For Men: </Text>BMR = 10 x weight (kg) +
          6.25 x height (cm) – 5 x age (years) + 5
        </Text>
        <Text style={styles.normalText}>
          <Text style={styles.boldText}>For Women: </Text>
          BMR = 10 x weight (kg) + 6.25 x height (cm) – 5 x age (years) – 161
        </Text>
      </ScrollView>
    );
  } else if (props.type === 'tdee') {
    info = (
      <ScrollView>
        <Text style={styles.headline}>What is TDEE?</Text>
        <Text style={styles.normalText}>
          {'    '}TDEE stands for Total Daily Energy Expenditure. TDEE is takes
          into account your activity level to calculate how many colories you
          need in a day. This calculates in calories you burn while working,
          exercising and eating throughout the day. TDEE expands on BMR to give
          you more accurate and tailored caloric needs based on what you do
          during a typical day. TDEE tells you how many calories you should eat
          daily to maintain your weight. This is your baseline.
        </Text>
        <Text style={styles.basicHeadline}>TDEE Calculation</Text>
        <Text style={styles.normalText}>
          <Text style={styles.boldText}>Sedentary (Desk Job): </Text>Your BMR X
          1.2
        </Text>
        <Text style={styles.normalText}>
          <Text style={styles.boldText}>
            Lightly Active (Desk Job + Excercise 1-3 Days):{' '}
          </Text>
          Your BMR X 1.375
        </Text>
        <Text style={styles.normalText}>
          <Text style={styles.boldText}>
            Active (Active Job + Excercise 1-3 Days):{' '}
          </Text>
          Your BMR X 1.55
        </Text>
        <Text style={styles.normalText}>
          <Text style={styles.boldText}>
            Very Active (Active Job + Excercise 3+ Days):{' '}
          </Text>
          Your BMR X 1.725
        </Text>
        <Text style={styles.normalText}>
          <Text style={styles.boldText}>
            Extreme (Physically Demanding Job + Excercise 3+ Days):{' '}
          </Text>
          Your BMR X 1.9
        </Text>
      </ScrollView>
    );
  } else if (props.type === 'firstrun') {
    info = (
      <ScrollView>
        <Text style={styles.headline}>What The Macro?</Text>
        <Text style={styles.normalText}>
          {'    '}Welcome! What The Macro is a tool that will help you find the
          amount of calories you should eat based on your weight, age, height
          and activity level. What The Macro can help you set a starting point
          for your journey. Wether you're trying to lose weight, maintain your
          weight or bulk up and gain some muscle.
        </Text>
        <Text style={styles.basicHeadline}>DISCLAIMER</Text>
        <Text style={styles.normalText}>
          What the macro is a tool to help set a starting point for you. The
          tool is as accurate as the information you provide it. However, we are
          all different and no matter how fancy the equation is, there will be
          variances. Use the calories provided by this tool for a period of 2
          weeks and adjust from there. In order for this tool to work, you must
          be accurate in counting your calories and sticking to them.
        </Text>
      </ScrollView>
    );
  }
  return (
    <Portal>
      <Dialog
        style={styles.modalStyle}
        visible={props.visible}
        onDismiss={() => props.close(props.type)}>
        <Dialog.ScrollArea>{info}</Dialog.ScrollArea>
      </Dialog>
    </Portal>
  );
}

const styles = {
  modalStyle: {
    paddingVertical: 10,
    backgroundColor: 'rgba(23,22,26,.9)',
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
