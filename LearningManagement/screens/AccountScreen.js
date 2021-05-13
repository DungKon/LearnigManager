import React, { Component } from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Dimensions,
    FlatList,
    Image,
    ImageBackground
} from 'react-native'
import { connect } from 'react-redux'
import { Header } from 'react-native-elements'
import { MaterialIcons } from '@expo/vector-icons'
import * as theme from '../constants/Theme'
import { FontAwesome } from '@expo/vector-icons'
import DatePicker from 'react-native-datepicker';
import { updateSemester, updateAvatar } from '../constants/Api';
import Modal from "react-native-modal";
import { SafeAreaView, KeyboardAvoidingView, ScrollView } from 'react-native'
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
import * as ImagePicker from 'expo-image-picker';
import { getUserInfo, getListSum } from '../redux/action'
import Toast, { DURATION } from "react-native-easy-toast";
import {
    Title,
    Caption,
} from 'react-native-paper'

const LOP = [{ class: "Lớp 10", value: 10 },
{ class: "Lớp 11", value: 11 },
{ class: "Lớp 12", value: 12 }]

const bookcolors = [
    '#c60e58', '#9d1bb7', '#394bb5', '#00aaf8', '#009387', '#89c640', '#ff9b00'
]

export class AccountScreen extends Component {
    constructor(props) {
        super(props)
        const { userState } = this.props
        this.state = {
            imgAvatar: userState.data.image,
            isModalVisible: false,
            class: Math.round(this.props.userState.data.semester_curr / 10),
            hki: this.props.userState.data.semester_curr % 10
        }
    }

    updateSemester = async () => {
        try {
            const result = await updateSemester(this.state.class * 10 + this.state.hki)
            if (result) {
                this.props.getUserInfo();
                this.handleModal();
                this.props.getListSum()
                this.toast.show("Chuyển kì học thành công!", 2000)
            }
        } catch (error) {
            console.log(error)
        }
    }

