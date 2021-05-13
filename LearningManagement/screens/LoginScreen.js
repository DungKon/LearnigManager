import React, { Component } from 'react'
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native'
import { connect } from 'react-redux'
import * as theme from '../constants/Theme'
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { SCREEN_ROUTER } from '../constants/Constant'
// import { requestLogin } from '../constants/Api'
import { requestLogin } from '../redux/action'
import AsyncStorage from '@react-native-async-storage/async-storage'
import NavigationUtil from '../navigation/NavigationUtil'
let { width } = Dimensions.get('window');

class LoginScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            payload: {
                name: "JungNh",
                pass: "123456",
            }
        }
    }

    render() {
        return (
            <View style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: "white"
            }}>
                <Image source={{ uri: 'https://macinnisweb.ca/img/learning.jpg' }}
                    style={{ height: width / 82 * 46, width: width, marginBottom: 20 }}
                />
                <Text style={{ fontSize: 20 }}> Proceed with your </Text>
                <Text style={{ fontSize: 30, fontWeight: 'bold', marginBottom: 20 }}> Login </Text>
                <View style={{ flexDirection: 'row', borderBottomWidth: 0.5 }}>
                    <AntDesign name="user" size={22} color="black" style={{ position: 'absolute', right: 0, top: 25 }} />
                    <TextInput
                        style={{
                            marginTop: 20,
                            width: "80%",
                            height: 30,
                            marginVertical: 10,
                            borderBottomColor: theme.colors.gray,
                            justifyContent: "center",
                            alignItems: "center",
                            fontSize: 18,
                            paddingHorizontal: 15,
                        }}
                        placeholder={"Nguyen Van An"}
                        value={this.state.payload.name}
                        onChangeText={text => {
                            this.setState({
                                ...this.state,
                                payload: {
                                    ...this.state.payload,
                                    name: text
                                }
                            })
                        }}
                    />
                </View>
                <View style={{ flexDirection: 'row', borderBottomWidth: 0.5, marginTop: 20 }}>
                    <FontAwesome name="key" size={20} color="black" style={styles.icon} />
                    <TextInput
                        style={{
                            width: "80%",
                            height: 30,
                            marginVertical: 10,
                            borderBottomColor: theme.colors.gray,
                            justifyContent: "center",
                            alignItems: "center",
                            fontSize: 18,
                            paddingHorizontal: 15,
                        }}
                        secureTextEntry={true}
                        placeholder={"*********"}
                        value={this.state.payload.pass}
                        onChangeText={text => {
                            this.setState({
                                ...this.state,
                                payload: {
                                    ...this.state.payload,
                                    pass: text
                                }
                            })
                        }}
                    />
                </View>
                <TouchableOpacity
                    style={{
                        width: "80%",
                        height: 50,
                        marginVertical: 20,
                        borderRadius: 5,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: theme.colors.schedule
                    }}
                    onPress={() => {
                        this.props.requestLogin(this.state.payload)
                    }}
                >
                    <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>ĐĂNG NHẬP</Text>
                </TouchableOpacity>
                <View style={{ flexDirection: "row" }}>
                    <Text>
                        Bạn chưa có tài khoản.{" "}
                    </Text>
                    <TouchableOpacity
                        onPress={() => {
                            this.props.navigation.navigate(SCREEN_ROUTER.REGISTER)
                        }}
                    >
                        <Text
                            style={[
                                {
                                    textDecorationLine: "underline",
                                    color: theme.colors.schedule
                                }
                            ]}
                        >
                            Đăng ký
                  </Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {
    requestLogin
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen)

const styles = StyleSheet.create({
    icon: {
        position: 'absolute',
        right: 0,
        top: 20
    }
})
