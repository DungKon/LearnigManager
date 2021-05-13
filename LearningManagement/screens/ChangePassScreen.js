import React, { Component } from 'react'
import { Text, View, TextInput, Dimensions, TouchableOpacity, KeyboardAvoidingView } from 'react-native'
import { styles, colors } from '../constants/Theme'
import { Header } from 'react-native-elements'
import { MaterialIcons } from '@expo/vector-icons';
const { width, height } = Dimensions.get("window");
import { connect } from 'react-redux'
import { register } from '../redux/action'
import { changePass } from '../constants/Api'
import { showMessages } from '../components/Alert';
import Toast, { DURATION } from "react-native-easy-toast";

class ChangePassScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            pass: "",
            new_pass: "",
            conf_pass: "",
            mess: ""
        }
    }

    changePass = async (pass, new_pass) => {
        this.setState({
            ...this.state,
            isLoading: true
        })
        try {
            const result = await changePass(pass, new_pass)
            if (result) {
                this.setState({
                    ...this.state,
                    isLoading: false,
                    mess: result.message
                }, () => {
                    this.toast.show(result.message, 2000)
                    this.props.navigation.goBack()
                })
            }
        } catch (error) {
            this.setState({
                ...this.state,
                isLoading: false,
                error: error
            })
            console.log("error:", error)
            this.toast.show("Sai mật khẩu!", 2000)
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
                        }}>Đổi mật khẩu</Text>
                    }
                />
                <KeyboardAvoidingView
                    style={{
                        width: "100%"
                    }}
                    behavior={Platform.OS == "ios" ? "padding" : undefined}
                    enabled>
                    <Text style={{ marginTop: 10, marginHorizontal: 20 }}>
                        Mật khẩu cũ
                </Text>
                    <Toast
                        ref={(toast) => this.toast = toast}
                        position="top"
                        positionValue={200}
                        fadeInDuration={750}
                        fadeOutDuration={1000}
                        opacity={0.8}
                        textStyle={{ color: "white" }}
                    />
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
                        placeholder={"********"}
                        secureTextEntry={true}
                        value={this.state.pass}
                        onChangeText={text => {
                            this.setState({
                                ...this.state,
                                pass: text
                            })
                        }}
                    />
                    <Text style={{ marginTop: 10, marginHorizontal: 20 }}>
                        Mật khẩu mới
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
                        placeholder={"********"}
                        secureTextEntry={true}
                        value={this.state.new_pass}
                        onChangeText={text => {
                            this.setState({
                                ...this.state,
                                new_pass: text
                            })
                        }}
                    />
                    <Text style={{ marginTop: 10, marginHorizontal: 20 }}>
                        Xác nhận mật khẩu mới
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
                        placeholder={"********"}
                        secureTextEntry={true}
                        onChangeText={text => {
                            this.setState({
                                ...this.state,
                                conf_pass: text
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
                            if (this.state.pass == "" || this.state.new_pass == "") {
                                showMessages("Thông báo", "Vui lòng nhập đầy đủ mật khẩu")
                            } else {
                                if (this.state.new_pass != this.state.conf_pass) {
                                    showMessages("Thông báo", "Xác nhận mật khẩu không đúng")
                                } else {
                                    this.changePass(this.state.pass, this.state.new_pass)
                                }
                            }
                        }}
                    >
                        <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>CẬP NHẬP THAY ĐỔI</Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </View>
        )
    }
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassScreen)