    async openDocument() {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                aspect: [4, 3],
                quality: 1,
            });
            this.setState({
                ...this.state,
                imgAvatar: result.uri,
            }, () => this.updateAvatar())
        } catch (err) {
            // Expo didn't build with iCloud, expo turtle fallback
            // this.webview.injectJavaScript('selectFile()');
            console.log(err);
        }
    }

    updateAvatar = async () => {
        try {
            const result = await updateAvatar(this.state.imgAvatar)
            if (result) {
                this.props.getUserInfo();
            }
        } catch (error) {
            console.log(error)
        }
    }

    handleModal() {
        this.setState({
            isModalVisible: !this.state.isModalVisible
        });
    }

    renderModal() {
        const { userState } = this.props
        return (
            <Modal
                style={{ justifyContent: "center", margin: 0, alignItems: "center" }}
                hasBackdrop={true}
                onBackdropPress={() => this.handleModal()}
                isVisible={this.state.isModalVisible}
            >
                <View
                    style={{
                        width: "90%",
                        borderRadius: 10,
                        backgroundColor: 'white',
                        padding: 10
                    }}
                >
                    <Text style={{
                        fontSize: 18,
                        fontWeight: 'bold',
                        color: theme.colors.schedule,
                        padding: 5,
                        borderBottomWidth: 0.5,
                        borderBottomColor: theme.colors.schedule
                    }}>THÔNG TIN TÀI KHOẢN</Text>
                    <TouchableOpacity style={{
                        width: 90,
                        height: 90,
                        borderRadius: 50,
                        marginTop: 20,
                        alignSelf: 'center'
                    }}
                        onPress={() => this.openDocument()}>
                        <Image
                            source={{ uri: this.state.imgAvatar }}
                            style={{ width: 90, height: 90, borderRadius: 50 }}
                        />
                        <View style={{
                            height: 30, width: 30,
                            backgroundColor: theme.colors.border,
                            borderRadius: 15,
                            position: 'absolute',
                            bottom: 0,
                            right: 0,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <FontAwesome name="edit" size={18} color={theme.colors.schedule} />
                        </View>
                    </TouchableOpacity>
                    <Title style={[styles.title, { alignSelf: 'center' }]}>{userState.data.name}</Title>
                    <TouchableOpacity style={[styles.touch, { backgroundColor: this.state.class == 10 ? theme.colors.schedule : "white" }]}
                        onPress={() => this.setState({
                            ...this.state,
                            class: 10
                        })}
                    >
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: this.state.class == 10 ? "white" : "black" }}>
                            LỚP 10
                            </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.touch, { backgroundColor: this.state.class == 11 ? theme.colors.schedule : "white" }]}
                        onPress={() => this.setState({
                            ...this.state,
                            class: 11
                        })}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: this.state.class == 11 ? "white" : "black" }}>
                            LỚP 11
                            </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.touch, { backgroundColor: this.state.class == 12 ? theme.colors.schedule : "white" }]}
                        onPress={() => this.setState({
                            ...this.state,
                            class: 12
                        })}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: this.state.class == 12 ? "white" : "black" }}>
                            LỚP 12
                            </Text>
                    </TouchableOpacity>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginVertical: 20,
                    }}>
                        <TouchableOpacity style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}
                            onPress={() => this.setState({
                                ...this.state,
                                hki: 1
                            })}>
                            <View style={styles.radio}>
                                {this.state.hki == 1 && <View style={{ width: 15, height: 15, borderRadius: 10, backgroundColor: theme.colors.schedule }} />}
                            </View>
                            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                                Học kì I
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}
                            onPress={() => this.setState({
                                ...this.state,
                                hki: 2
                            })}>
                            <View style={styles.radio}>
                                {this.state.hki == 2 && <View style={{ width: 15, height: 15, borderRadius: 10, backgroundColor: theme.colors.schedule }} />}
                            </View>
                            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                                Học kì II
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={{
                        width: 120, height: 40,
                        borderRadius: 25,
                        backgroundColor: theme.colors.schedule,
                        alignItems: 'center',
                        justifyContent: 'center',
                        alignSelf: 'center'
                    }}
                        onPress={() => {
                            this.updateSemester()
                        }}>
                        <Text style={{ fontWeight: 'bold', color: 'white' }}>ĐỒNG Ý</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        );
    }

    render() {
        const { navigation, userState, sumState } = this.props
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <Header
                    placement='left'
                    backgroundColor={theme.colors.schedule}
                    leftComponent={
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <MaterialIcons name="arrow-back" size={28} color="white" />
                        </TouchableOpacity>
                    }
                    centerComponent={
                        <Text style={styles.text_head}>Tài khoản</Text>
                    }
                />
                {this.renderModal()}
                <View style={{ flexDirection: 'row' }}>
                    <Toast
                        ref={(toast) => this.toast = toast}
                        position="top"
                        positionValue={200}
                        fadeInDuration={750}
                        fadeOutDuration={1000}
                        opacity={0.8}
                        textStyle={{ color: "white" }}
                    />
                    <Image
                        source={{ uri: userState.data.image }}
                        style={{ width: 80, height: 80, borderRadius: 50, margin: 20 }}
                    />
                    <View style={{ justifyContent: 'center' }}>
                        <Title style={styles.title}>{userState.data.name}</Title>
                        <Caption style={styles.caption}>Lớp
                                {Math.round(userState.data.semester_curr / 10)} - Học kì
                                {userState.data.semester_curr % 10}</Caption>
                        <TouchableOpacity style={{
                            flexDirection: 'row',
                            backgroundColor: '#ff9b00',
                            borderRadius: 100,
                            padding: 5,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: 10
                        }}
                            onPress={() => this.handleModal()}>
                            <FontAwesome name="edit" size={15} color="white" />
                            <Text style={{ fontWeight: 'bold', color: 'white', marginLeft: 3 }}>Sửa thông tin</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1 }}>
                        <ImageBackground style={{ flex: 1, padding: 5, alignItems: 'center', justifyContent: 'center' }}
                            source={{ uri: 'https://cloud.vector6.com/wp-content/uploads/2021/03/0000000024-hoa-tiet-vong-nguyet-que-trang-tri-png-7.png' }}>
                            <Text style={{
                                color: theme.colors.document,
                                fontWeight: 'bold',
                                fontSize: 30
                            }}>{Math.round(sumState.average * 10) / 10}</Text>
                        </ImageBackground>
                        <Text style={{ alignSelf: 'center', fontWeight: 'bold' }}>Điểm TB</Text>
                    </View>
                </View>
                <Text style={{ alignSelf: 'center', fontWeight: 'bold', marginVertical: 20 }}>TỔNG KẾT CHUNG</Text>
                <View style={{
                    width: '85%',
                    height: 165,
                    borderWidth: 0.5,
                    alignSelf: 'center',
                    flexDirection: 'row',
                    alignItems: 'flex-end',
                }}>
                    <View style={[styles.line, { bottom: -6 }]}>
                        <Text style={styles.text_line}>0.0</Text>
                        <View style={[styles.line1, { backgroundColor: 'white' }]} />
                        <Text style={styles.text_line}>0.0</Text>
                    </View>
                    <View style={[styles.line, { top: 83 }]}>
                        <Text style={styles.text_line}>5.0</Text>
                        <View style={styles.line1} />
                        <Text style={styles.text_line}>5.0</Text>
                    </View>
                    <View style={[styles.line, { top: 68 }]}>
                        <Text style={styles.text_line}>6.0</Text>
                        <View style={styles.line1} />
                        <Text style={styles.text_line}>6.0</Text>
                    </View>
                    <View style={[styles.line, { top: 53 }]}>
                        <Text style={styles.text_line}>7.0</Text>
                        <View style={styles.line1} />
                        <Text style={styles.text_line}>7.0</Text>
                    </View>
                    <View style={[styles.line, { top: 38 }]}>
                        <Text style={styles.text_line}>8.0</Text>
                        <View style={styles.line1} />
                        <Text style={styles.text_line}>8.0</Text>
                    </View>
                    <View style={[styles.line, { top: 23 }]}>
                        <Text style={styles.text_line}>9.0</Text>
                        <View style={styles.line1} />
                        <Text style={styles.text_line}>9.0</Text>
                    </View>
                    <View style={[styles.line, { top: 8 }]}>
                        <Text style={styles.text_line}>10.0</Text>
                        <View style={styles.line1} />
                        <Text style={styles.text_line}>10.0</Text>
                    </View>
                    {sumState.data.map((item, index) => (
                        <View style={{
                            backgroundColor: bookcolors[index % 7],
                            width: screenWidth / 100 * 6,
                            height: item.score * 15,
                            marginLeft: screenWidth / 100,
                            alignItems: 'flex-start'
                        }}
                            key={index}
                        >
                            <View style={{
                                position: 'absolute',
                                top: -10,
                                height: 20,
                                width: screenWidth / 100 * 6,
                            }}>
                                <Text style={{ fontSize: 8, textAlign: 'center' }}>{item.score}</Text>
                            </View>
                            <View style={{
                                position: 'absolute',
                                bottom: -20,
                                height: 20,
                                width: screenWidth / 100 * 6,
                            }}>
                                <Text style={{ fontSize: 8, textAlign: 'center' }}>{item.subject}</Text>
                            </View>
                        </View>
                    ))}
                </View>
                <View style={{ flexDirection: 'row', marginHorizontal: 30, alignItems: 'center', marginTop: 30 }}>
                    <View style={{ width: 10, height: 10, backgroundColor: '#c60e58', marginLeft: 2 }} />
                    <View style={{ width: 10, height: 10, backgroundColor: '#9d1bb7', marginLeft: 2 }} />
                    <View style={{ width: 10, height: 10, backgroundColor: '#394bb5', marginLeft: 2 }} />
                    <Text style={{ fontSize: 12, marginLeft: 5 }}>Tổng kết chung : {Math.round(sumState.average * 100) / 100}</Text>
                </View>
                <View style={{ paddingHorizontal: 20 }}>
                    <Text style={{ alignSelf: 'center', fontWeight: 'bold', marginVertical: 20 }}>THANG ĐIỂM</Text>
                    <Text> - Từ 9,0 đến 10,0: Xuất sắc;</Text>
                    <Text> - Từ 8,0 đến cận 9,0: Giỏi;</Text>
                    <Text> - Từ 7,0 đến cận 8,0: Khá;</Text>
                    <Text> - Từ 5,0 đến cận 7,0: Trung bình;</Text>
                    <Text> - Từ 4,0 đến cận 5,0: Yếu;</Text>
                    <Text> - Dưới 4,0: Kém.</Text>
                </View>
            </SafeAreaView>
        )
    }
}

