import React from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import MainTabNavigator from "./MainTabNavigator";
import { createStackNavigator } from '@react-navigation/stack'
import AuthLoadingScreen from "../screens/AuthLoading";
import { SCREEN_ROUTER } from "../constants/Constant";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import Auth from '../navigation/Auth'

export default createAppContainer(
  createSwitchNavigator({
    AuthLoading: AuthLoadingScreen,
    Main: MainTabNavigator,
    [SCREEN_ROUTER.AUTH]: Auth
  })
);
