import { Collapse, CollapseHeader, CollapseBody, AccordionList } from 'accordion-collapse-react-native';
import React, { Component } from 'react'
import { StyleSheet, View, TouchableOpacity, ScrollView, Image, FlatList, TouchableHighlight, Text, Alert, Button, Picker, ActivityIndicator } from "react-native";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { StackNavigator } from 'react-navigation';
import { styles } from '../Login/login_styles';
import { Header, Title, Accordion } from 'native-base';
// import DatePicker from 'react-native-datepicker';
import { Container, Textview, Scrollview, Input, SafeViewArea, Statusbar, ImageView } from '../../default';
import { Separator } from 'native-base';
// import firebase from 'react-native-firebase';
import Toast from 'react-native-simple-toast';
// import { FloatingAction } from "react-native-floating-action";
import { Platform } from 'react-native'
// import TextInput from 'react-native-input-validator';
import { Table, TableWrapper, Row, Rows, Col } from 'react-native-table-component';
import Swiper from 'react-native-swiper';
import AppLogo from "../../../assets/docs.png";
import AppLogo1 from "../../../assets/user1.png";
import AppLogo2 from "../../../assets/Settings.png";
import LinearGradient from 'react-native-linear-gradient';
import AppLogo3 from "../../../assets/profile.png";
import {
    TextField,
    FilledTextField,
    OutlinedTextField,
} from 'react-native-material-textfield';
import DatePicker from 'react-native-datepicker';
import AsyncStorage from '@react-native-community/async-storage';
import { LOGIN_CHECK, USER_ID } from "../../constants/StorageConstans";
import AppLogo4 from "../../../assets/incredit.png";
import Modal from 'react-native-modal';

var Name = '';

// this.setState({ isModalVisible: false });


export default class InCredit extends Component {

    fieldNameRef = React.createRef();
    fieldAmountRef = React.createRef();
    fieldDetailsRef = React.createRef();

    constructor(props) {
        super(props)
        this.state = {

            userID: this.props.navigation.getParam('userID'),
            readId: this.props.navigation.getParam('readId'),
            Name: '',
            Details: '',
            Amount: '',
            date: '',
            value: '',
            data: [],
            data_id: [],
            loading: false,
            errorFieldName: '',
            errorFieldAmount: '',
            errorFieldDetails: '',
            borderColor: '#000000',
            category: 'Select Category',
            isModalVisible: false


        }

        if (this.state.userID === undefined)
            this.getUserIDFromAsync();
        else {
            this.getPickerValue();

        }

    }

    getUserIDFromAsync = async () => {
        try {
            const value = await AsyncStorage.getItem(USER_ID);
            if (value !== null) {
                this.setState({ userID: value });

                this.getPickerValue();
                // this.requestHistoryData();

            }
        } catch (error) {
            Alert.error("User id not found")
            // Error retrieving data
        }
    }

    hideModal = () => {

        this.setState({ isModalVisible: false });
    }

    // componentWillMount() {

    //     // this.InCreditData();
    //     this.getPickerValue();
    // }

