import React, { Component } from 'react'
import { TouchableOpacity } from 'react-native';
import { Text, View, StyleSheet, Dimensions, FlatList, ScrollView, TextInput, SafeAreaView } from 'react-native'
import * as theme from '../constants/Theme'
import HeaderApp from '../components/HeaderApp'
import { FontAwesome5 } from '@expo/vector-icons';
import { connect } from 'react-redux'
import { listSchedule } from '../redux/action'
import Modal from "react-native-modal";
import { getListSubject, updateSchedule } from '../constants/Api'
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

export class ScheduleScreen extends Component {

    componentDidMount() {
        this.props.listSchedule()
        this.getListSubject()
    }

    constructor(props) {
        super(props)
        this.state = {
            id_sub: "",
            isModalVisible: false,
            isModalVisible1: false,
            error: null,
            data: [],
            subject: "Toán",
            result: null
        }
    }

    getListSubject = async () => {
        try {
            const result = await getListSubject()
            if (result) {
                this.setState({
                    ...this.state,
                    data: result.data
                })
            }
        } catch (error) {
            this.setState({
                ...this.state,
                error: error
            })
            console.log(error)
        }
    }

    updateSchedule = async () => {
        const { id_sub, subject } = this.state
        try {
            const result = await updateSchedule(id_sub, subject)
            if (result) {
                this.setState({
                    ...this.state,
                    result: result.data
                }, () => this.props.listSchedule())
            }
        } catch (error) {
            this.setState({
                ...this.state,
                error: error
            })
            console.log(error)
        }
    }

    handleModal() {
        this.setState({
            isModalVisible: !this.state.isModalVisible
        });
    }

    handleModal1() {
        this.setState({
            isModalVisible1: !this.state.isModalVisible1
        });
    }

