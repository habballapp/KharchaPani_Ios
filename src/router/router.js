// importing navigation routers from react navigation;
import { createSwitchNavigator } from "react-navigation";
// importing navigation options and header props for  different screens
import { NonHeaderProps } from "./HeaderProps";
// importing different screen layouts

import Icon from 'react-native-vector-icons/Ionicons'
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import { NavigationComponent } from 'react-native-material-bottom-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import React, { Component } from 'react';
import { Textview, Container, ImageView } from '../components/default';
import { Platform, View, Image } from 'react-native'

// importing side drawer component props
// import { DrawerNavigationConfig } from "./SideDrawer";

import Home from "../components/screens/Home/Home";
import Login from "../components/screens/Login/Login";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AppLogo from "../assets/home.png";
import Categories_Image from "../assets/Categories.png";
import Logout from "../assets/Logout.png";
import Categories from "../components/screens/Categories/Categories";
import OutDebit from '../components/screens/Out Debit/OutDebit';
import InCredit from '../components/screens/InCredit/InCredit';
import Edit from '../components/screens/Edit/Edit';
import LogOut from '../components/screens/LogOut/LogOut';
import SignUp from '../components/screens/SignUp/SignUp';
import ForgotPassword from '../components/screens/ForgotPassword/ForgotPassword';
import ResetPassword from '../components/screens/ForgotPassword/Resetpassword'

const LoginStackScreen = createStackNavigator({

  Login: {
    screen: Login,
    navigationOptions: NonHeaderProps
  },
  SignUp: {
    screen:SignUp,
    navigationOptions: NonHeaderProps
  },
  ForgotPassword: {
    screen:ForgotPassword,
    navigationOptions: NonHeaderProps
  },
  ResetPassword:  {
    screen:ResetPassword,
    navigationOptions: NonHeaderProps
  }

})


const TabNavigator = createMaterialBottomTabNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: {

        tabBarIcon: ({ tintColor }) => (
          <View>
            {/* <Icon style={[{color: tintColor}]} size={25} name={'home'}/>   */}
            <Image
              style={{ width: 30, height: 30 }}
              source={AppLogo}
            />
          </View>),
        barStyle: { backgroundColor: '#0d5e50' },
        activeColor:"#0d5e50",
        inactiveColor:"#0d5e50",
        activeTintColor:"#2b6d2f",
        activeBackgroundColor:'#2b6d2f'
      }
    },
    Profile: {
      screen: Categories,
      navigationOptions: {

        tabBarIcon: ({ tintColor }) => (
          <View>
            {/* <Icon style={[{color: tintColor}]} size={25} name={'home'}/>   */}
            <Image
              style={{ width: 30, height: 30 }}
              source={Categories_Image}
            />
          </View>),
        barStyle: { backgroundColor: '#0d5e50' },
        activeColor:"#0d5e50",
        inactiveColor:"#0d5e50",
        activeTintColor:"#2b6d2f",
        activeBackgroundColor:'#2b6d2f'
      }
    },
    Image: {
      screen: LogOut,
      navigationOptions: {

        tabBarIcon: ({ tintColor }) => (
          <View>
            {/* <Icon style={[{color: tintColor}]} size={25} name={'home'}/>   */}
            <Image
              style={{ width: 35, height: 35 }}
              source={Logout}
            />
          </View>),
        barStyle: { backgroundColor: '#0d5e50' },
        activeColor:"#0d5e50",
        inactiveColor:"#0d5e50",
        activeTintColor:"#2b6d2f",
        activeBackgroundColor:'#2b6d2f'
      }
    },

  },
);


const ApplicationStackScreen = createStackNavigator({

  Home: {
    screen: TabNavigator,
    navigationOptions: NonHeaderProps
  },
  Categories: {
    screen: Categories,
    navigationOptions: NonHeaderProps
  },
  OutDebit: {
    screen: OutDebit,
    navigationOptions: NonHeaderProps
  },
  InCredit: {
    screen: InCredit,
    navigationOptions: NonHeaderProps
  },
  Edit: {
    screen: Edit,
    navigationOptions: NonHeaderProps
  }


})

class Hidden extends React.Component {
  render() {
    return null;
  }
}



export const createRootNavigator = (signedIn) => {
  return createSwitchNavigator(
    {
      HomeScreen: {
        screen: ApplicationStackScreen,
        // screen:ApplicationStackScreen
      },
      Login: {
        screen: LoginStackScreen
      },
    },
    {
        initialRouteName: signedIn === 'GOTOLOGIN' ? "Login" : signedIn === 'GOTOHOME' ? "HomeScreen" : null
      // initialRouteName: "HomeScreen"

    },

  )
}
