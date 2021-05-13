import React, { Component, useState, useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import { useSelector } from 'react-redux'
import {
    Avatar,
    Title,
    Caption,
    Paragraph,
    Text,
    Drawer,
    TouchableRipple,
    Switch,
    useTheme
} from 'react-native-paper'
import {
    DrawerContentScrollView,
    DrawerItem
} from '@react-navigation/drawer'
import * as theme from '../constants/Theme'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AuthContext } from '../components/context';
import EventScreen from '../screens/EventScreen'
import NavigationUtil from '../navigation/NavigationUtil'
import AsyncStorage from '@react-native-async-storage/async-storage'

export function DrawerContent(props) {
    const paperTheme = useTheme();
    const user = useSelector(state => state.userReducer)
    return (
        <View style={{ flex: 1 }}>
            <DrawerContentScrollView {...props}>
                <View style={styles.userInfoSection}>
                    <View style={{ flexDirection: 'row', marginTop: 15 }}>
                        <Avatar.Image
                            source={{ uri: user.data.image }}
                            size={50}
                        />
                        <View style={{ marginLeft: 15 }}>
                            <Title style={styles.title}>{user.data.name}</Title>
                            <Caption style={styles.caption}>Lớp {Math.round(user.data.semester_curr / 10)} - Học kì {user.data.semester_curr % 10}</Caption>
                        </View>
                    </View>
                </View>
                {/* <View style={styles.row}>
                    <View style={styles.section}>
                        <Paragraph style={[styles.paragraph, styles.caption]}>80</Paragraph>
                        <Caption style={styles.caption}>Following</Caption>
                    </View>
                    <View style={styles.section}>
                        <Paragraph style={[styles.paragraph, styles.caption]}>100</Paragraph>
                        <Caption style={styles.caption}>Followers</Caption>
                    </View>
                </View> */}
                <Drawer.Section style={styles.drawerSection}>
                    <ItemDrawer icon='home-outline' label='Điểm học tập' onPress={() => props.navigation.navigate('Home')} />
                    <ItemDrawer icon='calendar' label='Lịch học' onPress={() => props.navigation.navigate('Schedule')} />
                    <ItemDrawer icon='alarm-light' label='Sự kiện' onPress={() => props.navigation.navigate('Event')} />
                    <ItemDrawer icon='file-document' label='Tài liệu' onPress={() => props.navigation.navigate('Document')} />
                    <ItemDrawer icon='account' label='Tài khoản' onPress={() => props.navigation.navigate('account')} />
                    <ItemDrawer icon='shield-key-outline' label='Đổi mật khẩu' onPress={() => props.navigation.navigate('changePass')} />
                </Drawer.Section>
                <Drawer.Section title="Preferences">
                    <TouchableRipple onPress={() => { }}>
                        <View style={styles.preference}>
                            <Text>Dark Theme</Text>
                            <View pointerEvents="none">
                                <Switch value={paperTheme.dark} />
                            </View>
                        </View>
                    </TouchableRipple>
                </Drawer.Section>
            </DrawerContentScrollView>
            <Drawer.Section style={styles.bottomDrawerSelection}>
                <ItemDrawer icon='exit-to-app' label='Sign out'
                    onPress={() => {
                        AsyncStorage.clear()
                        NavigationUtil.navigate('AuthLoading')
                    }}
                />
            </Drawer.Section>
        </View>
    )
}

class ItemDrawer extends Component {
    render() {
        const icon = this.props.icon
        const label = this.props.label
        return (
            <DrawerItem
                icon={(color, size) => (
                    <MaterialCommunityIcons name={icon} size={24} color="black" />
                )}
                label={label}
                onPress={this.props.onPress}
            />
        )
    }
}

const styles = StyleSheet.create({
    bottomDrawerSelection: {
        marginBottom: 15,
        borderTopColor: theme.colors.gray,
        borderTopWidth: 1
    },
    drawerContent: {
        flex: 1
    },
    userInfoSection: {
        paddingLeft: 20
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15
    },
    title: {
        fontSize: 16,
        marginTop: 3,
        fontWeight: 'bold'
    },
    caption: {
        fontSize: 14,
        lineHeight: 14,
    },
    row: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 15
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15,
    },
    paragraph: {
        fontWeight: 'bold',
        marginRight: 3,
    },
    drawerSection: {
        marginTop: 15,
    },
    preference: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
})