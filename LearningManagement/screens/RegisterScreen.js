import React, { Component } from 'react'
import { Text, View, TextInput, Dimensions, TouchableOpacity } from 'react-native'
import { styles, colors } from '../constants/Theme'
import { Header } from 'react-native-elements'
import { MaterialIcons } from '@expo/vector-icons';
const { width, height } = Dimensions.get("window");
import { connect } from 'react-redux'
import { register } from '../redux/action'
import { showMessages } from '../components/Alert';

class RegisterScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            payload: {
                name: "JungNh",
                pass: "123456",
                re_pass: ""
            }
        }
    }
    render() {
        const { navigation } = this.props
        return (
            <View style={{ flex: 1 }}>
                <Header
                    placement='left'
                    backgroundColor={colors.schedule}
                    leftComponent={
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <MaterialIcons name="arrow-back" size={28} color="white" />
                        </TouchableOpacity>
                    }
                    centerComponent={
                        <Text style={{
                            fontSize: 20,
                            color: colors.white,
                            fontWeight: 'bold'
                        }}>Đăng kí</Text>
                    }
                />
                <Text style={{ marginTop: 10, marginHorizontal: 20 }}>
                    Tên tài khoản
                </Text>
                <TextInput
                    style={{
                        width: "80%",
                        height: 30,
                        marginVertical: 10,
                        borderBottomColor: colors.gray,
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: 18,
                        paddingHorizontal: 15,
                        borderBottomWidth: 0.5,
                        alignSelf: 'center'
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
                <Text style={{ marginTop: 10, marginHorizontal: 20 }}>
                    Mật khẩu
                </Text>
                <TextInput
                    style={{
                        width: "80%",
                        height: 30,
                        marginVertical: 10,
                        borderBottomColor: colors.gray,
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: 18,
                        paddingHorizontal: 15,
                        borderBottomWidth: 0.5,
                        alignSelf: 'center'
                    }}
                    secureTextEntry={true}
                    placeholder={"********"}
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
                <Text style={{ marginTop: 10, marginHorizontal: 20 }}>
                    Xác nhận mật khẩu
                </Text>
                <TextInput
                    style={{
                        width: "80%",
                        height: 30,
                        marginVertical: 10,
                        borderBottomColor: colors.gray,
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: 18,
                        paddingHorizontal: 15,
                        borderBottomWidth: 0.5,
                        alignSelf: 'center'
                    }}
                    secureTextEntry={true}
                    placeholder={"********"}
                    onChangeText={text => {
                        this.setState({
                            ...this.state,
                            payload: {
                                ...this.state.payload,
                                re_pass: text
                            }
                        })
                    }}
                />
                <TouchableOpacity
                    style={{
                        width: "80%",
                        height: 50,
                        marginVertical: 20,
                        borderRadius: 5,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: colors.schedule,
                        alignSelf: 'center'
                    }}
                    onPress={() => {
                        if(this.state.payload.pass ==""){
                            showMessages("Thông báo", "Vui lòng nhập lại mật khẩu")
                        }else{
                            if (this.state.payload.pass != this.state.payload.re_pass) {
                                showMessages("Thông báo", "Xác nhận mật khẩu không đúng")
                            } else {
                                this.props.register(this.state.payload)
                            }
                        }
                    }}
                >
                    <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>ĐĂNG KÍ TÀI KHOẢN</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {
    register
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterScreen)
