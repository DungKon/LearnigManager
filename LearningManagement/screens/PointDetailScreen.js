import React, { Component } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Dimensions, RefreshControl } from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Header } from 'react-native-elements'
import Modal from "react-native-modal";
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import * as theme from '../constants/Theme'
import { listPoint, getListSum } from '../redux/action'
import { Feather } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
const screenWidth = Dimensions.get("window").width;
import Toast, { DURATION } from "react-native-easy-toast";
import { addPoint, deletePoint, updatePoint } from '../constants/Api'
import Empty from '../components/Empty'
import Loading from '../components/Loading'
import {showMessages} from '../components/Alert'

const number = [
    { value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }, { value: 5 },
    { value: 6 }, { value: 7 }, { value: 8 }, { value: 9 }, { value: 0 }
]
class PointDetailScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            error: null,
            data: props.route.params.data,
            payload: {
                userId: props.userState.data._id,
                semester: props.userState.data.semester_curr,
                subject: props.route.params.data.subject
            },
            isModalVisible: false,
            semester: props.userState.data.semester_curr,
            subject: props.route.params.data.subject,
            userId: props.userState.data._id,
            factor: 1,
            value: "",
            id_up: null,
            is_add: true,
        }
    }

    handleModal() {
        this.setState({
            isModalVisible: !this.state.isModalVisible
        });
    }

    componentDidMount() {
        this.props.listPoint(this.state.payload)
    }

    addPoint = async () => {
        const { semester, subject, userId, factor, value, payload } = this.state
        try {
            const result = await addPoint(semester, subject, userId, factor, Number(value))
            if (result) {
                this.setState({
                    ...this.state,
                    isLoading: false,
                }, () => {
                    this.props.listPoint(payload);
                    this.props.getListSum()
                    this.toast.show("Thêm điểm thành công!", 2000)
                })
            }
        } catch (error) {
            this.setState({
                ...this.state,
                isLoading: false,
                error: error
            })
            console.log(error)

        }
    }

    deletePoint = async (id) => {
        const { semester, subject, userId, payload } = this.state
        try {
            const result = await deletePoint(id, userId, semester, subject)
            if (result) {
                this.setState({
                    ...this.state,
                    isLoading: false,
                }, () => {
                    this.props.listPoint(payload);
                    this.props.getListSum()
                    this.toast.show("Xóa điểm thành công!", 2000)
                })
            }
        } catch (error) {
            this.setState({
                ...this.state,
                isLoading: false,
                error: error
            })
            console.log(error)

        }
    }

    updatePoint = async () => {
        const { id_up, userId, semester, subject, factor, value, payload } = this.state
        try {
            const result = await updatePoint(id_up, userId, semester, subject, factor, Number(value))
            if (result) {
                this.setState({
                    ...this.state,
                    isLoading: false,
                }, () => {
                    this.props.listPoint(payload);
                    this.props.getListSum()
                })
            }
        } catch (error) {
            this.setState({
                ...this.state,
                isLoading: false,
                error: error
            })
            console.log(error)

        }
    }

    render() {
        const { navigation, pointState } = this.props
        return (
            <View style={{ flex: 1 }}>
                {this.renderModal()}
                <Header
                    placement='left'
                    backgroundColor={theme.colors.schedule}
                    leftComponent={
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <MaterialIcons name="arrow-back" size={28} color="white" />
                        </TouchableOpacity>
                    }
                    centerComponent={
                        <Text style={styles.text_head}>Môn {this.state.data.subject}</Text>
                    }
                    rightComponent={
                        <TouchableOpacity onPress={() => this.setState({
                            ...this.state,
                            is_add: true,
                            factor: 1,
                            value: ""
                        }, () => this.handleModal())}>
                            <FontAwesome5 name="plus" size={24} color="white" />
                        </TouchableOpacity>
                    }
                />
                <Toast
                    ref={(toast) => this.toast = toast}
                    position="top"
                    positionValue={200}
                    fadeInDuration={750}
                    fadeOutDuration={1000}
                    opacity={0.8}
                    textStyle={{ color: "white" }}
                />
                {this.renderBody()}
            </View>
        )
    }

    renderBody() {
        const { navigation, pointState } = this.props
        if (pointState.isLoading) return <Loading />
        if (pointState.data.length == 0) return <Empty />
        return (
            <FlatList
                // contentContainerStyle={{ paddingBottom: 20 }}
                data={pointState.data}
                keyExtractor={(item, index) => index.toString()}
                renderItem={(this.renderItem)}
                refreshControl={
                    <RefreshControl
                        refreshing={pointState.isLoading}
                        onRefresh={() => this.props.listPoint(this.state.payload)}
                    />
                }
            />
        )
    }

    renderItem = ({ item, index }) => {
        const { navigate } = this.props.navigation
        let date = item.updatedAt.toString()
        return (
            <View style={styles.bgItem}>
                <View style={{ width: 80, height: 80, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 30, fontWeight: 'bold' }}>
                        {item.value}
                    </Text>
                    <Text style={{ fontWeight: 'bold' }}>Điểm ({item.factor})</Text>
                </View>
                <View style={{ padding: 10, width: screenWidth * 9 / 10 - 90 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Feather name="clock" size={15} color="black" />
                        <Text style={{ fontSize: 14, marginLeft: 5 }}>
                            Cập nhật: {date.substring(8, 10)}-{date.substring(5, 7)}-{date.substring(0, 4)}
                        </Text>
                    </View>
                    <View style={{ marginVertical: 10, alignSelf: 'flex-end', flexDirection: 'row' }}>
                        <TouchableOpacity style={[styles.button, { marginRight: 10, borderColor: theme.colors.schedule }]}
                            onPress={() => this.setState({
                                ...this.state,
                                id_up: item._id,
                                factor: item.factor,
                                value: item.value.toString(),
                                is_add: false
                            }, () => this.handleModal())}>
                            <FontAwesome name="pencil" size={20} color={theme.colors.schedule} />
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, { borderColor: theme.colors.red }]}
                            onPress={() => this.deletePoint(item._id)}>
                            <FontAwesome name="trash-o" size={20} color={theme.colors.red} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    renderModal() {
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
                        margin: 5
                    }}>HỆ SỐ ĐIỂM</Text>
                    <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                        <TouchableOpacity style={styles.factor}
                            onPress={() => this.setState({
                                ...this.state,
                                factor: 1
                            })}>
                            <View style={styles.radio}>
                                {this.state.factor == 1 &&
                                    <View style={{ width: 15, height: 15, borderRadius: 10, backgroundColor: theme.colors.schedule }} />}
                            </View>
                            <Text>Hệ số 1</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.factor}
                            onPress={() => this.setState({
                                ...this.state,
                                factor: 2
                            })}>
                            <View style={styles.radio}>
                                {this.state.factor == 2 &&
                                    <View style={{ width: 15, height: 15, borderRadius: 10, backgroundColor: theme.colors.schedule }} />}
                            </View>
                            <Text>Hệ số 2</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.factor}
                            onPress={() => this.setState({
                                ...this.state,
                                factor: 3
                            })}>
                            <View style={styles.radio}>
                                {this.state.factor == 3 &&
                                    <View style={{ width: 15, height: 15, borderRadius: 10, backgroundColor: theme.colors.schedule }} />}
                            </View>
                            <Text>Hệ số 3</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={{
                        color: theme.colors.schedule,
                        fontWeight: 'bold',
                        padding: 10,
                        margin: 15,
                        borderBottomWidth: 0.5,
                        borderTopWidth: 0.5
                    }}>Môn {this.state.subject}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 15 }}>
                        <View style={{ height: 40, width: '70%', backgroundColor: theme.colors.border, justifyContent: 'center', paddingLeft: 10 }}>
                            <Text style={styles.text}>{this.state.value}</Text>
                        </View>
                        <MaterialIcons name="cancel" size={40} color="red" style={{ marginLeft: 10 }}
                            onPress={() => this.setState({
                                ...this.state,
                                value: ""
                            })} />
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <FlatList
                            numColumns={5}
                            data={number}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) => (
                                <TouchableOpacity style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 20,
                                    borderWidth: 1,
                                    margin: 5,
                                    borderColor: theme.colors.schedule,
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                                    onPress={() => this.setState({
                                        ...this.state,
                                        value: this.state.value.concat(item.value)
                                    })}>
                                    <Text style={styles.text}>
                                        {item.value}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        />
                        <View>
                            <TouchableOpacity style={{
                                width: 40,
                                height: 40,
                                borderRadius: 20,
                                borderWidth: 1,
                                margin: 5,
                                borderColor: theme.colors.schedule,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                                onPress={() => this.setState({
                                    ...this.state,
                                    value: this.state.value.substring(0, this.state.value.length - 1)
                                })}>
                                <MaterialIcons name="arrow-back" size={28} color={theme.colors.schedule} />
                            </TouchableOpacity>
                            <TouchableOpacity style={{
                                width: 40,
                                height: 40,
                                borderRadius: 20,
                                borderWidth: 1,
                                margin: 5,
                                borderColor: theme.colors.schedule,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                                onPress={() => this.setState({
                                    ...this.state,
                                    value: this.state.value.concat(".")
                                })}>
                                <Text style={styles.text}>.</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 15 }}>
                        <TouchableOpacity style={{
                            width: 120, height: 40,
                            borderRadius: 25,
                            backgroundColor: theme.colors.gray,
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: 20
                        }}
                            onPress={() => this.handleModal()}>
                            <Text style={{ fontWeight: 'bold' }}>ĐÓNG</Text>
                        </TouchableOpacity>
                        {this.state.is_add ? <TouchableOpacity style={{
                            width: 120, height: 40,
                            borderRadius: 25,
                            backgroundColor: theme.colors.schedule,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                            onPress={() => {
                                if (Number(this.state.value) > 10) {
                                    showMessages("Cảnh báo","Điểm nhập không hợp lệ")
                                } else {
                                    this.addPoint()
                                    this.handleModal()
                                }
                            }}>
                            <Text style={{ fontWeight: 'bold', color: 'white' }}>THÊM ĐIỂM</Text>
                        </TouchableOpacity> : <TouchableOpacity style={{
                            width: 120, height: 40,
                            borderRadius: 25,
                            backgroundColor: theme.colors.schedule,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                            onPress={() => {
                                this.updatePoint()
                                this.handleModal()
                            }}>
                            <Text style={{ fontWeight: 'bold', color: 'white' }}>CẬP NHẬP</Text>
                        </TouchableOpacity>}
                    </View>
                </View>
            </Modal>
        );
    }
}

const mapStateToProps = (state) => ({
    pointState: state.pointReducer,
    userState: state.userReducer
})

const mapDispatchToProps = {
    listPoint,
    getListSum
}

export default connect(mapStateToProps, mapDispatchToProps)(PointDetailScreen)

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
        borderWidth: 0.5,
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
    }
})