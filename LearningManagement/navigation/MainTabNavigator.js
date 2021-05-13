import React from 'react';

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import HomeScreen from '../screens/HomeScreen';
import EventScreen from '../screens/EventScreen';
import DocumentScreen from '../screens/DocumentScreen';
import ScheduleScreen from '../screens/ScheduleScreen';
import * as theme from '../constants/Theme'
import LoginScreen from '../screens/LoginScreen';
import PointDetailScreen  from '../screens/PointDetailScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerContent } from '../components/DrawerContent'
import AccountScreen from '../screens/AccountScreen'
import ChangePassScreen from '../screens/ChangePassScreen'

const HomeStack = createStackNavigator();
const ScheduleStack = createStackNavigator();
const EventStack = createStackNavigator();
const DocumentStack = createStackNavigator();

const Tab = createMaterialBottomTabNavigator();

const MainTabScreen = () => (
  <Tab.Navigator
    initialRouteName="Home"
    activeColor={theme.colors.white}
  >
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{
        tabBarLabel: 'Home',
        tabBarColor: theme.colors.schedule,
        tabBarIcon: ({ color }) => (
          <Icon name="home-outline" color={color} size={26} />
        ),
      }}
    />
    <Tab.Screen
      name="Schedule"
      component={ScheduleScreen}
      options={{
        tabBarLabel: 'Schedule',
        tabBarColor: theme.colors.schedule,
        tabBarIcon: ({ color }) => (
          <Icon name="calendar" color={color} size={26} />
        ),
      }}
    />
    <Tab.Screen
      name="Event"
      component={EventScreen}
      options={{
        tabBarLabel: 'Event',
        tabBarColor: theme.colors.schedule,
        tabBarIcon: ({ color }) => (
          <Icon name="alarm-light" color={color} size={26} />
        ),
      }}
    />
    <Tab.Screen
      name="Document"
      component={DocumentScreen}
      options={{
        tabBarLabel: 'Document',
        tabBarColor: theme.colors.schedule,
        tabBarIcon: ({ color }) => (
          <Icon name="file-document" color={color} size={26} />
        ),
      }}
    />
  </Tab.Navigator>
);

// export default MainTabScreen;

const HomeStackScreen = ({ navigation }) => (
  <HomeStack.Navigator screenOptions={{
    headerStyle: {
      backgroundColor: theme.colors.schedule,
    },
    headerTintColor: theme.colors.white,
    headerTitleStyle: {
      fontWeight: 'bold'
    }
  }}>
    <HomeStack.Screen name="Home" component={HomeScreen} options={{
      title: 'Overview',
      headerLeft: () => (
        <Icon.Button name="menu" size={25} backgroundColor={theme.colors.schedule} onPress={() => navigation.openDrawer()}></Icon.Button>
      )
    }} />
  </HomeStack.Navigator>
);

const ScheduleStackScreen = ({ navigation }) => (
  <ScheduleStack.Navigator screenOptions={{
    headerStyle: {
      backgroundColor: theme.colors.schedule,
    },
    headerTintColor: theme.colors.white,
    headerTitleStyle: {
      fontWeight: 'bold'
    }
  }}>
    <ScheduleStack.Screen name="Schedule" component={ScheduleScreen} options={{
      headerLeft: () => (
        <Icon.Button name="menu" size={25} backgroundColor={theme.colors.schedule} onPress={() => navigation.openDrawer()}></Icon.Button>
      )
    }} />
  </ScheduleStack.Navigator>
);

const EventStackScreen = ({ navigation }) => (
  <EventStack.Navigator screenOptions={{
    headerStyle: {
      backgroundColor: theme.colors.schedule,
    },
    headerTintColor: theme.colors.white,
    headerTitleStyle: {
      fontWeight: 'bold'
    }
  }}>
    <EventStack.Screen name="Event" component={EventScreen} options={{
      headerLeft: () => (
        <Icon.Button name="menu" size={25} backgroundColor={theme.colors.schedule} onPress={() => navigation.openDrawer()}></Icon.Button>
      )
    }} />
  </EventStack.Navigator>
);

const DocumentStackScreen = ({ navigation }) => (
  <DocumentStack.Navigator screenOptions={{
    headerStyle: {
      backgroundColor: theme.colors.schedule,
    },
    headerTintColor: theme.colors.white,
    headerTitleStyle: {
      fontWeight: 'bold'
    }
  }}>
    <DocumentStack.Screen name="Document" component={DocumentScreen} options={{
      headerLeft: () => (
        <Icon.Button name="menu" size={25} backgroundColor={theme.colors.schedule} onPress={() => navigation.openDrawer()}></Icon.Button>
      )
    }} />
  </DocumentStack.Navigator>
);


const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator headerMode={{
      headerShow: null
    }}>
      <Stack.Screen name="main" component={MainTabScreen} />
      <Stack.Screen name="account" component={AccountScreen} />
      <Stack.Screen name="pointDetail" component={PointDetailScreen} />
      <Stack.Screen name="changePass" component={ChangePassScreen} />
    </Stack.Navigator>
  );
}

const Drawer = createDrawerNavigator();

export default function App({ navigation }) {
  return (
      <NavigationContainer>
        <Drawer.Navigator initialRouteName="Home" drawerContent={props => <DrawerContent {...props} />}>
          <Drawer.Screen name="Main" component={MyStack} />
        </Drawer.Navigator>
      </NavigationContainer>
  );
}