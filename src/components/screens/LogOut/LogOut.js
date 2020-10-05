import {
  Collapse,
  CollapseHeader,
  CollapseBody,
  AccordionList,
} from 'accordion-collapse-react-native';
import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
  TouchableHighlight,
  Text,
  Alert,
  Button,
  Picker,
  ActivityIndicator,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {StackNavigator} from 'react-navigation';
import {styles} from '../Login/login_styles';
import {Header, Title, Accordion} from 'native-base';
// import DatePicker from 'react-native-datepicker';
import {
  Container,
  Textview,
  Scrollview,
  Input,
  SafeViewArea,
  Statusbar,
  ImageView,
} from '../../default';
import {Separator} from 'native-base';
// import firebase from 'react-native-firebase';
import Toast from 'react-native-simple-toast';
// import { FloatingAction } from "react-native-floating-action";
import {Platform} from 'react-native';
// import TextInput from 'react-native-input-validator';
import {
  Table,
  TableWrapper,
  Row,
  Rows,
  Col,
} from 'react-native-table-component';
import Swiper from 'react-native-swiper';
import AppLogo from '../../../assets/docs.png';
import AppLogo1 from '../../../assets/user1.png';
import AppLogo2 from '../../../assets/Settings.png';
import LinearGradient from 'react-native-linear-gradient';
import AppLogo3 from '../../../assets/credit.png';
import Modal from 'react-native-modal';
import {LOGIN_CHECK} from '../../constants/StorageConstans';
import AsyncStorage from '@react-native-community/async-storage';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
    console.log('in constructor');

    // Alert.alert("Confirm", "You might lose changes", [{
    //   text: "OK",
    //   onPress: () => {
    //     AsyncStorage.setItem(LOGIN_CHECK, 'false').then(() => {
    //       this.props.navigation.navigate("Login");
    //       this.setState({ loading: false })
    //     }).catch((err) => { console.log(err) });

    //   }
    // }, {
    //   text: "Cancel",
    //   onPress: () => {
    //     AsyncStorage.setItem(LOGIN_CHECK, 'true').then(() => {
    //       this.props.navigation.navigate("Home");
    //     }).catch((err) => { console.log(err) });
    //   },
    //   style: "cancel"
    // }])
  }

  // define a separate function to get triggered on focus
  onFocusFunction = () => {
    // do some stuff on every screen focus

    Alert.alert('Confirm', 'You might lose changes', [
      {
        text: 'OK',
        onPress: () => {
          AsyncStorage.setItem(LOGIN_CHECK, 'false')
            .then(() => {
              this.props.navigation.navigate('Login');
              this.setState({loading: false});
            })
            .catch((err) => {
              console.log(err);
            });
        },
      },
      {
        text: 'Cancel',
        onPress: () => {
          AsyncStorage.setItem(LOGIN_CHECK, 'true')
            .then(() => {
              this.props.navigation.navigate('Home');
            })
            .catch((err) => {
              console.log(err);
            });
        },
        style: 'cancel',
      },
    ]);
  };

  // add a focus listener onDidMount
  async componentDidMount() {
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      this.onFocusFunction();
    });
  }

  render() {
    if (this.state.loading == true) {
      return (
        <ActivityIndicator
          size="large"
          color="#0d5e50"
          style={style.activityIndicator}
        />
      );
    } else {
      return null;
    }
  }
}

const style = StyleSheet.create({
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 80,
  },
});
