import React, { Component } from 'react'
import { Text, View, Dimensions, FlatList, StyleSheet, TouchableOpacity, TextInput, Image, RefreshControl } from 'react-native'
import * as theme from '../constants/Theme'
import { Calendar, CalendarList, Agenda } from 'react-native-calendars'
import { SafeAreaView } from 'react-native'
let { width } = Dimensions.get('window');
import { connect } from 'react-redux'
import { listEvent, selectDate } from '../redux/action'
import moment from 'moment'
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Header } from 'react-native-elements'
import { deleteEvent, addEvent } from '../constants/Api'
import { AntDesign } from '@expo/vector-icons';
import Modal from "react-native-modal";
import * as Notifications from 'expo-notifications';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Toast, { DURATION } from "react-native-easy-toast";

const _format = 'YYYY-MM-DD'
const _formatEx = 'DD-MM-YYYY'
let newDaysObject = {};
const ITEM_SIZE = 40
var today = new Date()

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});
//1620226858000
export class EventScreen extends Component {
    constructor(props) {
        super(props)
        const { navigation, eventState } = this.props
        this.state = {
            _markedDates: newDaysObject,
            isLoading: false,
            err: null,
            isModalVisible: false,
            hours: "00",
            minutes: "00",
            date: moment(today.dateString).format(_format),
            dateEx: moment(today.dateString).format(_formatEx),
            type: 1,
            title: "",
            note: "",
            month: today.getMonth() + 1,
            year: today.getFullYear(),
            timeSta: 0,
            notification: {}
        }
        this.handleHours = this.handleHours.bind(this)
        this.handleMinutes = this.handleMinutes.bind(this)
        this.viewabilityConfig = { viewAreaCoveragePercentThreshold: ITEM_SIZE }
    }

    handleHours(info) {
        this.setState({
            ...this.state,
            hours: info.viewableItems[0].item
        })
    }

    handleMinutes(info) {
        this.setState({
            ...this.state,
            minutes: info.viewableItems[0].item
        })
    }

    handleModal() {
        var myDate = this.state.date.split("-");
        var newDate = new Date(myDate[0], myDate[1] - 1, myDate[2])
        this.setState({
            isModalVisible: !this.state.isModalVisible,
            timeSta: newDate.getTime() / 1000,
        });
    }

    addEvent = async (payload) => {
        console.log(payload.timeSta - Date.now() / 1000)
        try {
            const result = await addEvent(payload)
            if (result) {
                // this.setState({
                //     ...this.state,
                //     data: result.data,
                //     hours: "00",
                //     minutes: "00",
                //     type: 1,
                //     title: "",
                //     note: "",

                // }, () => {
                this.props.listEvent(this.state.date)
                if (payload.timeSta - Date.now() / 1000 > 0) {
                    this.schedulePushNotification(payload.timeSta - Date.now() / 1000)
                    this.toast.show("Thêm sự kiện thành công!", 2000)
                }

                // })
            }
        } catch (error) {
            this.setState({
                ...this.state,
                error: error
            })
            console.log(error)
        }
    }

    componentDidMount() {
        this.props.listEvent(this.state.date)

        this.registerForPushNotificationsAsync()
        //Receiving Notifications
        Notifications.addNotificationReceivedListener(this._handleNotification);

        Notifications.addNotificationResponseReceivedListener(this._handleNotificationResponse);
    }

    _handleNotification = notification => {
        this.setState({ notification: notification });
    };

    _handleNotificationResponse = response => {
        console.log(response);
    };

