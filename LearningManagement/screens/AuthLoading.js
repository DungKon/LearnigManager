import React, { Component } from "react";
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  View,
  //   Clipboard,
  AppState,
  Platform
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage'
import NavigationUtil from "../navigation/NavigationUtil";
import { SCREEN_ROUTER } from "../constants/Constant";
// import { Notifications } from "expo";
// import * as Permissions from "expo-permissions";
import { connect } from "react-redux";
import reactotron from "reactotron-react-native";
import { colors } from "../constants/Theme";
import { getUserInfo } from '../redux/action'

class AuthLoadingScreen extends Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  //   async registerForPushNotificationsAsync() {
  //     const { status: existingStatus } = await Permissions.getAsync(
  //       Permissions.NOTIFICATIONS
  //     );
  //     let finalStatus = existingStatus;
  //     if (existingStatus !== "granted") {
  //       // Android remote notification permissions are granted during the app
  //       // install, so this will only ask on iOS
  //       const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
  //       finalStatus = status;
  //     }
  //     // Stop here if the user did not grant permissions
  //     if (finalStatus !== "granted") {
  //       return;
  //     }
  //     // Get the token that uniquely identifies this device
  //     let token = await Notifications.getExpoPushTokenAsync();
  //     await AsyncStorage.setItem("deviceID", deviceID);
  //     await Clipboard.setString(deviceID);
  //     Clipboard.setString(deviceID);
  //     console.log("deviceID", deviceID);
  //     reactotron.log("deviceID", deviceID);
  //   }

  //   _handleNotification = async notification => {
  //     this.props.getNotification();
  //     this.props.getOrder(ORDER_TYPE.ALL, 1);
  //     this.props.getOrder(ORDER_TYPE.INCOMING, 1);
  //     reactotron.log("order", notification);

  //     if (AppState.currentState === "active") {
  //       Notifications.setBadgeNumberAsync(0);
  //     }
  //     if (notification.origin == "selected") {
  //       reactotron.log("new", notification.data);
  //       var noti = notification.data;
  //       if (noti.Type == 7) {
  //         NavigationUtil.navigate("SavePoint", {
  //           initial_page: 1
  //         });
  //       }
  //       if (noti.type == 3 || noti.type == 5) {
  //         NavigationUtil.navigate("detailNews", {
  //           type: noti.type,
  //           newsID: noti.newsID
  //         });
  //       }
  //     }
  //   };

  //   async componentDidMount() {
  //     this.registerForPushNotificationsAsync();
  //     this._notificationSubscription = Notifications.addListener(
  //       this._handleNotification
  //     );
  //     if (Platform.OS === "android") {
  //       Notifications.createChannelAndroidAsync("reminder", {
  //         name: "reminder",
  //         priority: "max",
  //         sound: true,
  //         vibrate: [0, 250, 250, 250],
  //         badge: true
  //       });
  //     }
  //   }
  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem("token");
    if (userToken) {
      console.log("userToken", userToken)
      this.props.getUserInfo()
      this.props.navigation.navigate(SCREEN_ROUTER.MAIN);
    } else {
      this.props.navigation.navigate(SCREEN_ROUTER.AUTH);
    }
  };

  // Render any loading content that you like here
  render() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center"
        }}
      >
        <ActivityIndicator size="large" color={colors.schedule} />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

const mapStateToProps = state => ({

});

const mapDispatchToProps = {
  getUserInfo
};

export default connect(mapStateToProps, mapDispatchToProps)(AuthLoadingScreen);
