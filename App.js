import React from 'react';
import { Component } from 'react';
import { StyleSheet, Animated, Easing, View, Image, Dimensions, ScrollView, TouchableOpacity, Text, Video } from 'react-native';

const deviceWidth = Dimensions.get('window').width
const DISMISS_MODAL_THRESHOLD = 150 //distance we have to scroll in the y direction to dismiss the carousel

const images = [
  'https://s-media-cache-ak0.pinimg.com/originals/ee/51/39/ee5139157407967591081ee04723259a.png',
  'https://s-media-cache-ak0.pinimg.com/originals/40/4f/83/404f83e93175630e77bc29b3fe727cbe.jpg',
  'https://s-media-cache-ak0.pinimg.com/originals/8d/1a/da/8d1adab145a2d606c85e339873b9bb0e.jpg',
]


class ZoomView extends Component {

  static defaultProps = {
    doAnimateZoomReset: false,
    maximumZoomScale: 2,
    minimumZoomScale: 1,
    zoomed: false,
    zoomEnabled: false,
    zoomHeight: 219,
    zoomWidth: deviceWidth,
  }

  state = {
    startY: null, //y position of touch when we start scrolling on zoom view 
  }

  componentDidUpdate(prevProps) {
    if (prevProps.zoomed === true && this.props.zoomed === false) { //make sure we are scrolled to top
      this.handleResetZoomScale()
    }
  }

  setZoomRef = node => {
    if (node) {

      this.zoomRef = node
      this.scrollResponderRef = this.zoomRef.getScrollResponder()

      this.scrollResponderRef.scrollResponderHandleTouchStart = (event) => {
        const isZoom = event.nativeEvent.touches.length > 1 ? true : false

        if (!this.props.zoomed) {
          this.setState({ startY: event.nativeEvent.locationY })
        }

        if (isZoom) {
          if (!this.props.zoomed) {
            this.props.onZoomed()
          }
        }
      }

      this.scrollResponderRef.scrollResponderHandleTouchEnd = (event) => {
        console.log('end')
        if (this.props.zoomed) {
          this.imageRef.measure((ox, oy, width) => {
            if (width <= this.props.zoomWidth) {
              //this.props.onZoomClosePress() //MH TODO: go back to isolated carousel
              this.props.onZoomExit()
              return
            }
            else {
              return
            }
          })
        }
        else {
          const isZoom = event.nativeEvent.touches.length > 1 ? true : false

          if (!isZoom) {
            const currentY = event.nativeEvent.locationY
            const scrollYDistance = Math.abs(this.state.startY - currentY)
            //if we have swiped further up or down than the threshold distance and we're not zooming on an image, dismiss the isolated carousel mode
            if (scrollYDistance > DISMISS_MODAL_THRESHOLD) {
              this.props.onZoomClosePress()
            }
          }
        }
      }
    }
  }

  setImageRef = node => {
    if (node) {
      this.imageRef = node
    }
  }

  handleZoomViewPress = () => {
    if (!this.props.zoomEnabled) {
      this.props.onZoomEnabled()
    }
    else {
      if (this.props.zoomed) {
        this.handleResetZoomScale()
        this.props.onZoomClosePress()
      }
    }
  }

  handleResetZoomScale = () => {
    this.scrollResponderRef.scrollResponderZoomTo({ x: 0, y: 0, width: this.props.zoomWidth, height: this.props.zoomHeight, animated: true })
  }

  render() {
    return (
      <ScrollView
        contentContainerStyle={{ alignItems: 'center', justifyContent: 'center', }}
        centerContent //centers content when zoom is less than scroll view bounds 
        maximumZoomScale={this.props.zoomEnabled ? this.props.maximumZoomScale : 1} //setting to 1 disallows zoom
        minimumZoomScale={this.props.minimumZoomScale}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        ref={this.setZoomRef}
        scrollEnabled={this.props.zoomEnabled} //prevents you from panning on image
        scrollEventThrottle={10}
        style={{
          overflow: 'visible',
        }}
      >
        <TouchableOpacity
          onPress={this.handleZoomViewPress}
          flexGrow={1}
          flex={1}
        >
          <Image
            source={{uri: this.props.source}}
            style={{
              height: 219,
              width: deviceWidth
            }}
            ref={this.setImageRef}
          />
        </TouchableOpacity>
      </ScrollView>
    )
  }
}

export default class App extends Component {

  //ZOOM VIEW
  animZoomVal = new Animated.Value(0)

