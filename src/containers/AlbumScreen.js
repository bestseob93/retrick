import React, { Component } from 'react';
import {
    StyleSheet,
    Button,
    View,
    Text,
    ScrollView,
    Image,
    TouchableOpacity,
    Dimensions
  } from 'react-native';


export default class AlubmScreen extends Component {
    componentDidMount() {
        
    }
    render() {
        return (
        <View style={styles.modalContainer}>
            {/* <ScrollView
            contentContainerStyle={styles.scrollView}>
            {
                this.state.photos.map((p, i) => {
                return (
                    <TouchableOpacity
                    style={{opacity: i === this.state.index ? 0.5 : 1}}
                    key={i}
                    underlayColor='transparent'
                    onPress={() => this.setIndex(i)}
                    >
                    <Image
                        style={{
                        width: width/3,
                        height: width/3
                        }}
                        source={{uri: p.node.image.uri}}
                    />
                    </TouchableOpacity>
                )
                })
            }
            </ScrollView> */}
            { /*
            this.state.index !== null  && (
                <View style={styles.shareButton}>
                <Button
                    title='Share'
                    onPress={this.share}
                    />
                </View>
            ) */
            }
        </View>
        );
    }
}

const styles = StyleSheet.create({
modalContainer: {
    paddingTop: 20,
    flex: 1
    },
    scrollView: {
    flexWrap: 'wrap',
    flexDirection: 'row'
    },
});