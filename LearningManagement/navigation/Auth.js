import React from 'react'
import { Text, View } from 'react-native'
import {
  createStackNavigator
} from '@react-navigation/stack'
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from "../screens/RegisterScreen";
import { NavigationContainer } from '@react-navigation/native';

const Stack = createStackNavigator();

function Auth() {
  return (
    <NavigationContainer>
      <Stack.Navigator headerMode={{
        headerShow: null
      }}>
        <Stack.Screen name="login" component={LoginScreen} />
        <Stack.Screen name="register" component={RegisterScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Auth;