    InCreditData() {

        var that = this;

        // this.setState({ isModalVisible: false });
        // Alert.alert(readId);

        var error = false;
        if (this.state.Name == '') {
            this.setState({ errorFieldName: 'Please enter your name' });
            error = true;
            // return;
        }
        if (this.state.Details == '') {
            this.setState({ errorFieldDetails: 'Please enter your Details' });
            error = true;
            // return;
        }
        if (this.state.Amount == '') {
            this.setState({ errorFieldAmount: 'Please enter your Amount' });
            error = true;
            // return;
        }
        if (this.state.date == '') {
            Toast.show('Please enter your Date');
            error = true;
            // return;
        }
        if (this.state.value == '') {
            Toast.show('Please select Category');
            error = true;
            // return;
        }
        if (error) {
            return;
        }

        this.setState({ loading: true });

        fetch(`https://accounts.matz.group/api/credit.php`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                UserId: this.state.userID,
                name: this.state.Name,
                desp: this.state.Details,
                amount: this.state.Amount,
                cat: this.state.value,
                date: this.state.date,


            })
        }).then((response) => response.text())
            .then((responseJson) => {

                responseJson = JSON.parse(responseJson);
                if (responseJson.data == 'Successfully saved') {
                    // console.log(responseJson.toString());
                    // responseJson = JSON.parse(responseJson);
                    // this.setState({ data: responseJson.data }).then(() => { 

                    this.props.navigation.navigate("Home", { userID: this.state.userID });
                    //   this.requestHistoryData();
                    this.setState({ loading: false });


                    //  }).catch((err) => { })
                } else {
                    Alert.alert("RESPONSE", responseJson.data);
                }
            }).catch((error) => {
                Alert.alert(error.toString());
            });


    }


    getPickerValue() {

        var that = this;
        this.setState({ loading: true });
        var data_temp = [];
        var data_id_temp = [];

        fetch(`https://accounts.matz.group/api/getCategoryData.php`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userid: this.state.userID
            })
        }).then((response) => response.text())
            .then((responseJson) => {

                if (responseJson != null) {

                    responseJson = JSON.parse(responseJson);
                    // responseJson.forE

                    for (var k in responseJson) {
                        // console.log(k, result[k]);
                        data_temp.push(responseJson[k].CName);
                        data_id_temp.push(responseJson[k].CategoryID);
                    }


                    this.setState({ data: data_temp }, () => {
                        if (that.state.data.length == 0) {
                            that.setState({ category: 'No Category Found' })
                            that.setState({ isModalVisible: true })
                            console.log("Data", that.state.data.length)
                            console.log("If Condition")
                        }
                    })

                    this.setState({ data_id: data_id_temp })
                    this.setState({ loading: false });
                    console.log("Data Temp", this.state.data.length);
                }
                else {
                    Alert.alert("RESPONSE", responseJson);
                }
            }).catch((error) => {
                Alert.alert(error.toString());
                console.log(error.toString());
            });

        // console.log("Data", this.state.data)

        // if(this.state.data.length == 0){
        this.setState({ category: 'Select Category' })
        console.log("Data", this.state.data.length)
        console.log("If Condition")
        // }
        // else{
        //     this.setState({ category:'No Category Found' })
        //     console.log("Else Condition")
        // }


    }

    toggleModal = () => {


        AsyncStorage.setItem(LOGIN_CHECK, 'true').then(() => {
            this.props.navigation.navigate("Profile");
            this.setState({ loading: false })
        }).catch((err) => { console.log(err) });


        //  this.props.navigation.navigate("Categories");
        this.setState({ isModalVisible: false });
    };



    render() {
        let { Name } = this.state;
        let serviceItems = this.state.data.map((s, i) => {
            return <Picker.Item key={i} value={this.state.data_id[i]} label={s} />
        });
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
                <LinearGradient start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 0.0 }} colors={['#0d5e50', '#166D3B', '#000']} style={{ flex: 1 }}>
                    <Container ContainerStyle={{
                        flex: 1, backgroundColor: '#FFFFFF',
                    }}>

                        <Container ContainerStyle={{
                            backgroundColor: '#0d5e50', height: 40, alignItems: 'center', justifyContent: 'center'
                        }}>
                        </Container>

                        <Container ContainerStyle={{ flexDirection: 'row', justifyContent: 'center' }}>
                            <Image
                                style={{ width: '100%', height: 50 }}
                                source={AppLogo3}
                            />

                        </Container>

                        <SafeViewArea style={{ flex: 1 }}>
                            <Scrollview style={{ flex: 1 }} >

                                <Container ContainerStyle={styles.formContainer, { alignItems: 'center', justifyContent: 'center', width: '90%' }}>

                                    <Container ContainerStyle={styles.formContainer, { alignItems: 'center', justifyContent: 'center', width: '90%' }}>

                                        <Text style={{ marginTop: 20, alignSelf: 'flex-start', marginLeft: 20, color: '#000000' }}>
                                            Username:
                                    </Text>

                                        <TextField
                                            tintColor={'#000'}
                                            lineWidth={1}
                                            activeLineWidth={1}
                                            disabledLineWidth={1}
                                            labelFontSize={0}
                                            fontSize={20}
                                            textColor={'#000'}
                                            label={"Name Of Person"}
                                            error={this.state.errorFieldName}
                                            containerStyle={style.myContainerStyle}
                                            inputContainerStyle={style.myInputContainerStyle}
                                            labelTextStyle={style.myLabelTextStyle}
                                            onChangeText={(event) => {
                                                this.setState({ Name: event })
                                            }}
                                            ref={this.fieldNameRef}
                                        />


                                    </Container>

                                    <Container ContainerStyle={styles.formContainer, { alignItems: 'center', justifyContent: 'center', width: '90%' }}>

                                        <Text style={{ marginTop: 20, alignSelf: 'flex-start', marginLeft: 20, color: '#000000' }}>
                                            Email:
                                   </Text>

                                        <TextField
                                            tintColor={'#000'}
                                            lineWidth={1}
                                            activeLineWidth={1}
                                            disabledLineWidth={1}
                                            labelFontSize={0}
                                            fontSize={20}
                                            textColor={'#000'}
                                            label={"Enter Email"}
                                            error={this.state.errorFieldDetails}
                                            containerStyle={style.myContainerStyle}
                                            inputContainerStyle={style.myInputContainerStyle}
                                            labelTextStyle={style.myLabelTextStyle}
                                            onChangeText={(event) => {
                                                this.setState({ Details: event })
                                            }}
                                            ref={this.fieldNameRef}
                                        />


                                    </Container>

                                    <Container ContainerStyle={styles.formContainer, { alignItems: 'center', justifyContent: 'center', width: '90%' }}>

                                        <Text style={{ marginTop: 20, alignSelf: 'flex-start', marginLeft: 20, color: '#000000' }}>
                                            Phone No:
                                    </Text>

                                        <TextField
                                            tintColor={'#000'}
                                            lineWidth={1}
                                            activeLineWidth={1}
                                            disabledLineWidth={1}
                                            labelFontSize={0}
                                            fontSize={20}
                                            textColor={'#000'}
                                            label={"Enter Phone Number"}
                                            keyboardType='numeric'
                                            error={this.state.errorFieldAmount}
                                            containerStyle={style.myContainerStyle}
                                            inputContainerStyle={style.myInputContainerStyle}
                                            labelTextStyle={style.myLabelTextStyle}
                                            onChangeText={(event) => {
                                                this.setState({ Amount: event })
                                            }}
                                            ref={this.fieldNameRef}
                                        />


                                    </Container>

                                    <Container ContainerStyle={styles.formContainer, { alignItems: 'center', justifyContent: 'center', width: '90%' }}>

                                        <Text style={{ marginTop: 20, alignSelf: 'flex-start', marginLeft: 20, color: '#000000' }}>
                                         Old Password:
                                         </Text>

                                        <TextField
                                            tintColor={'#000'}
                                            lineWidth={1}
                                            activeLineWidth={1}
                                            disabledLineWidth={1}
                                            labelFontSize={0}
                                            fontSize={20}
                                            textColor={'#000'}
                                            label={"Old Password"}
                                            error={this.state.errorFieldName}
                                            containerStyle={style.myContainerStyle}
                                            inputContainerStyle={style.myInputContainerStyle}
                                            labelTextStyle={style.myLabelTextStyle}
                                            onChangeText={(event) => {
                                                this.setState({ Name: event })
                                            }}
                                            ref={this.fieldNameRef}
                                        />


                                    </Container>

                                    
                                    <Container ContainerStyle={styles.formContainer, { alignItems: 'center', justifyContent: 'center', width: '90%' }}>

                                        <Text style={{ marginTop: 20, alignSelf: 'flex-start', marginLeft: 20, color: '#000000' }}>
                                           New Password:
                                         </Text>

                                        <TextField
                                            tintColor={'#000'}
                                            lineWidth={1}
                                            activeLineWidth={1}
                                            disabledLineWidth={1}
                                            labelFontSize={0}
                                            fontSize={20}
                                            textColor={'#000'}
                                            label={"New Password"}
                                            error={this.state.errorFieldName}
                                            containerStyle={style.myContainerStyle}
                                            inputContainerStyle={style.myInputContainerStyle}
                                            labelTextStyle={style.myLabelTextStyle}
                                            onChangeText={(event) => {
                                                this.setState({ Name: event })
                                            }}
                                            ref={this.fieldNameRef}
                                        />


                                    </Container>

                                        
                                    <Container ContainerStyle={styles.formContainer, { alignItems: 'center', justifyContent: 'center', width: '90%' }}>

                                        <Text style={{ marginTop: 20, alignSelf: 'flex-start', marginLeft: 20, color: '#000000' }}>
                                           Confirm Password:
                                         </Text>

                                        <TextField
                                            tintColor={'#000'}
                                            lineWidth={1}
                                            activeLineWidth={1}
                                            disabledLineWidth={1}
                                            labelFontSize={0}
                                            fontSize={20}
                                            textColor={'#000'}
                                            label={"Confirm Password"}
                                            error={this.state.errorFieldName}
                                            containerStyle={style.myContainerStyle}
                                            inputContainerStyle={style.myInputContainerStyle}
                                            labelTextStyle={style.myLabelTextStyle}
                                            onChangeText={(event) => {
                                                this.setState({ Name: event })
                                            }}
                                            ref={this.fieldNameRef}
                                        />


                                    </Container>


                                </Container>
                                {/* <Button

                                            title="Submit"
                                            color="#707070"
                                            onPress={() => this.InCreditData()}
                                            style = {{marginLeft:'20%'}}
                                            
                                        /> */}
                                <Container ContainerStyle={{ flexDirection: 'row', width: '85%', height: 40, backgroundColor: "#fff", marginBottom: 40, justifyContent: 'center', marginTop: 20 }}>
                                    <TouchableHighlight
                                  //      onPress={() => this.InCreditData()}
                                        style={style.submit}
                                        underlayColor='#fff'>
                                        <Text style={style.submitText}>Submit</Text>
                                    </TouchableHighlight>

                                    {/* <Button
                                    title="Cancel"
                                    color="#707070"
                                    onPress={() => this.props.navigation.navigate("Home")}
                                    styles={{ marginTop: '20%' }}

                                /> */}

                                    <TouchableHighlight
                                      //  onPress={() => this.props.navigation.navigate("Home")}
                                        style={style.submitRight}
                                        underlayColor='#fff'>
                                        <Text style={style.submitText}>Cancel</Text>
                                    </TouchableHighlight>

                                </Container>




                            </Scrollview>




                        </SafeViewArea>

                    </Container>
                </LinearGradient>


            );
        }
    }
}




