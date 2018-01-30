import React from 'react';
import { StyleSheet,  Image, ScrollView, Text, View, Button, Alert } from 'react-native';
import VideoComponent from './VideoComponent'

export default class App extends React.Component {
  constructor(){
  super();
  this.state = {
    videoArray: ["0cZLo3AAan4","0cZLo3AAan4","0cZLo3AAan4"],
    startIndex: 0
  }
}

  render() {
    return (
      <View>
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
