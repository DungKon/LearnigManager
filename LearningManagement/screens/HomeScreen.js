import React, { Component } from 'react'
import { Text, View, FlatList, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native'
import * as theme from '../constants/Theme'
import { getListSubject } from '../constants/Api'
import HeaderApp from '../components/HeaderApp'
import NavigationUtil from '../navigation/NavigationUtil'
import { connect } from "react-redux";
import { getListSum, getUserInfo } from '../redux/action/index'

const bookcolors = [
    '#c60e58', '#9d1bb7', '#394bb5', '#00aaf8', '#009387', '#89c640', '#ff9b00'
]

export class HomeScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            payload: {
                userId: this.props.userState.data._id,
                semester: this.props.userState.data.semester_curr
            }
        }
    }
    componentDidMount() {
        this.props.getListSum()
    }

    render() {
        const { navigation, sumState } = this.props
        return (
            <View style={{ flex: 1 }}>
                <HeaderApp onPress={() => navigation.openDrawer()} title={'Trang chủ'} />
                <FlatList
                    // contentContainerStyle={{ paddingBottom: 20 }}
                    numColumns={2}
                    data={sumState.data}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={(this.renderItem)}
                    refreshControl={
                        <RefreshControl
                            refreshing={sumState.isLoading}
                            onRefresh={() => this.props.getListSum()}
                        />
                    }
                />
            </View>
        )
    }

    renderItem = ({ item, index }) => {
        const { navigate } = this.props.navigation
        return (
            <>
                <TouchableOpacity
                    onPress={() => navigate('pointDetail', { data: item })}
                    style={[styles.bgItem, { backgroundColor: bookcolors[index % 7] }]}
                >
                    <Text style={{ fontSize: 20, color: "white", fontWeight: 'bold' }}>
                        {item.subject}
                    </Text>
                    <Text style={{ fontSize: 20, color: "white", fontWeight: 'bold' }}>
                        {item.score == 0 ? "_ : _" : item.score}
                    </Text>
                    <View style={styles.book}>
                        <View style={styles.book1}>
                            <View style={styles.line} />
                        </View>
                    </View>
                </TouchableOpacity>
            </>
        );
    };
}

const mapStateToProps = state => ({
    sumState: state.sumReducer,
    userState: state.userReducer
});

const mapDispatchToProps = {
    getListSum, getUserInfo
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);


const styles = StyleSheet.create({
    text_head: {
        fontSize: 20,
        color: theme.colors.white,
        fontWeight: 'bold'
    },
    bgItem: {
        marginTop: 10,
        width: '44%',
        height: 100,
        marginHorizontal: '3%',
        alignItems: 'center',
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 15,
        // justifyContent: 'center',
        paddingTop: 15,
        // backgroundColor: theme.colors.document
    },
    book: {
        height: 20,
        backgroundColor: 'white',
        width: '100%',
        position: 'absolute',
        bottom: 0,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        alignItems: 'flex-end'
    },
    book1: {
        height: 15,
        backgroundColor: 'white',
        width: '98%',
        position: 'absolute',
        bottom: 0,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        borderLeftWidth: 1,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: theme.colors.gray,
        marginVertical: 2,
        alignItems: 'flex-end',
        justifyContent: 'center'
    },
    line: {
        height: 5,
        width: '95%',
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderColor: theme.colors.border,
    }
})