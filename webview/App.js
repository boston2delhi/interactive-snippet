import React from 'react';
import { Component } from 'react';
import { Stylesheet, Text, View, WebView, Platform } from 'react-native';

import Video from 'react-native-video';
// import Video2 from './V2.mp4';

export default class MyWeb extends Component {
  render() {
    return (
      <View style={{ height: 300 }}>
        <WebView
          javaScriptEnabled={true}
          domStorageEnabled={true}      
          source={{uri: 'https://youtu.be/Lmpf8hsvaLw'}}
          style={{marginTop: 20}}
        />
      </View>
    );
  }
}



// export default class rnvideo extends Component {
//   render() {
//     return (   

      
//       <Text>Hello world!</Text> );
//   }
// }


// return (
// <View style={styles.container}>
//   {/* <Video
//     source={Video2}
//     resizeMode="cover"
//     style={StyleSheet.absoluteFill}
//   /> */}
// </View>
// );