const style_container = StyleSheet.create({
    container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
    head: { height: 50, backgroundColor: '#f1f8ff' },
    text: { margin: 6 },
    dataWrapper: { marginTop: -1 },
    row: { height: 40, width: '100%' }
});

const styles_table = StyleSheet.create({
    container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
    header: { height: 50, backgroundColor: '#537791' },
    text: { textAlign: 'center', fontWeight: '100' },
    dataWrapper: { marginTop: -1 },
    row: { height: 100, backgroundColor: '#E7E6E1' }
});

const styles_table1 = StyleSheet.create({
    container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
    header: { height: 50, backgroundColor: '#537791' },
    text: { textAlign: 'center', fontWeight: '100' },
    // dataWrapper: {marginTop: -1 },
    row: { height: '100%', backgroundColor: '#E7E6E1' }
});

const style_swipper = StyleSheet.create({
    wrapper: { height: 200 },

    slide1: {
        height: 150,
        width: '70%',
        marginLeft: '10%',
        marginTop: 30,
        marginRight: '10%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#008000',
        borderRadius: 20,
        shadowColor: '#0d5e50',
        elevation: 10,
        alignSelf: 'center'


    },
    slide2: {
        height: 150,
        width: '70%',
        marginLeft: '10%',
        marginTop: 30,
        marginRight: '10%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#008000',
        borderRadius: 20,
        shadowColor: '#0d5e50',
        elevation: 10,
        alignSelf: 'center'
    },
    slide3: {
        height: 150,
        width: '70%',
        marginLeft: '10%',
        marginTop: 30,
        marginRight: '10%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#008000',
        borderRadius: 20,
        shadowColor: '#0d5e50',
        elevation: 10,
        alignSelf: 'center'
    },
    text: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold'
    }
});