    async registerForPushNotificationsAsync() {
        let token;
        const existingStatus = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log(token);

        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }
    }

    async schedulePushNotification(time) {
        let title = this.state.title
        let hours = this.state.hours
        let minutes = this.state.minutes
        let dateEx = this.state.dateEx
        const res = await Notifications.scheduleNotificationAsync({
            content: {
                title: `📣 THÔNG BÁO : ${title}`,
                body: `Vào lúc ${hours.concat(':').concat(minutes)} ${dateEx}`,
                data: { data: 'goes here' },
            },
            trigger: { seconds: time },
        });
        console.log(res);
    }

    onDaySelect = (day) => {
        const _selectedDay = moment(day.dateString).format(_format);
        this.setState({
            ...this.state,
            _markedDates: newDaysObject,
            date: moment(day.dateString).format(_format),
            dateEx: moment(day.dateString).format(_formatEx)

        }, () => {
            this.props.listEvent(this.state.date)
            let selected = true;
            if (this.state._markedDates[_selectedDay]) {
                // Already in marked dates, so reverse current marked state
                // marked = !this.state._markedDates[_selectedDay].marked;
            }
            // Create a new object using object property spread since it should be immutable
            // Reading: https://davidwalsh.name/merge-objects
            const updatedMarkedDates = { ...this.state._markedDates, ...{ [_selectedDay]: { selected } } }
            // Triggers component to render again, picking up the new state
            this.setState({ _markedDates: updatedMarkedDates });
        })

    }

    deleteEvent = async (id) => {
        try {
            const result = await deleteEvent(id)
            if (result) {
                this.setState({
                    ...this.state,
                    isLoading: false
                }, () => {
                    this.props.listEvent(this.state.date)
                    this.toast.show("Xoá sự kiện thành công!", 2000)
                })
            }
        } catch (error) {
            this.setState({
                ...this.state,
                err: error
            })
            console.log(error)
        }
    }


    renderModal() {
        const hours = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10',
            '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']
        const minutes = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10'
            , '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'
            , '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'
            , '31', '32', '33', '34', '35', '36', '37', '38', '39', '40'
            , '41', '42', '43', '44', '45', '46', '47', '48', '49', '50'
            , '51', '52', '53', '54', '55', '56', '57', '58', '59']
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
                    }}>
                        TẠO SỰ KIỆN
                     <Text>                 {this.state.dateEx}</Text>
                    </Text>

                    <View style={{ flexDirection: 'row', marginVertical: 15 }}>
                        <TouchableOpacity style={styles.factor}
                            onPress={() => this.setState({
                                ...this.state,
                                type: 1
                            })}>
                            <View style={styles.radio}>
                                {this.state.type == 1 &&
                                    <View style={styles.choice} />}
                            </View>
                            <Text style={{ fontSize: 14 }}>Kiểm tra</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.factor}
                            onPress={() => this.setState({
                                ...this.state,
                                type: 2
                            })}>
                            <View style={styles.radio}>
                                {this.state.type == 2 &&
                                    <View style={styles.choice} />}
                            </View>
                            <Text style={{ fontSize: 14 }}>Sự kiện thường</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.content}>
                        <Text style={{ fontWeight: 'bold', marginLeft: 10 }}>TÊN SỰ KIỆN : </Text>
                        <TextInput
                            style={{
                                marginTop: 20,
                                width: "60%",
                                height: 40,
                                marginVertical: 10,
                                borderBottomColor: theme.colors.gray,
                                justifyContent: "center",
                                alignItems: "center",
                                fontSize: 18,
                                paddingHorizontal: 15,
                                backgroundColor: theme.colors.border
                            }}
                            value={this.state.title}
                            onChangeText={text => {
                                this.setState({
                                    ...this.state,
                                    title: text
                                })
                            }}
                        />
                    </View>
                    <Text style={{ fontSize: 16, position: 'absolute', left: 15, top: 190 }}>Thời gian :</Text>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        width: '40%',
                        alignSelf: 'flex-end',
                        marginRight: 40,
                        marginVertical: 15,
                        borderWidth: 1,
                        paddingLeft: 10,
                        borderRadius: 50
                    }}>
                        <AntDesign name="caretup" size={10} color="black" style={{ position: 'absolute', top: -10, left: 57 }} />
                        <AntDesign name="caretdown" size={10} color="black" style={{ position: 'absolute', top: 40, left: 57 }} />
                        <FlatList
                            style={{ height: ITEM_SIZE, width: ITEM_SIZE }}
                            data={hours}
                            keyExtractor={(item, index) => index.toString()}
                            snapToInterval={ITEM_SIZE}
                            showsVerticalScrollIndicator={false}
                            onViewableItemsChanged={this.handleHours}
                            viewabilityConfig={this.viewabilityConfig}
                            renderItem={({ item, index }) =>
                                <View style={styles.time}>
                                    <Text style={styles.oclock}>{item}</Text>
                                </View>
                            }
                        />
                        <Text style={[styles.oclock]}>: </Text>
                        <FlatList
                            style={{ height: ITEM_SIZE, width: ITEM_SIZE }}
                            data={minutes}
                            keyExtractor={(item, index) => index.toString()}
                            snapToInterval={ITEM_SIZE}
                            showsVerticalScrollIndicator={false}
                            onViewableItemsChanged={this.handleMinutes}
                            viewabilityConfig={this.viewabilityConfig}
                            renderItem={({ item, index }) =>
                                <View style={styles.time}>
                                    <Text style={styles.oclock}>{item}</Text>
                                </View>
                            }
                        />
                    </View>
                    <View style={styles.content}>
                        <Text style={{ fontSize: 16 }}>
                            Ghi chú :
                    </Text>
                        <TextInput
                            style={{
                                marginTop: 20,
                                width: "20%",
                                height: 40,
                                marginVertical: 10,
                                flex: 1,
                                fontSize: 18,
                                paddingHorizontal: 15,
                                marginLeft: 20,
                                textAlign: 'right',
                                backgroundColor: theme.colors.border
                            }}
                            value={this.state.note}
                            onChangeText={text => {
                                this.setState({
                                    ...this.state,
                                    note: text
                                })
                            }}
                        />
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
                                this.handleModal();
                                this.addEvent({
                                    time: this.state.hours.concat(':').concat(this.state.minutes),
                                    date: this.state.date,
                                    type: this.state.type,
                                    title: this.state.title,
                                    note: this.state.note,
                                    timeSta: this.state.timeSta + (parseInt(this.state.hours) + parseInt(this.state.minutes) / 60) * 3600
                                })
                            }}>
                            <Text style={{ fontWeight: 'bold', color: 'white' }}>CẬP NHẬP</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    }

    render() {
        // console.log(today.getMinutes())
        const { navigation, eventState } = this.props
        eventState.data.forEach((day) => {
            newDaysObject[day.date] = {
                selected: day.selected,
                marked: day.marked
            };
        });
        return (
            <SafeAreaView style={{ flex: 1 }}>
                {this.renderModal()}
                <Header
                    placement='left'
                    backgroundColor={theme.colors.schedule}
                    leftComponent={
                        <TouchableOpacity onPress={() => navigation.openDrawer()}>
                            <MaterialIcons name="menu" size={28} color="white" />
                        </TouchableOpacity>
                    }
                    centerComponent={
                        <Text style={styles.text_head}>Sự kiện</Text>
                    }
                    rightComponent={
                        <TouchableOpacity onPress={() => { this.handleModal() }}>
                            <FontAwesome5 name="plus" size={24} color="white" />
                        </TouchableOpacity>
                    }
                />
                {this.renderBody()}
            </SafeAreaView>
        )
    }

    renderBody() {
        const { navigation, eventState } = this.props
        eventState.data.forEach((day) => {
            newDaysObject[day.date] = {
                selected: day.selected,
                marked: day.marked
            };
        });
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <Toast
                    ref={(toast) => this.toast = toast}
                    position="top"
                    positionValue={200}
                    fadeInDuration={750}
                    fadeOutDuration={1000}
                    opacity={0.8}
                    textStyle={{ color: "white" }}
                />
                <Calendar
                    // Collection of dates that have to be marked. Default = {}
                    markedDates={this.state._markedDates}
                    onDayPress={(day) => this.onDaySelect(day)}
                    enableSwipeMonths={true}
                    onMonthChange={(month) => {
                        this.setState({
                            ...this.state,
                            month: month.month,
                            year: month.year
                        })
                    }}
                // onDayLongPress={(day) => { console.log('selected day', day) }}
                />
                <View style={{ backgroundColor: theme.colors.event, padding: 5 }}>
                    <Text style={{
                        textAlign: 'center',
                        color: theme.colors.white,
                        fontWeight: 'bold'
                    }}>SỰ KIỆN THÁNG {this.state.month}/{this.state.year}</Text>
                </View>
                {eventState.dataDate.length != 0 ? <FlatList
                    // contentContainerStyle={{ paddingBottom: 20 }}
                    data={eventState.dataDate}
                    keyExtractor={(item, index) => index.toString()}
                    ListHeaderComponent={
                        <View style={{
                            width: width,
                            height: 60,
                            backgroundColor: theme.colors.white,
                            justifyContent: 'center',
                            paddingLeft: 35,
                        }}>
                            <View style={{
                                width: 8,
                                height: 8,
                                borderRadius: 5,
                                borderWidth: 2,
                                borderColor: theme.colors.event,
                                position: 'absolute',
                                left: 20,
                                bottom: 30
                            }} />
                            <Text style={{
                                fontSize: 16,
                                marginLeft: 5,
                                fontWeight: 'bold',
                                color: theme.colors.event,
                                textDecorationLine: 'underline'
                            }}>Sự kiện ngày {this.state.dateEx}</Text>
                        </View>
                    }
                    refreshControl={
                        <RefreshControl
                            refreshing={eventState.isLoading}
                            onRefresh={() => this.props.listEvent(this.state.date)}
                        />
                    }
                    renderItem={(this.renderItem)}
                /> : <View style={{
                    width: width,
                    height: 60,
                    backgroundColor: theme.colors.white,
                    justifyContent: 'center',
                    paddingLeft: 35,
                }}>
                    <Text style={{ fontSize: 16, marginLeft: 5 }}>Không có sự kiện nào ngày {this.state.dateEx}</Text>
                </View>}
            </View>
        )
    }

    renderItem = ({ item, index }) => {
        var date = new Date(item.timeSta * 1000)
        return (
            <View style={{
                width: width,
                height: 70,
                backgroundColor: theme.colors.white,
                justifyContent: 'center',
                paddingLeft: 35,
            }}>
                <View style={{ flexDirection: 'row' }}>
                    {item.type == 1 && <MaterialCommunityIcons name="file-document-edit-outline" size={20} color={theme.colors.document} />}
                    <Text style={{ fontSize: 16, marginLeft: 5, fontWeight: 'bold', color: theme.colors.event }}>
                        {item.title}
                    </Text></View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="ios-alarm" size={15} color="black" />
                    <Text style={{ fontSize: 14, marginLeft: 5 }}>
                        {item.time} Thứ {date.getDay() + 1} ngày {moment(date).format(_formatEx)}
                    </Text>
                </View>
                <Text style={{ fontSize: 13, fontStyle: 'italic' }}>
                    Note : {item.note}
                </Text>
                <View style={{ position: 'absolute', left: 20, top: -30 }}>
                    <View style={{ height: 60, width: 2, backgroundColor: theme.colors.event, marginLeft: 3 }} />
                    <View style={{
                        width: 8,
                        height: 8,
                        borderRadius: 5,
                        borderWidth: 2,
                        borderColor: theme.colors.event,
                        marginTop: 1,
                    }} />
                </View>
                <TouchableOpacity style={[styles.button, {
                    borderColor: theme.colors.red,
                    position: 'absolute',
                    right: 20
                }]}
                    onPress={() => this.deleteEvent(item._id)}
                >
                    <FontAwesome name="trash-o" size={20} color={theme.colors.red} />
                </TouchableOpacity>
                <View style={{
                    width: width - 60,
                    height: 0.5,
                    backgroundColor: theme.colors.border,
                    justifyContent: 'flex-end',
                    marginTop: 7,
                }} />
            </View>
        );
    };

}

