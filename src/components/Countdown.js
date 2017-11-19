import React, { Component } from 'react';
import { Text } from 'react-native';
import PropTypes from 'prop-types';

export default class Countdown extends Component {
    static propTypes = {
        timer: PropTypes.number.isRequired
    }

    static defaultProps = {
        timer: 0
    }

    state = {
        count: this.props.timer / 1000
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.state.count === 0) {
            this.stopTimer();
        }
    }

    componentWillUnmount () {
        clearInterval(this.timer);
    }
    countDown() {
        this.setState({
            count: this.state.count - 1
        });
    }

    startTimer() {
        this.timer = setInterval(this.countDown, 1000);
    }

    stopTimer() {
        clearInterval(this.timer);
    }
    
    render() {
        return (
            <Text style={{alignSelf: 'center', paddingBottom: 300, color: '#fff', fontSize: 25, backgroundColor: 'transparent'}}>하이하이카운트다운</Text>
        );
    }
}