const style = StyleSheet.create({

    MainContainer: {

        // Setting up View inside content in Vertically center.
        justifyContent: 'center',
        flex: 1,
        margin: 10

    },

    TextInputStyleClass: {

        // Setting up Hint Align center.
        textAlign: 'center',

        // Setting up TextInput height as 50 pixel.
        height: 50,

        // Set border width.
        borderWidth: 2,

        // Set border Hex Color Code Here.
        borderColor: '#FF5722',

        // Set border Radius.
        borderRadius: 20,

        //Set background color of Text Input.
        backgroundColor: "#FFFFFF"

    },
    input1: {
        fontSize: 20,
        color: '#000',
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        width: '100%',
        height: 70,
        backgroundColor: '#fff',
        paddingLeft: 10,
        paddingRight: 10,
        marginTop: 10,
        marginRight: 20
    },
    input_personal_details: {
        fontSize: 20,
        color: '#000',
        borderWidth: 1,
        borderRadius: 16,
        borderColor: ' rgba(158, 150, 150, .5)',
        width: '90%',
        backgroundColor: '#fff',
        paddingLeft: 20,
        paddingRight: 10,
        marginTop: 10,
        marginRight: 20,
        marginLeft: 20
    },
    input_personal_details1: {
        fontSize: 20,
        color: '#000',
        borderWidth: 1,
        borderRadius: 16,
        borderColor: ' rgba(158, 150, 150, .5)',
        width: '90%',
        height: 100,
        backgroundColor: '#fff',
        paddingLeft: 20,
        paddingRight: 10,
        marginTop: 10,
        marginRight: 20,
        marginLeft: 20
    },
    input: {
        fontSize: 20,
        color: '#000',
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        width: '100%',
        height: 70,
        marginLeft: 20,
        backgroundColor: '#fff',
        paddingLeft: 10,
        paddingRight: 30,
        marginTop: 30,
    },
    loginButtonStyles1: {
        // marginTop: 25,
        // width: '75%',
        // borderRadius: 15,
        // justifyContent: 'center',
        // alignSelf: 'center',
        // alignItems: 'center',
        // backgroundColor: '#0000FF',
        // height: 50,

        marginBottom: 10,
        marginTop: 25,
        marginLeft: 20,
        marginRight: 20,
        borderRadius: 20,
        paddingLeft: 20,
        paddingRight: 40,
        alignSelf: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        flexDirection: 'row',
        height: 40,
        borderColor: '#653dd6',
        borderWidth: 1
    },
    myContainerStyle: {
        width: '100%',
        height: 70,
        marginLeft: 20,
        backgroundColor: '#fff'

    },
    myInputContainerStyle: {
        paddingLeft: 10,
        paddingRight: 20,
    },
    myLabelTextStyle: {
        color: '#767981'
    },
    activityIndicator: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 80
    },
    submit: {
        paddingTop: 10,
        marginRight: '5%',
        paddingBottom: 10,
        backgroundColor: '#008000',
        borderRadius: 20,
        width: '40%',
        alignContent: 'center',
        justifyContent: 'center',
        height: '100%',
        marginLeft: '20%'

    },
    submitCategory: {
        paddingTop: 10,
        marginRight: '5%',
        paddingBottom: 10,
        backgroundColor: '#008000',
        borderRadius: 20,
        width: '50%',
        alignContent: 'center',
        justifyContent: 'center',
        height: '100%',
        marginLeft: '20%'

    },
    submitText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 14

    }, submitRight: {
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: '#FF0000',
        borderRadius: 20,
        width: '35%',
        alignContent: 'center',
        justifyContent: 'center',
        height: '100%'
    }

});