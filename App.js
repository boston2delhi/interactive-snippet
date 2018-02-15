'use strict';
import React from 'react';
import { Alert, Button, StyleSheet, Text, View, Dimensions } from 'react-native';
import { Video } from 'expo';
import { MaterialIcons, Octicons } from '@expo/vector-icons';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';

const VIDEOS = [
  'https://s3.amazonaws.com/bostondelhi/onboarding_screen.mp4', 
  'https://s3.amazonaws.com/bostondelhi/V2_edited.mp4', 
  'https://s3.amazonaws.com/bostondelhi/V3_edited.mp4', 
  'https://s3.amazonaws.com/bostondelhi/V4_edited.mp4']

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentVideo: 0, 
      mute: false,
      shouldPlay: true,
    };
  }

  handlePlayAndPause = () => { 
    this.setState((prevState) => ({
       shouldPlay: !prevState.shouldPlay  
    }));
  }

  handleVolume = () => {
    this.setState((prevState) => ({
      mute: !prevState.mute
    }));
  }

  skipAhead = () => {
    this.setState({currentVideo: 1});
  }

  rightBranch = () => {
    this.setState({currentVideo: 3});
  }

  leftBranch = () => {
    this.setState({currentVideo: 2});
  }

  backToStory = () => {
    this.setState({currentVideo: 1});
  }

  render() {
    const { width } = Dimensions.get('window');
    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80
    };

    return (
      <View style={styles.container}>
        <View >
          <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold' }}>Daily Life in Delhi</Text>
          <Video
            source= {{uri: VIDEOS[this.state.currentVideo]}}
            shouldPlay={this.state.shouldPlay}
            resizeMode="cover"
            style={{ width, height: 300 }}
            isMuted={this.state.mute}
          />
          <View style={styles.controlBar}>
            <MaterialIcons 
              name={this.state.mute ? "volume-mute" : "volume-up"}
              size={45} 
              color="white" 
              onPress={this.handleVolume} 
            />
            <MaterialIcons 
              name={this.state.shouldPlay ? "pause" : "play-arrow"} 
              size={45} 
              color="white" 
              onPress={this.handlePlayAndPause} 
            />
          </View>
        </View>

        <GestureRecognizer
          onSwipeRight={this.skipAhead}
          config={config}
          style={{
            flex: .30,
          }}
        >
          <View style={{flex: .25, flexDirection: 'row', alignItems: 'center'}}>
            <Text>Skip introduction</Text>
            <MaterialIcons 
              name={"fast-forward"}
              size={45} 
              color="black" 
              onPress={this.skipAhead} 
            />
          </View>
        </GestureRecognizer>

        <GestureRecognizer
        onSwipeLeft={this.leftBranch}
        onSwipeRight={this.rightBranch}
        config={config}
        style={{
          flex: .10,
        }}
      >
        <View style={{flex: .05, flexDirection: 'row', alignItems: 'center'}}>
          <MaterialIcons 
            name={"navigate-before"} 
            size={45} 
            color="black" 
            onPress={this.leftBranch} 
          />
          <Text>Follow Reeta        Follow Shahina</Text>
          <MaterialIcons 
            name={"navigate-next"}
            size={45} 
            color="black" 
            onPress={this.rightBranch} 
          />
      </View>
      </GestureRecognizer>

      <GestureRecognizer
        onSwipeLeft={this.backToStory}
        config={config}
        style={{
          flex: .05,
        }}
      >
        <View style={{flex: .23, flexDirection: 'row', alignItems: 'center'}}>
          <MaterialIcons 
            name={"fast-rewind"}
            size={45} 
            color="black" 
            onPress={this.backToStory} 
          />
        <Text>Return to story</Text>
        </View>
      </GestureRecognizer>
    </View>
    
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 4,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  }
});
