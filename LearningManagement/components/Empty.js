import React, { Component } from 'react'
import { Text, View, Image } from 'react-native'

export default class Empty extends Component {
    render() {
        return (
            <View style={{
                flex: 1, alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Image source={require('../assets/ic_empty.png')} style={{ height: 100, width: 100, marginBottom: 10 }} />
                <Text>Không có dữ liệu nào !</Text>
            </View>
        )
    }
}
