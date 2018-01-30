import React, { Component } from 'react';
import PropTypes from 'prop-types';

let loadYT

class VideoComponent extends Component {

  constructor(props){
    super(props);
    this.state = {
      currentVideo : this.props.videoArray[this.props.startIndex]
    }
  }

  render(){

        if (!loadYT) {
          loadYT = new Promise((resolve) => {
            const tag = document.createElement('script')
            tag.src = 'https://www.youtube.com/iframe_api'
            const firstScriptTag = document.getElementsByTagName('script')[0]
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
            window.onYouTubeIframeAPIReady = () => resolve(window.YT)
          })
          console.log(loadYT)
        }
        loadYT.then((YT) => {
          this.player = new YT.Player(this.youtubePlayerAnchor, {
            height: this.props.height || 780,
            width: this.props.width ||  1280,
            autoplay: 1,
            videoId: this.state.currentVideo,

            events: {
              onStateChange: this.stateChangeHandler,
              onReady: this.onReady
            }
          })
        })

        let temp = <View ref={(r) => { this.youtubePlayerAnchor = r }}></View>

        let foregroundImage = null;

        return (
          <View>
          {temp}
          {foregroundImage}
          </View>
        )



  }


}
export default VideoComponent;
