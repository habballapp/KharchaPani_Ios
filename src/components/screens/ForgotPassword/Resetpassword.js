import React, { Component } from 'react'
import { StyleSheet, View, TouchableOpacity, ActivityIndicator, Image, Alert  } from "react-native";
import { Container, Textview, Scrollview, Input, Button, SafeViewArea } from '../../default';
import { Logintag } from '../Login/LoginTag';
import { StackNavigator } from 'react-navigation';
import { styles } from '../Login/login_styles';
import Snackbar from 'react-native-snackbar';
import Toast from 'react-native-simple-toast';
import { LOGIN_CHECK, USER_ID } from "../../constants/StorageConstans";
import AsyncStorage from '@react-native-community/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign'
import AppLogo3 from "../../../assets/user.png";
import AppLogo4 from "../../../assets/lock.png";
import AppLogo5 from "../../../assets/email.png";


var validateEmail = '';
var validatePass = '';
var validateEmailAndPass = '';
export default class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            code: '',
            password: '',
            validEmail: true,
            validPass: true,
            errorEmpty: '',
            errorEmail: '',
            errorPass: '', 
            reset:''
        }
    }
    componentDidMount() {
        validateEmail = '';
        validatePass = '';
        validateEmailAndPass = '';
    }
    emailHandler(event) {
        this.setState({
            code: event,
            errorEmpty: '',
            errorEmail: '',
            validEmail: true,
            errorPass: '',
            validPass: true
        })
    }
   
    
  
    onLoginPressed() {
        if (this.state.email == '' || this.state.password == '' || this.state.reset == '' ){
            Snackbar.show({
                text: 'Invalid Username/Email or Password combination',
                duration: Snackbar.LENGTH_INDEFINITE,
                action: {
                    text: 'OK',
                    textColor: 'green',
                    onPress: () => { Snackbar.dismiss() },
                },
            });
            return;
        }else if(this.state.password !== this.state.reset){
            Snackbar.show({
                text: 'Passwords do not match',
                duration: Snackbar.LENGTH_INDEFINITE,
                action: {
                    text: 'OK',
                    textColor: 'green',
                    onPress: () => { Snackbar.dismiss() },
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
            this.setState({loading:true})
            this.requestLogin();
        // }
    }
    requestLogin() {
     
        fetch(`https://accounts.matz.group/api/resetpassword.php`, {
            method: 'POST',
            headers: {
                // 'Accept': 'application/x-www-form-urlencoded',
                // 'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                key : this.state.code,
                pass : this.state.password,


            })
        }).then((response) => response.text())
        .then((responseJson) => {
            this.setState({loading:false})
            
     
            var data = JSON.parse(responseJson).data;
           
                if (data != "password reset successfull") {
                    this.setState({loading:false})
                    this.props.navigation.navigate("Login");
                }
                else {

                    this.setState({loading:false})
                    Alert.alert("RESPONSE", data);
               
                }
            }).catch((error) => {
                Alert.alert(error.toString());
                this.setState({loading:false})
            });
        

     

    }

    passwordHandler(event) {
        this.setState({
            password: event,
            errorEmpty: '',
            errorPass: '',
            validEmail: true,
            validPass: true
        })
    }


    render() {
        if (this.state.loading == true) {
            return (
                <ActivityIndicator
                    size="large"
                    color='#0d5e50'
                    style={style.activityIndicator}
                />
            )
        } else {
            return (
                <LinearGradient start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 0.0 }} colors={['#0d5e50', '#0d5e50', '#000']} style={{ flex: 1 }}>
                <Container ContainerStyle={{
                    flex: 1, backgroundGradient: "vertical",
                    backgroundGradientTop: "#333333",
                    backgroundGradientBottom: "#666666"
                }}>
                    <Scrollview style={{ flex: 1 }}>
                        <SafeViewArea style={{ flex: 1 }}>

                            <Logintag />
                            <Container ContainerStyle={styles.formContainer}>
                                {/* <Icon name="md-mail" size={27} color={this.state.errorEmpty == '' && this.state.errorEmail == '' ? '#000':'red'} style={{marginRight:5}}/> */}
                                
                                <Container ContainerStyle={{ flexDirection: 'row' }}>
                                    <Image
                                        style={{ width: 40, height: 50, marginTop: 40, marginRight: 10 }}
                                        source={AppLogo5}
                                    />
                                    <Input
                                            placeholder="Enter Code"
                                            placeholderTextColor="#ffffff"
                                            keyboardType="email-address"
                                            returnKeyType={"next"}
                                            inputStyle={styles.input}
                                            onChangeText={(event) => { this.emailHandler(event) }}

                                        />
                                </Container>

                                <Container ContainerStyle={{ padding: 5 }}></Container>
                                
                                <Container ContainerStyle={{ flexDirection: 'row' }}>
                                    <Image
                                        style={{ width: 40, height: 50, marginTop: 40, marginRight: 10 }}
                                        source={AppLogo3}
                                    />
                                     <Input
                                            placeholder="Password"
                                            placeholderTextColor="#ffffff"
                                            keyboardType="email-address"
                                            returnKeyType={"next"}
                                            inputStyle={styles.input}
                                            onChangeText={(event) => {
                                                this.setState({ reset: event })
                                            }}

                                        />
                                </Container>

                                <Container ContainerStyle={{ padding: 5 }}></Container>

                                {/* <Container  style={{flexDirection: 'row'}}>

                        </Container> */}

                                <Container ContainerStyle={{ flexDirection: 'row' }}>
                                    <Image
                                        style={{ width: 40, height: 50, marginTop: 40, marginRight: 10 }}
                                        source={AppLogo4}
                                    />

                                   <Input
                                            placeholder="Reset Password"
                                            placeholderTextColor="#ffffff"
                                            secureTextEntry={true}
                                            returnKeyType={"next"}
                                            inputStyle={styles.input}
                                            onChangeText={(event) => { this.passwordHandler(event) }}


                                        />
                                </Container>


                                <Container ContainerStyle={{ padding: 7 }}></Container>
                                <Button
                                    onPress={() => { this.onLoginPressed() }}
                                    title="Reset" style={styles.loginButtonStyles} textStyle={styles.loginButtonText} />

                            </Container>


                            <Container ContainerStyle={{ marginTop: 80 }}></Container>


                            {/* <Container ContainerStyle={{
                                alignSelf: 'center', justifyContent: 'center', flexDirection: 'row', marginTop: 20,
                                position: 'absolute', bottom: 20
                            }}>
                                <TouchableOpacity
                                  onPress={() =>this.props.navigation.navigate("Login")}
                                >
                                    <Textview

                                        style={styles.loginButtonText}>
                                        Already Registered?
                                        
                                      </Textview>

                                </TouchableOpacity>
                            </Container> */}

                            <Container ContainerStyle={{
                                alignSelf: 'center', justifyContent: 'center', flexDirection: 'row', marginTop: 20,
                                position: 'absolute', bottom: 20
                            }}>
                                
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
        height: 80
    }


});