  animInverseZoomVal = this.animZoomVal.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  })

  animValUpTiming = Animated.timing(this.animZoomVal, {
    toValue: 1,
    duraton: 300,
    easing: Easing.inOut(Easing.quad),
  })
  animValDownTiming = Animated.timing(this.animZoomVal, {
    toValue: 0,
    duraton: 300,
    easing: Easing.inOut(Easing.quad),
  })
  animTranslateY = this.animZoomVal.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 175],
  })

  //SCROLLBAR
  animScrollBarOpacityVal = new Animated.Value(1)
  animScrollOpacityUpTiming = Animated.timing(this.animScrollBarOpacityVal, {
    toValue: 1,
    duraton: 300,
    easing: Easing.inOut(Easing.quad),
  })
  animScrollOpacityDownTiming = Animated.timing(this.animScrollBarOpacityVal, {
    toValue: 0,
    duraton: 300,
    easing: Easing.inOut(Easing.quad),
  })

  //CLOSE BUTTON
  animCloseOpacityVal = new Animated.Value(0)
  animCloseOpacityUpTiming = Animated.timing(this.animCloseOpacityVal, {
    toValue: 1,
    duraton: 300,
    easing: Easing.inOut(Easing.quad),
  })
  animCloseOpacityDownTiming = Animated.timing(this.animCloseOpacityVal, {
    toValue: 0,
    duraton: 300,
    easing: Easing.inOut(Easing.quad),
  })

  animScrollXVal = new Animated.Value(0)

  // To get clamp to work on the right edge we have to clamp using the indicator's left position
  scrollXVal = this.animScrollXVal.interpolate({
    inputRange: [0, deviceWidth * (images.length - 1)],
    outputRange: [0, (deviceWidth / images.length) * (images.length - 1)],
    extrapolate: 'clamp',
  })

  state = {
    zoomEnabled: false,
    zoomed: false,
  }

  handleZoomEnabled = () => {
    this.setState({ zoomEnabled: true })
    this.animValUpTiming.start()
    this.animCloseOpacityUpTiming.start()
  }

  handleZoomed = () => {
    this.setState({ zoomed: true })
    this.animScrollOpacityDownTiming.start()
    this.animCloseOpacityDownTiming.start()
  }

  handleZoomClosePress = () => {
    if (this.state.zoomEnabled) {
      this.animScrollOpacityUpTiming.start()
      this.setState({ zoomEnabled: false, zoomed: false })
      this.animValDownTiming.start()
      this.animCloseOpacityDownTiming.start()
    }
  }

  handleZoomExit = () => {
    if (this.state.zoomed) {
      this.setState({ zoomed: false, zoomEnabled: true })
      this.animScrollOpacityUpTiming.start()
      this.animCloseOpacityUpTiming.start()
    }
  }

  renderZoomView = (image, i) => {
    return (
      <ZoomView
        key={i}
        source={image}
        zoomEnabled={this.state.zoomEnabled}
        zoomed={this.state.zoomed}
        onZoomEnabled={this.handleZoomEnabled}
        onZoomClosePress={this.handleZoomClosePress}
        onZoomExit={this.handleZoomExit}
        onZoomed={this.handleZoomed}
        translateY={this.animTranslateY}
        index={i}
      />
    )
  }

  render() {

    return (
      <View
        style={{
          flex: 1,
          flexGrow: 1,
          alignItems: 'center',
          justifyContent: 'flex-start',
          marginTop: 40,
        }}
      >
        <Animated.View
          style={{
            opacity: this.animInverseZoomVal,
            paddingBottom: 20,
          }}
        >
          <Text
            style={{
              fontSize: 18,
            }}
          >
            Swipe or tap and zoom. 
          </Text>
          <Text
            style={{
              fontSize: 18,
            }}
          >
            To exit zoom, tap again.
          </Text>
        </Animated.View>
        <Animated.View
          style={{
            transform: [
              { translateY: this.animTranslateY },
            ],
            height: 219,
            zIndex: 10,
          }}
        >
          <Animated.ScrollView
            grow
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={10}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: this.animScrollXVal } } }]
            )}
            scrollEnabled={!this.state.zoomed}
            style={{
              overflow: 'visible',
            }}
          >
            {
              images.map((image, i) => {
                return (this.renderZoomView(image, i))
              })
            }
          </Animated.ScrollView>
          <Animated.View
            style={{
              width: deviceWidth,
              height: 5,
            }}
          >

            <Animated.View
              style={{
                backgroundColor: '#E5E5E5',
                opacity: this.animScrollBarOpacityVal,
              }}
            >
              <Animated.View
                style={{
                  backgroundColor: '#111111',
                  width: deviceWidth / images.length,
                  height: 5,
                  transform: [
                    {
                      translateX: this.scrollXVal,
                    },
                  ]
                }}
              />
            </Animated.View>
          </Animated.View>
        </Animated.View>
        <Animated.View
          style={{
            opacity: this.animInverseZoomVal,
            marginTop: 50,
            alignSelf: 'flex-start',
            paddingLeft: 20,
            paddingRight: 20,
          }}
        >
          <Text
            style={{
              marginBottom: 20,
              fontSize: 16,
              backgroundColor: 'transparent'
            }}
          >
            Is this cool or what?
          </Text>
          <Text
            style={{
              backgroundColor: 'transparent'
            }}
          >
            This comes from a project detailed here: https://medium.com/@mheavers/react-native-zoom-carousel-3546f7e781e5. The code is here: https://snack.expo.io/rJrrcRMzb
          </Text>
         
        </Animated.View>
        {
          this.state.zoomEnabled &&
          (
            <Animated.View
              style={{
                position: 'absolute',
                top: 20,
                right: 20,
                opacity: this.animCloseOpacityVal,
              }}
            >
              <TouchableOpacity
                onPress={this.handleZoomClosePress}
                hitSlop={{ top: 20, left: 20, right: 20, bottom: 20 }}
              >
                <Image
                  source={{uri: 'https://www.iconfinder.com/data/icons/ionicons/512/icon-close-24.png'}}
                />
              </TouchableOpacity>
            </Animated.View>
          )
        }
      </View>

    )
  }
}







