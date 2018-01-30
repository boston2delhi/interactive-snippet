import React from 'react';
import { StyleSheet,  Image, ScrollView, Text, View, Button, Alert } from 'react-native';


export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
        <Text>Changes you make will automatically reload Like this one!.</Text>
        <Text>Shake your phone to open the developer menu.</Text>
        <Text>Hey - it is WORKING!</Text>
        <Text>HELLO World!</Text>
        <Button
        onPress={() => {
          Alert.alert('You tapped the button!');
        }}
        title="Press Me"
        />
        <ScrollView>
        <Text style={{fontSize:60}}>Scroll me plz</Text>

        <Text style={{fontSize:96}}>If you like</Text>

        <Text style={{fontSize:96}}>Scrolling down</Text>

        <Text style={{fontSize:96}}>Whats the best</Text>

        <Text style={{fontSize:96}}>Framework around?</Text>

        <Text style={{fontSize:80}}>React Native</Text>
        <Text style={{fontSize:40}}>You Scrolled Down!</Text>
      </ScrollView>
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
