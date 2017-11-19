/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  PanResponder,
  StatusBar,
  TouchableOpacity,
  CameraRoll
} from 'react-native';
import { Surface } from 'gl-react-native';
import Camera from 'react-native-camera';
import { scaleLinear } from 'd3-scale';
import Icon from 'react-native-vector-icons/Ionicons';

import Saturate from './src/Saturate';

export default class App extends Component {
  state = {
    width: null,
    height: null,
    path: "https://i.imgur.com/uTP9Xfr.jpg",
    contrast: 1,
    brightness: 1,
    saturation: 1,
    camera: {
      aspect: Camera.constants.Aspect.fill,
      captureTarget: Camera.constants.CaptureTarget.cameraRoll,
      type: Camera.constants.Type.back,
      orientation: Camera.constants.Orientation.auto,
      flashMode: Camera.constants.FlashMode.auto,
    },
  }

  dragScaleX = scaleLinear()
  dragScaleY = scaleLinear()

  componentWillMount() {
    this._panResponder = PanResponder.create({
        onMoveShouldSetResponderCapture: () => true,
        onMoveShouldSetPanResponderCapture: () => true,

        onPanResponderGrant: (e, {x0, y0}) => {
          this.dragScaleX
              .domain([-x0, this.state.width - x0])
              .range([-1, 1]);

          this.dragScaleY
              .domain([-y0, this.state.height - y0])
              .range([1, -1]);
        },

        onPanResponderMove: (e, {dx, dy}) => {
          this.setState({
            saturation: 1 + this.dragScaleX(dx),
            brightness: 1 + this.dragScaleY(dy)
          });
        },

        onPanResponderRelease: (ev, {vx, vy}) => {
            // gesture complete
        }
    });
  }

  onLayout = (e) => {
    const { width, height } = e.nativeEvent.layout;

    this.setState({
      width,
      height
    });

    // this.start();
  }

  openCameraRoll = () => {
    CameraRoll.getPhotos({
      first: 20,
      assetType: 'All'
    });
  }

  // refreshPic = () => {
  //   this.camera
  //   .capture({
  //       target: Camera.constants.CaptureTarget.temp,
  //       jpegQuality: 70
  //   })
  //   .then(data => {
  //     console.log(data);
  //     this.setState({
  //       path: data.path
  //     })
  //   })
  //   .catch(err => console.error(err));
  // }

  // start() {
  //   this.timer = setInterval(() => this.refreshPic(), 1000);
  // }

  // componentWillUnmount() {
  //   clearInterval(this.timer);
  // }

  render() {
    const filter = {
      contrast: this.state.contrast,
      saturation: this.state.saturation,
      brightness: this.state.brightness
    };

    if(this.state.width && this.state.height) {
      return (
        <View style={styles.container} onLayout={this.onLayout} 
          {...this._panResponder.panHandlers}>
          <StatusBar
            animated
            hidden
          />
          <Camera
            style={styles.preview}
            ref={cam => this.camera = cam}
            captureQuality={Camera.constants.CaptureQuality["720p"]}
            aspect={this.state.camera.aspect}
            captureTarget={this.state.camera.captureTarget}
            type={this.state.camera.type}
            flashMode={this.state.camera.flashMode}
            onFocusChanged={() => {}}
            onZoomChanged={() => {}}
            defaultTouchToFocus
            mirrorImage={false}
          >
              <Surface style={{ width: this.state.width, height: this.state.height }}>
                <Saturate {...filter}>
                    {{ uri: this.state.path }}
                </Saturate>
              </Surface>
          </Camera>
          <View style={[styles.overlay, styles.topOverlay]}>
            <TouchableOpacity
              style={styles.flashButton}
              onPress={this.switchFlash}
            >
              <Icon
                name="ios-flash"
                size={30}
                style={{
                  backgroundColor: 'transparent',
                  color: 'black'
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.typeButton}
              onPress={this.switchType}
            >
              <Icon
                name="ios-reverse-camera-outline"
                size={30}
                style={{
                  backgroundColor: 'transparent',
                  color: 'black'
                }}
              />
            </TouchableOpacity>
          </View>
          <View style={[styles.overlay, styles.bottomOverlay]}>
            <TouchableOpacity
              style={styles.flashButton}
              onPress={this.switchFlash}
            >
              <Icon
                name="ios-flash"
                size={30}
                style={{
                  backgroundColor: 'transparent',
                  color: 'black'
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.typeButton}
              onPress={this.openCameraRoll}
            >
              <Icon
                name="ios-photos"
                size={30}
                style={{
                  backgroundColor: 'transparent',
                  color: 'black'
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.container} onLayout={this.onLayout} />
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    padding: 10,
    right: 0,
    left: 0,
    alignItems: 'center',
  },
  topOverlay: {
    top: 0,
    flex: 1,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomOverlay: {
    bottom: 0,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 40,
  },
  typeButton: {
    padding: 5,
  },
  flashButton: {
    padding: 5,
  },
  buttonsSpace: {
    width: 10,
  },
});