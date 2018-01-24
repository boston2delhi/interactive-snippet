import React from 'react';
import { StyleSheet,  Image, ScrollView, Text, View, Button, Alert } from 'react-native';


export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
        <Text>Changes you make will automatically reload Like this one!.</Text>
        <Text>Shake your phone to open the developer menu.</Text>
        <Text>TEST HI HI HI</Text>
      </View>


    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
