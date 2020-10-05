import React, { Component } from 'react'
import { StyleSheet, View,TouchableOpacity,ActivityIndicator } from "react-native";

import BottomNavigation, { Tab } from 'react-native-material-bottom-navigation'
import Icon from 'react-native-vector-icons'

export default class BottomNavigator extends Component {
  render() {
    return (
      <BottomNavigation
        labelColor="black"
        rippleColor="black"
        style={{ height: 56, elevation: 8, position: 'absolute', left: 0, bottom: 0, right: 0 }}
        onTabChange={(newTabIndex) => alert(`New Tab at position ${newTabIndex}`)}
      >
        <Tab
          barBackgroundColor="#37474F"
          label="Movies & TV"
          icon={<Icon size={24} color="black" name="tv" />}
        />
        <Tab
          barBackgroundColor="#00796B"
          label="Music"
          icon={<Icon size={24} color="black" name="music-note" />}
        />
        <Tab
          barBackgroundColor="#5D4037"
          label="Books"
          icon={<Icon size={24} color="black" name="book" />}
        />
        <Tab
          barBackgroundColor="#3E2723"
          label="Newsstand"
          icon={<Icon size={24} color="black" name="newspaper" />}
        />
      </BottomNavigation>
    )
  }
}