const mapStateToProps = (state) => ({
    userState: state.userReducer,
    sumState: state.sumReducer
})

const mapDispatchToProps = {
    getUserInfo,
    getListSum
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountScreen)

const styles = StyleSheet.create({
    text_head: {
        fontSize: 20,
        color: theme.colors.white,
        fontWeight: 'bold'
    },
    bgItem: {
        marginTop: 5,
        width: '96%',
        height: 80,
        marginHorizontal: '2%',
        borderRadius: 5,
        backgroundColor: theme.colors.white,
        flexDirection: 'row'
    },
    button: {
        width: 50,
        height: 30,
        borderWidth: 0.2,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    radio: {
        width: 20,
        height: 20,
        borderRadius: 15,
        borderWidth: 1,
        marginRight: 5,
        borderColor: theme.colors.schedule,
        justifyContent: 'center',
        alignItems: 'center'
    },
    factor: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    choice: {
        width: 15,
        height: 15,
        borderRadius: 10,
        backgroundColor:
            theme.colors.schedule
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10
    },
    date: {
        flexDirection: 'row',
        height: 40,
        width: '40%',
        borderWidth: 0.5,
        borderRadius: 20,
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    time: {
        flexDirection: 'row',
        height: 40,
        width: '30%',
        borderWidth: 0.5,
        borderRadius: 20,
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 30
    },
    lop: {
        height: 40,
        borderBottomColor: theme.colors.gray,
        justifyContent: "center",
        alignItems: "center",
        fontSize: 18,
        paddingHorizontal: 15
    },
    title: {
        fontSize: 18,
        marginTop: 3,
        fontWeight: 'bold'
    },
    caption: {
        fontSize: 14,
        lineHeight: 16,
    },
    line: {
        flexDirection: 'row',
        position: 'absolute',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    line1: {
        height: 0.5,
        width: '100%',
        backgroundColor: 'black',
        marginHorizontal: 5
    },
    text_line: {
        fontSize: 8,
        fontWeight: 'bold'
    },
    touch: {
        borderRadius: 5,
        borderWidth: 1,
        borderColor: theme.colors.schedule,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        marginTop: 5,
        width: screenWidth / 1.5,
        alignSelf: 'center'
    }
})