    render() {
        const { navigation } = this.props
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <HeaderApp onPress={() => navigation.openDrawer()} title={'Thời khóa biểu'} />
                <View style={styles.container_weekdays}>
                    <View style={{ width: screenWidth / 10 }} />
                    {this.renderWeekDays()}
                </View>
                {this.renderLesson()}
            </SafeAreaView>
        )
    }

    renderWeekDays() {
        let weekdays = ["T2", "T3", "T4", "T5", "T6", "T7"];
        return weekdays.map(day => {
            return (
                <Text key={day} style={styles.calendar_weekdays_text}>
                    {day}
                </Text>
            );
        });
    }

    renderLesson() {
        const { scheduleState } = this.props;
        return (
            <ScrollView>
                {this.renderModal()}
                {this.renderListSubjectModal()}
                <FlatList
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={
                        <View style={styles.sessionOfDay}>
                            <Text style={styles.textSession}>THE MORNING</Text>
                        </View>
                    }
                    data={scheduleState.dataMor}
                    numColumns={7}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity style={{
                            width: index % 7 ? 3 * screenWidth / 20 : screenWidth / 10,
                            height: 80, borderWidth: 0.25,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                            disabled={index % 7 ? false : true}
                            onPress={() => {
                                this.setState({
                                    ...this.state,
                                    subject: item.subject
                                }, () => this.setState({
                                    ...this.state,
                                    id_sub: item._id
                                }, () => this.handleModal()))
                            }}
                        >
                            <Text style={{ textAlign: 'center' }}>{item.subject}</Text>
                        </TouchableOpacity>
                    )}
                />
                <FlatList
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={
                        <View style={styles.sessionOfDay}>
                            <Text style={styles.textSession}>THE AFTERNOON</Text>
                        </View>
                    }
                    data={scheduleState.dataAfter}
                    numColumns={7}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity style={{
                            width: index % 7 ? 3 * screenWidth / 20 : screenWidth / 10,
                            height: 80, borderWidth: 0.25,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                            disabled={index % 7 ? false : true}
                            onPress={() => {
                                this.setState({
                                    ...this.state,
                                    subject: item.subject
                                }, () => this.setState({
                                    ...this.state,
                                    id_sub: item._id
                                }, () => this.handleModal()))
                            }}
                        >
                            <Text style={{ textAlign: 'center' }}>{item.subject}</Text>
                        </TouchableOpacity>
                    )}
                />
            </ScrollView>
        )
    }

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
                        padding: 5,
                        borderBottomWidth: 0.5,
                        borderBottomColor: theme.colors.schedule
                    }}>SỬA THỜI KHÓA BIỂU</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text>Tên môn học </Text>
                        <TextInput
                            style={{
                                marginTop: 20,
                                width: "50%",
                                height: 40,
                                marginVertical: 10,
                                borderBottomColor: theme.colors.gray,
                                justifyContent: "center",
                                alignItems: "center",
                                fontSize: 18,
                                paddingHorizontal: 15,
                                backgroundColor: theme.colors.border
                            }}
                            value={this.state.subject}
                            onChangeText={text => {
                                this.setState({
                                    ...this.state,
                                    subject: text
                                })
                            }}
                        />
                        <TouchableOpacity style={{
                            height: 40,
                            width: 40,
                            borderRadius: 5,
                            backgroundColor: theme.colors.schedule,
                            marginLeft: 10,
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: 5
                        }}
                            onPress={() => {
                                this.setState({
                                    ...this.state,
                                    subject: "Toán"
                                }, () => {
                                    this.handleModal();
                                    this.handleModal1()
                                })
                            }}>
                            <FontAwesome5 name="plus" size={24} color="white" />
                        </TouchableOpacity>
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
                        <TouchableOpacity style={{
                            width: 120, height: 40,
                            borderRadius: 25,
                            backgroundColor: theme.colors.schedule,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                            onPress={() => {
                                this.updateSchedule()
                                this.handleModal();
                            }}>
                            <Text style={{ fontWeight: 'bold', color: 'white' }}>CẬP NHẬP</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    }

    renderListSubjectModal() {
        return (
            <Modal
                style={{ justifyContent: "center", margin: 0, alignItems: "center" }}
                hasBackdrop={true}
                onBackdropPress={() => this.handleModal1()}
                isVisible={this.state.isModalVisible1}
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
                    }}>CHỌN MÔN HỌC</Text>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        height: screenHeight / 2,
                        borderBottomWidth: 0.5,
                        borderBottomColor: theme.colors.schedule
                    }}>
                        <FlatList
                            data={this.state.data}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) => (
                                <TouchableOpacity style={{
                                    marginVertical: 10,
                                    marginHorizontal: 10,
                                    flexDirection: 'row',
                                    alignItems: 'center'
                                }}
                                    onPress={() => {
                                        this.setState({
                                            ...this.state,
                                            subject: item.name
                                        })
                                    }}>
                                    <View style={styles.radio}>
                                        {this.state.subject == item.name &&
                                            <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: theme.colors.schedule }} />}
                                    </View>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                                        {item.name}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: 15,
                    }}>
                        <TouchableOpacity style={{
                            width: 120, height: 40,
                            borderRadius: 25,
                            backgroundColor: theme.colors.gray,
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: 20
                        }}
                            onPress={() => this.handleModal1()}>
                            <Text style={{ fontWeight: 'bold' }}>HỦY</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                            width: 120, height: 40,
                            borderRadius: 25,
                            backgroundColor: theme.colors.schedule,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                            onPress={() => {
                                this.updateSchedule()
                                this.handleModal1()
                            }}>
                            <Text style={{ fontWeight: 'bold', color: 'white' }}>ĐỒNG Ý</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    }
}



const mapStateToProps = (state) => ({
    scheduleState: state.scheduleReducer
})

const mapDispatchToProps = {
    listSchedule
}

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleScreen)

const styles = StyleSheet.create({
    calendar_weekdays_text: {
        color: theme.colors.caption,
        textAlign: "center",
        width: screenWidth / 7,
        fontSize: 16,
        paddingVertical: 10,
        margin: 1,
    },
    container_weekdays: {
        flexDirection: "row",
        alignContent: "center",
        justifyContent: "center"
    },
    sessionOfDay: {
        width: screenWidth,
        backgroundColor: theme.colors.schedule,
        paddingVertical: 7,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textSession: {
        color: theme.colors.white,
        fontSize: 12,
        fontWeight: 'bold'
    },
    radio: {
        width: 15,
        height: 15,
        borderRadius: 15,
        borderWidth: 1,
        marginRight: 10,
        borderColor: theme.colors.schedule,
        justifyContent: 'center',
        alignItems: 'center'
    },
})






