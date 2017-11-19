import React, { Component } from 'react';
import {
    StyleSheet,
    Button,
    View,
    Text,
    Image,
    TouchableOpacity,
  } from 'react-native';


export default class CapturedScreen extends Component {
    componentDidMount() {
        
    }
    render() {
        console.log(this.props.navigation.state.params.data);
        return (
        <View style={styles.container}>
            <Image style={{flex: 1}} source={{uri: this.props.navigation.state.params.data}} />
        </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 20,
        flex: 1
    },
});