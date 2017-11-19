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
  Modal,
  Button,
  ScrollView,
  PanResponder,
  StatusBar,
  Image,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { Surface } from 'gl-react-native';
import Camera from 'react-native-camera';
import { scaleLinear } from 'd3-scale';

import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FAIcon from 'react-native-vector-icons/FontAwesome';

import ImagePicker from 'react-native-image-picker';
import VolumeSlider from 'react-native-volume-slider';

import Saturate from '../components/Saturate';
const { width } = Dimensions.get('window');

export default class MainScreen extends Component {
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
      torchMode: Camera.constants.TorchMode.off
    },
    imageRatio: ['full', 'square', '3:4'],
    ratioIndex: 0
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

  toggleModal = () => {
    this.setState({ modalVisible: !this.state.modalVisible });
  }

  takePicture = () => {
    if (this.camera) {
      this.camera.capture()
        .then((data) => this.setState({path: data.path}))
        .catch(err => console.error(err));
    }
  }

  openAlbum = () => {
    console.log('pressed');
    const options = {
      title: "hi",
      cancelButtonTitle: "취소",
      chooseFromLibraryButtonTitle: "선택하기",
      allowsEditing: true
    };

    ImagePicker.launchImageLibrary(options, (res) => {
      console.log(res);
      if(!res.didCancel) {
        this.setState({
          path: res.uri
        });
      }
    });
  }

  switchFlash = () => {
    let newFlashMode;
    const { auto, on, off } = Camera.constants.FlashMode;

    if (this.state.camera.flashMode === auto) {
      newFlashMode = on;
    } else if (this.state.camera.flashMode === on) {
      newFlashMode = off;
    } else if (this.state.camera.flashMode === off) {
      newFlashMode = auto;
    }

    this.setState({
      camera: {
        ...this.state.camera,
        flashMode: newFlashMode,
      },
    });
  }

  get flashIcon() {
    let icon;
    const { auto, on, off } = Camera.constants.FlashMode;

    if (this.state.camera.flashMode === auto) {
      icon = 'flash-auto';
    } else if (this.state.camera.flashMode === on) {
      icon = 'flash';
    } else if (this.state.camera.flashMode === off) {
      icon = 'flash-off';
    }

    return icon;
  }

  switchRatio = () => {
    this.setState({
      ratioIndex: this.state.ratioIndex > 1 ? this.state.ratioIndex - 2 : this.state.ratioIndex + 1
    });
  }

  switchTorch = () => {
    let newTorch;
    const { on, off } = Camera.constants.TorchMode;

    if(this.state.camera.torchMode === on) {
      newTorch = off;
    } else if(this.state.camera.torchMode === off) {
      newTorch = on;
    }

    this.setState({
      camera: {
        ...this.state.camera,
        torchMode: newTorch
      }
    });
  }

  switchType = () => {
    const { back, front } = Camera.constants.Type;
    if(this.state.camera.type === back) {
      this.setState({
        camera: {
          ...this.state.camera,
          type: front
        }
      });
    } else if(this.state.camera.type === front) {
      this.setState({
        camera: {
          ...this.state.camera,
          type: back
        }
      });
    }
  }

  onFocusChanged = (e) => {
    console.log(e);
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

  volumeChange = () => {
    this.takePicture();
  }

  render() {
    const filter = {
      contrast: this.state.contrast,
      saturation: this.state.saturation,
      brightness: this.state.brightness
    };

    if(this.state.width && this.state.height) {
      return (
        <View style={styles.container} onLayout={this.onLayout}>
          <StatusBar
            animated
            hidden
          />
          <View style={{flex: 1}}>
          <VolumeSlider
            style={{backgroundColor: 'transparent', opacity: 0}}
            thumbSize={{
              width: 1,
              height: 1
            }}
            thumbTintColor="rgba(146,146,157, 0)"
            minimumTrackTintColor="rgba(146,146,157, 0)"
            maximumTrackTintColor="rgba(255,255,255, 0)"
            showsRouteButton={true}
            onValueChange={this.volumeChange} />
          <Camera
            style={styles.preview}
            ref={cam => this.camera = cam}
            captureQuality={Camera.constants.CaptureQuality["720p"]}
            aspect={this.state.camera.aspect}
            captureTarget={this.state.camera.captureTarget}
            type={this.state.camera.type}
            flashMode={this.state.camera.flashMode}
            torchMode={this.state.camera.torchMode}
            onFocusChanged={this.onFocusChanged}
            onZoomChanged={() => {}}
            defaultTouchToFocus
            mirrorImage={false}
          >
              <Surface style={{ width: this.state.width, height: this.state.height }} {...this._panResponder.panHandlers}>
                <Saturate {...filter}>
                    {{ uri: this.state.path }}
                </Saturate>
              </Surface>
          </Camera>
          </View>
          <View style={[styles.overlay, styles.topOverlay]}>
            <TouchableOpacity
              style={styles.flashButton}
              onPress={this.switchFlash}
            >
              <MaterialIcon
                name={this.flashIcon}
                size={25}
                style={{
                  backgroundColor: 'transparent',
                  color: 'black'
                }}
              />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.flashButton}
              onPress={this.switchRatio}
            >
              <Text style={{width: 45}}>{this.state.imageRatio[this.state.ratioIndex]}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.typeButton}
              onPress={this.switchTorch}
            >
              <MaterialIcon
                name={this.state.camera.torchMode === 0 ? "flashlight-off" : "flashlight"}
                size={25}
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
              style={styles.typeButton}
              onPress={this.openAlbum}
            >
              <Icon
                name="ios-image"
                size={30}
                style={{
                  backgroundColor: 'transparent',
                  color: 'black'
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.typeButton}
              onPress={this.takePicture}
            >
              <FAIcon
                name="smile-o"
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