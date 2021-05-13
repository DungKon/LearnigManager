import React, { Component } from 'react'
import {
    Text, View, ActivityIndicator,
    StatusBar,
} from 'react-native'
import { colors } from '../constants/Theme'

export default class Loading extends Component {
    render() {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center"
                }}
            >
                <ActivityIndicator size="large" color={colors.schedule} />
                <StatusBar barStyle="default" />
            </View>
        )
    }
}
