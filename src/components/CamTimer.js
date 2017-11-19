import React, { Component } from 'react';
import { Text, Animated } from 'react-native';
import PropTypes from 'prop-types';

class CamTimer extends Component {
    state = {
        _count: this.props.timer / 1000
    }

    static propTypes = {
        timer: PropTypes.number.isRequired,
    }

    static defaultProps = {
        timer: 0
    }

    springValue = new Animated.Value(1);

    componentDidMount() {
        this.startTimer();
        this.springAnim();
    }

    componentDidUpdate(prevProps, prevState) {
        console.log('updated');
        if(this.state._count === 0) {
            this.stopTimer();
        }
    }

    componentWillUnmount () {
        clearInterval(this.timer);
        this.springValue.setValue(0);
    }

    _countDown() {
        console.log(this);
        this.setState({
            _count: this.state._count - 1
        });
        this.springAnim();
    }

    startTimer() {
        this.timer = setInterval(this._countDown.bind(this), 1000);
    }

    stopTimer() {
        clearInterval(this.timer);
    }

    springAnim = () => {
        this.springValue.setValue(0.7);

        Animated.spring(
            this.springValue, {
              toValue: 1,
              friction: 4,
              tension: 50,
              // speed: 5,
              // bounciness: 8,
            }
        ).start();
    }
    
    render() {
        console.log(this.springValue);
        return (
            <Animated.Text style={{
                alignSelf: 'center',
                paddingBottom: 300,
                color: '#fff',
                fontSize: 40,
                backgroundColor: 'transparent',
                transform: [{
                    scale: this.springValue
                }]
            }}>{this.state._count === 0 ? "레트릭~" : this.state._count}</Animated.Text>
        );
    }
}

export default CamTimer;