const mapStateToProps = (state) => ({
    eventState: state.eventReducer
})

const mapDispatchToProps = {
    listEvent, selectDate
}

export default connect(mapStateToProps, mapDispatchToProps)(EventScreen)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    text_head: {
        fontSize: 20,
        color: theme.colors.white,
        fontWeight: 'bold'
    },
    bgItem: {
        marginTop: 5,
        width: '96%',
        marginHorizontal: '2%',
        borderRadius: 5,
        backgroundColor: theme.colors.white,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
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
    },
    time: {
        width: ITEM_SIZE,
        height: ITEM_SIZE,
        justifyContent: 'center',
        alignItems: 'center',
    },
    oclock: {
        fontSize: 30,
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
        borderTopWidth: 0.6,
        borderBottomWidth: 0.5,
        borderColor: theme.colors.schedule,
        marginHorizontal: 10
    },
})


// import React from 'react'
// import moment from 'moment' // 2.20.1
// import { View } from 'react-native' // 0.0.1
// import { Calendar } from 'react-native-calendars' // 1.16.1


// const _format = 'YYYY-MM-DD'
// const _today = moment().format(_format)
// const _maxDate = moment().add(15, 'days').format(_format)

// class WixCalendar extends React.Component {
//     // It is not possible to select some to current day.
//     initialState = {
//         [_today]: { disabled: true }
//     }

//     constructor() {
//         super();

//         this.state = {
//             _markedDates: this.initialState
//         }
//     }

//     onDaySelect = (day) => {
//         const _selectedDay = moment(day.dateString).format(_format);
//         this.setState({
//             _markedDates: this.initialState
//         }, () => {
//             let selected = true;
//             if (this.state._markedDates[_selectedDay]) {
//                 // Already in marked dates, so reverse current marked state
//                 // marked = !this.state._markedDates[_selectedDay].marked;
//             }
//             console.log(this.state._markedDates)
//             // Create a new object using object property spread since it should be immutable
//             // Reading: https://davidwalsh.name/merge-objects
//             const updatedMarkedDates = { ...this.state._markedDates, ...{ [_selectedDay]: { selected } } }

//             // Triggers component to render again, picking up the new state
//             this.setState({ _markedDates: updatedMarkedDates });
//         })

//     }

//     render() {
//         return (
//             <View style={{ flex: 1, paddingTop: 100 }}>
//                 <Calendar
//                     // we use moment.js to give the minimum and maximum dates.
//                     onDayPress={this.onDaySelect}
//                     markedDates={this.state._markedDates}
//                 />
//             </View>
//         );
//     }
// }

// export default WixCalendar