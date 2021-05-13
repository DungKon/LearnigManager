import * as React from 'react';
import { Button, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './screens/HomeScreen'
import ScheduleScreen from './screens/ScheduleScreen'
import { DrawerContent } from './components/DrawerContent'
import MainTabNavigator from './navigation/MainTabNavigator'
import AppNavigator from './navigation/AppNavigator'
import NavigationUtil from './navigation/NavigationUtil'
import { Provider } from "react-redux";
import store from './redux/store'

const Drawer = createDrawerNavigator();

export default function App({ navigation }) {
  return (
    <Provider store={store}>
      <AppNavigator
        ref={navigatorRef =>
          NavigationUtil.setTopLevelNavigator(navigatorRef)
        }
      />
    </Provider>
  );
}
