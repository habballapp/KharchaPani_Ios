import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import {
  Container,
  Textview,
  Scrollview,
  Input,
  Button,
  SafeViewArea,
} from '../../default';
import {Logintag} from './LoginTag';
import {StackNavigator} from 'react-navigation';
import {styles} from './login_styles';
import Snackbar from 'react-native-snackbar';
import Toast from 'react-native-simple-toast';
import {LOGIN_CHECK, USER_ID} from '../../constants/StorageConstans';
import AsyncStorage from '@react-native-community/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AppLogo3 from '../../../assets/user.png';
import AppLogo4 from '../../../assets/lock.png';

var validateEmail = '';
var validatePass = '';
var validateEmailAndPass = '';
export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      email: '',
      password: '',
      validEmail: true,
      validPass: true,
      errorEmpty: '',
      errorEmail: '',
      errorPass: '',
    };
  }
  componentDidMount() {
    validateEmail = '';
    validatePass = '';
    validateEmailAndPass = '';
  }
  emailHandler(event) {
    this.setState({
      email: event,
      errorEmpty: '',
      errorEmail: '',
      validEmail: true,
      errorPass: '',
      validPass: true,
    });
  }
  passwordHandler(event) {
    this.setState({
      password: event,
      errorEmpty: '',
      errorPass: '',
      validEmail: true,
      validPass: true,
    });
  }
  onLoginPressed() {
    if (this.state.email == '' || this.state.password == '') {
      Snackbar.show({
        text: 'Invalid Email or Password combination',
        duration: Snackbar.LENGTH_INDEFINITE,
        action: {
          text: 'OK',
          textColor: 'green',
          onPress: () => {
            Snackbar.dismiss();
          },
        },
      });
      return;
    }

    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,15})+$/;
    // if (reg.test(this.state.email) === false && this.state.email != '') {
    //     Snackbar.show({
    //         text: 'Email is badly formatted',
    //         duration: Snackbar.LENGTH_INDEFINITE,
    //         action: {
    //             text: 'OK',
    //             textColor: 'green',
    //             onPress: () => { Snackbar.dismiss() },
    //         },
    //     });
    //     return;
    // }
    // if (this.state.password.length <= 7 && this.state.password != '') {
    //     // this.setState({validPass:false,errorPass:"Please enter valid password"});
    //     Snackbar.show({
    //         text: 'Please Enter Valid Password',
    //         duration: Snackbar.LENGTH_INDEFINITE,
    //         action: {
    //             text: 'OK',
    //             textColor: 'green',
    //             onPress: () => { Snackbar.dismiss() },
    //         },
    //     });
    //     return;
    // }
    // if (reg.test(this.state.email) === true && this.state.email != '' && this.state.password.length > 7 && this.state.password != '') {
    this.setState({loading: true});
    this.requestLogin();
    // }
  }
  requestLogin() {
    fetch(`https://accounts.matz.group/api/login.php`, {
      method: 'POST',
      headers: {
        // 'Accept': 'application/x-www-form-urlencoded',
        // 'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: this.state.email,
        pass: this.state.password,
      }),
    })
      .then((response) => response.text())
      .then((responseJson) => {
        this.setState({loading: false});

        // console.log(responseJson._bodyBlob._data)
        // console.log(responseJson._bodyInit._data)
        // console.log(responseJson.bodyUsed)
        // console.log(responseJson.headers)
        // console.log(responseJson._bodyBlob)
        var data = JSON.parse(responseJson).data;

        if (data != 'Invalid Username/password') {
          //  this.setState({loading:false})
          AsyncStorage.setItem(LOGIN_CHECK, 'true')
            .then(() => {
              AsyncStorage.setItem(USER_ID, data)
                .then(() => {
                  this.props.navigation.navigate('Home', {userID: data});
                  this.setState({loading: false});
                })
                .catch((err) => {
                  console.log(err);
                });
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          this.setState({loading: false});
          Alert.alert('RESPONSE', data);
        }
      })
      .catch((error) => {
        Alert.alert(error.toString());
        this.setState({loading: false});
      });
    // this.props.navigation.navigate("Home");
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
      return (
        <LinearGradient
          start={{x: 0.0, y: 1.0}}
          end={{x: 1.0, y: 0.0}}
          colors={['#0d5e50', '#0d5e50', '#000']}
          style={{height: '100%'}}>
          <Container
            ContainerStyle={{
              height: '100%',
              backgroundGradient: 'vertical',
              backgroundGradientTop: '#333333',
              backgroundGradientBottom: '#666666',
            }}>
            <Scrollview style={{width: '100%', height: '100%'}}>
              <SafeViewArea style={{flex: 1}}>
                <Logintag />
                <Container ContainerStyle={styles.formContainer}>
                  {/* <Icon name="md-mail" size={27} color={this.state.errorEmpty == '' && this.state.errorEmail == '' ? '#000':'red'} style={{marginRight:5}}/> */}
                  <Container ContainerStyle={{flexDirection: 'row'}}>
                    <Image
                      style={{
                        width: 40,
                        height: 30,
                        marginTop: 40,
                        marginRight: 10,
                      }}
                      source={AppLogo3}
                    />
                    <Input
                      placeholder="Username"
                      placeholderTextColor="#ffffff"
                      keyboardType="email-address"
                      returnKeyType={'next'}
                      inputStyle={styles.input}
                      onChangeText={(event) => {
                        this.emailHandler(event);
                      }}
                    />
                  </Container>

                  <Container ContainerStyle={{padding: 5}}></Container>

                  {/* <Container  style={{flexDirection: 'row'}}>

                            </Container> */}

                  <Container ContainerStyle={{flexDirection: 'row'}}>
                    <Image
                      style={{
                        width: 40,
                        height: 30,
                        marginTop: 40,
                        marginRight: 10,
                      }}
                      source={AppLogo4}
                    />

                    <Input
                      placeholder="Password"
                      placeholderTextColor="#ffffff"
                      secureTextEntry={true}
                      returnKeyType={'next'}
                      inputStyle={styles.input}
                      onChangeText={(event) => {
                        this.passwordHandler(event);
                      }}
                    />
                  </Container>

                  <Container ContainerStyle={{padding: 10}}></Container>

                  <Button
                    onPress={() => {
                      this.onLoginPressed();
                    }}
                    title="Login"
                    style={styles.loginButtonStyles}
                    textStyle={styles.loginButtonText}
                  />
                </Container>

                <Container ContainerStyle={{marginTop: '50%'}}></Container>

                <Container
                  ContainerStyle={{
                    alignSelf: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    marginTop: 20,
                    position: 'absolute',
                    bottom: '5%',
                  }}>
                  <TouchableOpacity
                    style={{marginLeft: 20, marginRight: 2}}
                    onPress={() => this.props.navigation.navigate('SignUp')}>
                    <Textview textStyle={{color: '#ffffff'}}>
                      Not Registered Yet?
                    </Textview>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{marginLeft: 10, marginRight: 20}}
                    onPress={() =>
                      this.props.navigation.navigate('ForgotPassword')
                    }>
                    <Textview textStyle={{color: '#ffffff'}}>
                      Forgot Password?
                    </Textview>
                  </TouchableOpacity>
                </Container>

                <Container
                  ContainerStyle={{
                    alignSelf: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    marginTop: 20,
                    position: 'absolute',
                    bottom: 20,
                  }}>
                  <Textview textStyle={{color: '#ffffff'}}>
                    Powered by Matz Solutions Pvt Ltd Ⓒ
                  </Textview>
                </Container>
              </SafeViewArea>
            </Scrollview>
          </Container>
        </LinearGradient>
      );
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
