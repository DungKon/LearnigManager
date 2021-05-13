import React, { Component } from 'react'
import { Text, View } from 'react-native'
import * as theme from '../constants/Theme'

export default class SetupScreen extends Component {
    render() {
        return (
            <View style={theme.styles.container}>
                <Text> SetupScreen </Text>
            </View>
        )
    }
}
