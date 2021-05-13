import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import { Header } from 'react-native-elements';
import { MaterialIcons } from '@expo/vector-icons';
import * as theme from '../constants/Theme'

export default class HeaderApp extends Component {
    render() {
        return (
            <Header
                    placement='left'
                    backgroundColor={theme.colors.schedule}
                    leftComponent={
                        <TouchableOpacity onPress={this.props.onPress}>
                            <MaterialIcons name="menu" size={28} color="white" />
                        </TouchableOpacity>
                    }
                    centerComponent={
                        <Text style={styles.text_head}>{this.props.title}</Text>
                    }
                />
        )
    }
}

const styles = StyleSheet.create({
    text_head: {
        fontSize: 20,
        color: theme.colors.white,
        fontWeight:'bold'
    }
})
