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
  ActivityIndicator,
  TouchableHighlight,
  Text,
  Alert,
  Button,
  Picker,
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
import Categories from '../../../assets/Categories.png';
import calendar from '../../../assets/calendar.png';
import LinearGradient from 'react-native-linear-gradient';
import AppLogo3 from '../../../assets/credit.png';
import AppLogo4 from '../../../assets/homeheader.png';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-community/async-storage';
import {LOGIN_CHECK, USER_ID} from '../../constants/StorageConstans';
import AppLogo5 from '../../../assets/editlist.png';
import AppLogo6 from '../../../assets/deletelist.png';
import RNPickerSelect from 'react-native-picker-select';

export default class Home extends Component {
  fieldNameRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      credit: '',
      debit: '',
      total: '',
      year: ['2020', '2019', '2018'],
      yearMain: [],
      monthMain: [],
      month: [
        '01',
        '02',
        '03',
        '04',
        '05',
        '06',
        '07',
        '08',
        '09',
        '10',
        '11',
        '12',
      ],
      monthName: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ],
      selectedYear: '',
      selectedMonth: '',
      data: [],
      data1: [],
      userID: this.props.navigation.getParam('userID'),
      users: [
        {id: '1', value: 'A', name: '32', desc: '32'},
        {id: '2', value: 'B', name: '125', desc: '125'},
        {id: '3', value: 'C', name: '151', desc: '151'},
        {id: '4', value: 'D', name: '3231', desc: '3231'},
        {id: '5', value: 'E', name: '2362', desc: '2362'},
      ],
      isModalVisible: false,
    };

    if (this.state.userID === undefined) this.getUserIDFromAsync();
    else {
      this.dashboardData();
      this.requestHistoryData();
    }

    this.getYearAndMonthData();
  }

  getYearAndMonthData() {
    var i = 0;
    var yearMain_temp = [];
    for (i = 2020; i >= 1980; i--) {
      var jsonObj = {};
      jsonObj.label = i.toString();
      jsonObj.value = i.toString();
      this.state.yearMain.push(jsonObj);
      yearMain_temp.push(jsonObj);
      this.state.year.push('' + i);
    }
    this.setState({yearMain: yearMain_temp});

    var monthMain_temp = [];

    for (i = 0; i < this.state.monthName.length; i++) {
      // console.log(this.state.monthName[i]);
      var jsonObj = {};
      jsonObj.label = this.state.monthName[i];
      jsonObj.value = this.state.month[i];
      monthMain_temp.push(jsonObj);
      this.state.monthMain.push(jsonObj);
    }
    this.setState({monthMain: monthMain_temp});
  }

  getUserIDFromAsync = async () => {
    try {
      const value = await AsyncStorage.getItem(USER_ID);
      if (value !== null) {
        this.setState({userID: value});

        this.dashboardData();
        this.requestHistoryData();
      }
    } catch (error) {
      Alert.error('User id not found');
      // Error retrieving data
    }
  };

  dashboardData() {
    var currentDate = new Date();
    var month = currentDate.getMonth() + 1;
    if (month.toString().length == 1) month = '0' + month.toString();
    currentDate = currentDate.getFullYear() + '-' + month;

    fetch(`https://accounts.matz.group/api/dashboard.php`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: this.state.userID,
        mydate: currentDate,
      }),
    })
      .then((response) => response.text())
      .then((responseJson) => {
        if (responseJson != null) {
          responseJson = JSON.parse(responseJson);
          this.setState({data1: responseJson[0]});
          this.setState({loading: false});
        } else {
          Alert.alert('RESPONSE', responseJson);
        }
      })
      .catch((error) => {
        Alert.alert(error.toString());
      });
  }

  requestHistoryData() {
    var currentDate = new Date();
    var month = currentDate.getMonth() + 1;
    if (month.toString().length == 1) month = '0' + month.toString();
    currentDate = currentDate.getFullYear() + '-' + month;
    console.log(currentDate);
    this.setState({loading: true});

    fetch(`https://accounts.matz.group/api/readmonthly.php`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        UserId: this.state.userID,
        mydate: currentDate,
      }),
    })
      .then((response) => response.text())
      .then((responseJson) => {
        if (responseJson != null) {
          responseJson = JSON.parse(responseJson);
          this.setState({data: responseJson});
          this.setState({loading: false});
        } else {
          Alert.alert('RESPONSE', responseJson);
        }
      })
      .catch((error) => {
        Alert.alert(error.toString());
      });
  }

  getFilteredData() {
    this.setState({loading: true});
    let selectedDate = this.state.selectedYear + '-' + this.state.selectedMonth;

    fetch(`https://accounts.matz.group/api/dashboard.php`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: this.state.userID,
        mydate: selectedDate,
      }),
    })
      .then((response) => response.text())
      .then((responseJson) => {
        if (responseJson != null) {
          responseJson = JSON.parse(responseJson);
          this.setState({data1: responseJson[0]});
          this.setState({loading: false});
        } else {
          Alert.alert('RESPONSE', responseJson);
        }
      })
      .catch((error) => {
        Alert.alert(error.toString());
      });

    fetch(`https://accounts.matz.group/api/readmonthly.php`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        UserId: this.state.userID,
        mydate: selectedDate,
      }),
    })
      .then((response) => response.text())
      .then((responseJson) => {
        if (responseJson != null) {
          responseJson = JSON.parse(responseJson);

          this.setState({isModalVisible: false});
          this.setState({data: responseJson});
          this.setState({loading: false});
          this.setState({isModalVisible: false});
        } else {
          Alert.alert('RESPONSE', responseJson);
        }
      })
      .catch((error) => {
        Alert.alert(error.toString());
      });
  }
  // no need to import anything more

  // define a separate function to get triggered on focus
  onFocusFunction = () => {
    // do some stuff on every screen focus

    this.getUserIDFromAsync();
  };

  // add a focus listener onDidMount
  async componentDidMount() {
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      this.onFocusFunction();
    });
  }

  // and don't forget to remove the listener
  componentWillUnmount() {
    this.focusListener.remove();
  }
  // componentDidMount() {
  //   console.log("in did mount")
  //   if (this.state.userID === undefined)
  //     this.getUserIDFromAsync();
  //   else {
  //     this.dashboardData();
  //     this.requestHistoryData();
  //     console.log("ID:", "this.state.userID");
  //     console.log("ID:", this.state.userID);

  //   }
  //   // console.log("ID:","this.state.userID");
  //   // console.log("ID:",this.state.userID);
  // }

  toggleModal = () => {
    this.setState({isModalVisible: true});
  };

  hideModal = () => {
    this.setState({isModalVisible: false});
  };

  deleteEntry = (readId) => {
    var that = this;
    // this.setState({ isModalVisible: false });
    // Alert.alert(readId);
    fetch(`https://accounts.matz.group/api/delete.php`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ID: readId,
      }),
    })
      .then((response) => response.text())
      .then((responseJson) => {
        responseJson = JSON.parse(responseJson);
        if (responseJson.data == 'successful') {
          // console.log(responseJson.toString());
          // responseJson = JSON.parse(responseJson);
          // this.setState({ data: responseJson.data }).then(() => {
          Alert.alert('Deleted successfully.');
          // this.props.navigation.navigate("Home", { userID: this.state.userID });
          this.requestHistoryData();
          this.dashboardData();
          //  }).catch((err) => { })
        } else {
          Alert.alert('RESPONSE', responseJson.data);
        }
      })
      .catch((error) => {
        Alert.alert(error.toString());
      });
  };

  renderRow(item) {
    return (
      <View style={{flex: 1, flexDirection: 'row', margin: 1, marginTop: 10}}>
        <View style={{flexDirection: 'row', width: 150, marginRight: 5}}>
          <View style={{width: '30%', marginLeft: 25}}>
            {/* <Button onPress={() => { this.props.navigation.navigate("Edit", { userID: this.state.UserId, readId: item.id }) }}
              title="Edit"
              backgroundColor="#FF0000"
              color="#FFA500">
                 <View style={{ padding: 10, backgroundColor: '#0d5e50', alignItems: 'center' }}>
                      <Image
                        style={{ width: 50, height: 50 }}
                        source={calendar}
                      />
                    </View>
              </Button> */}
            <TouchableHighlight
              style={
                (style.submit,
                {
                  backgroundColor: '#FFFFFF',
                  height: 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 10,
                  justifyContent: 'center',
                })
              }
              onPress={() => {
                this.props.navigation.navigate('Edit', {
                  userID: this.state.UserId,
                  readId: item.id,
                });
              }}
              underlayColor="#fff">
              <Image style={{width: 90, height: 30}} source={AppLogo5} />
            </TouchableHighlight>
          </View>
          <View style={{width: '25%', marginLeft: 5}}>
            {/* <Button onPress={() => this.deleteEntry(item.id)}
              title="Delete"
              backgroundColor="#FF0000"
              color="#FF0000"></Button> */}
            <TouchableHighlight
              style={
                (style.submit,
                {
                  backgroundColor: '#FFFFFF',
                  height: 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 10,
                  justifyContent: 'center',
                })
              }
              onPress={() => this.deleteEntry(item.id)}
              underlayColor="#fff">
              <Image style={{width: 90, height: 30}} source={AppLogo6} />
            </TouchableHighlight>
          </View>
        </View>
        <Text
          style={{
            width: 150,
            marginLeft: 5,
            marginRight: 5,
            textAlign: 'left',
          }}>
          {item.name}
        </Text>
        <Text
          style={{
            width: 150,
            marginLeft: 5,
            marginRight: 5,
            textAlign: 'left',
          }}>
          {item.Description}
        </Text>
        <Text
          style={{
            width: 120,
            marginLeft: 5,
            marginRight: 5,
            textAlign: 'left',
          }}>
          {item.date}
        </Text>
        <Text
          style={{
            width: 150,
            marginLeft: 5,
            marginRight: 5,
            textAlign: 'left',
          }}>
          {item.Categoy}
        </Text>
        <Text
          style={{
            width: 100,
            marginLeft: 5,
            marginRight: 5,
            textAlign: 'left',
          }}>
          Rs. {item.Debit}
        </Text>
        <Text
          style={{
            width: 100,
            marginLeft: 5,
            marginRight: 5,
            textAlign: 'left',
          }}>
          Rs. {item.Credit}
        </Text>
      </View>
    );
  }

  render() {
    // let selectedYearFunc = this.state.year.map((s, i) => {
    //   return <Picker.Item key={i} value={s} label={s} />;
    // });
    // let selectedMonthFunc = this.state.monthName.map((s, i) => {
    //   return <Picker.Item key={i} value={this.state.month[i]} label={s} />;
    // });
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
          colors={['#0d5e50', '#166D3B', '#000']}
          style={{flex: 1}}>
          <Container
            ContainerStyle={{
              flex: 1,
              backgroundColor: '#FFFFFF',
            }}>
            <Container
              ContainerStyle={{
                backgroundColor: '#0d5e50',
                height: 40,
                alignItems: 'center',
                justifyContent: 'center',
              }}></Container>

            <Container
              ContainerStyle={{flexDirection: 'row', justifyContent: 'center'}}>
              <Image style={{width: '100%', height: 50}} source={AppLogo4} />
            </Container>

            <Container ContainerStyle={{height: '30%'}}>
              <Swiper
                style={style_swipper.wrapper}
                autoplayTimeout={5}
                autoplay={true}
                activeDotColor={'#0d5e50'}>
                <View style={style_swipper.slide1}>
                  <Text style={style_swipper.text}>
                    Rs {this.state.data1.credit}
                  </Text>
                  <Container
                    ContainerStyle={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                    }}>
                    <Image
                      style={{width: 50, height: 30, marginTop: 25}}
                      source={AppLogo3}
                    />
                    <Text
                      style={{
                        color: '#ffffff',
                        marginTop: 35,
                        fontWeight: 'bold',
                      }}>
                      Credit Amount
                    </Text>
                  </Container>
                </View>
                <View style={style_swipper.slide2}>
                  <Text style={style_swipper.text}>
                    Rs. {this.state.data1.debit}
                  </Text>
                  <Container
                    ContainerStyle={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                    }}>
                    <Image
                      style={{width: 50, height: 30, marginTop: 35}}
                      source={AppLogo3}
                    />
                    <Text
                      style={{
                        color: '#ffffff',
                        marginTop: 35,
                        fontWeight: 'bold',
                      }}>
                      Debit Amount
                    </Text>
                  </Container>
                </View>
                <View style={style_swipper.slide3}>
                  <Text style={style_swipper.text}>
                    Rs {this.state.data1.total}
                  </Text>
                  <Container
                    ContainerStyle={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                    }}>
                    <Image
                      style={{width: 50, height: 30, marginTop: 25}}
                      source={AppLogo3}
                    />
                    <Text
                      style={{
                        color: '#ffffff',
                        marginTop: 35,
                        fontWeight: 'bold',
                      }}>
                      Total Amount
                    </Text>
                  </Container>
                </View>
              </Swiper>
            </Container>

            <View style={{height: 50}}>
              <View
                style={{
                  marginLeft: 15,
                  height: 250,
                  marginRight: '20%',
                  width: '40%',
                }}>
                {/* <Button title="Filter"
                  color="#008000"
                  padding={30}
                  onPress={this.toggleModal} /> */}
                <TouchableHighlight
                  style={
                    (style.submit,
                    {
                      backgroundColor: '#008000',
                      height: 50,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 10,
                    })
                  }
                  onPress={this.toggleModal}
                  underlayColor="#fff">
                  <Text
                    style={{color: '#fff', fontSize: 16, fontWeight: 'bold'}}>
                    Filter
                  </Text>
                </TouchableHighlight>
              </View>
              <Modal
                isVisible={this.state.isModalVisible}
                //onRequestClose={this.closeModal}
                style={{justifyContent: 'flex-end'}}>
                <View
                  style={{
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#fff',
                  }}>
                  <View
                    style={{
                      width: 300,
                      height: 300,
                    }}>
                    {/* <Button
                title = "Filter"
                onPress={this.hideModal}
               /> */}
                    <Container
                      ContainerStyle={{
                        backgroundColor: '#fff',
                        padding: 20,
                        height: 300,
                        borderRadius: 15,
                      }}>
                      <Container
                        ContainerStyle={{
                          backgroundColor: 'white',
                          width: '100%',
                          alignSelf: 'center',
                          marginTop: 10,
                          borderRadius: 5,
                          marginBottom: 10,
                          borderWidth: 1,
                          paddingLeft: 80,
                          paddingRight: 80,
                          justifyContent: 'center',
                          height: 40,
                          borderColor: ' rgba(158, 150, 150, .5)',
                        }}>
                        {/* <Picker
                          selectedValue={this.state.selectedYear}
                          style={{
                            height: 50,
                            width: '100%',
                            borderColor: '#653dd6',
                            borderWidth: 1,
                            color: '#767981',
                          }}
                          onValueChange={(itemValue, itemIndex) =>
                            this.setState({selectedYear: itemValue})
                          }>
                          <Picker.Item label="Select Year" value="" disabled />
                          {selectedYearFunc}
                        </Picker> */}

                        <RNPickerSelect
                          style={{
                            padding: 10,
                            alignSelf: 'center',
                            fontSize: 20,
                          }}
                          onValueChange={(value) =>
                            this.setState({selectedYear: value})
                          }
                          value={this.state.selectedYear}
                          items={this.state.yearMain}
                        />
                      </Container>
                      <Container
                        ContainerStyle={{
                          backgroundColor: 'white',
                          width: '100%',
                          alignSelf: 'center',
                          marginTop: 10,
                          borderRadius: 5,
                          marginBottom: 10,
                          borderWidth: 1,
                          paddingLeft: 50,
                          paddingRight: 50,
                          justifyContent: 'center',
                          height: 40,
                          paddingLeft: 80,
                          paddingRight: 80,
                          borderColor: ' rgba(158, 150, 150, .5)',
                        }}>
                        {/* <Picker
                          selectedValue={this.state.selectedMonth}
                          style={{
                            height: 50,
                            width: '100%',
                            borderColor: '#653dd6',
                            borderWidth: 1,
                            color: '#767981',
                          }}
                          onValueChange={(itemValue, itemIndex) =>
                            this.setState({selectedMonth: itemValue})
                          }>
                          <Picker.Item label="Select Month" value="" disabled />
                          {selectedMonthFunc}
                        </Picker> */}
                        <RNPickerSelect
                          style={{
                            padding: 10,
                            alignSelf: 'center',
                            fontSize: 20,
                          }}
                          onValueChange={(value) =>
                            this.setState({selectedMonth: value})
                          }
                          value={this.state.selectedMonth}
                          items={this.state.monthMain}
                        />
                      </Container>
                      <Container containerStyle={{flexDirection: 'row'}}>
                        <View
                          style={{
                            width: '30%',
                            marginRight: '30%',
                            marginLeft: '18%',
                            marginTop: 40,
                          }}>
                          <Button
                            title="Submit"
                            color="#707070"
                            onPress={() => {
                              this.hideModal;
                              this.getFilteredData();
                            }}
                          />
                        </View>

                        <View
                          style={{
                            width: '30%',
                            marginRight: '5%',
                            marginLeft: '50%',
                            marginTop: -37,
                          }}>
                          <Button
                            title="Cancel"
                            color="#707070"
                            onPress={this.hideModal}
                          />
                        </View>
                      </Container>
                    </Container>
                  </View>
                </View>
              </Modal>
            </View>
            <ScrollView
              horizontal={true}
              // showsHorizontalScrollIndicator={false}
              contentContainerStyle={{flexGrow: 1}}>
              <View
                style={
                  (styles.container,
                  {flex: 1, marginBottom: 20, marginTop: 10, marginLeft: 10})
                }>
                <View style={{flexDirection: 'row', marginBottom: 5}}>
                  <View
                    style={{
                      backgroundColor: '#000000',
                      width: 150,
                      marginRight: 5,
                    }}>
                    <Text
                      style={
                        (style_flatlist.h2text,
                        {color: '#ffffff', textAlign: 'center'})
                      }>
                      {'Actions'}
                    </Text>
                    <View
                      style={{
                        padding: 10,
                        backgroundColor: '#0d5e50',
                        alignItems: 'center',
                      }}>
                      <Image
                        style={{width: 70, height: 50}}
                        source={AppLogo2}
                      />
                    </View>
                  </View>
                  <View
                    style={{
                      marginLeft: 5,
                      marginRight: 5,
                      backgroundColor: '#000000',
                      width: 150,
                    }}>
                    <Text
                      style={
                        (style_flatlist.h2text,
                        {color: '#ffffff', textAlign: 'center'})
                      }>
                      Name
                    </Text>
                    <View
                      style={{
                        padding: 10,
                        backgroundColor: '#0d5e50',
                        alignItems: 'center',
                      }}>
                      <Image
                        style={{width: 70, height: 50}}
                        source={AppLogo1}
                      />
                    </View>
                  </View>
                  <View
                    style={{
                      marginLeft: 5,
                      marginRight: 5,
                      backgroundColor: '#000000',
                      width: 150,
                    }}>
                    <Text
                      style={
                        (style_flatlist.h2text,
                        {color: '#ffffff', textAlign: 'center'})
                      }>
                      Description
                    </Text>
                    <View
                      style={{
                        padding: 10,
                        backgroundColor: '#0d5e50',
                        alignItems: 'center',
                      }}>
                      <Image style={{width: 70, height: 50}} source={AppLogo} />
                    </View>
                  </View>
                  <View
                    style={{
                      marginLeft: 5,
                      marginRight: 5,
                      backgroundColor: '#000000',
                      width: 120,
                    }}>
                    <Text
                      style={
                        (style_flatlist.h2text,
                        {color: '#ffffff', textAlign: 'center'})
                      }>
                      Date
                    </Text>
                    <View
                      style={{
                        padding: 10,
                        backgroundColor: '#0d5e50',
                        alignItems: 'center',
                      }}>
                      <Image
                        style={{width: 50, height: 50}}
                        source={calendar}
                      />
                    </View>
                  </View>
                  <View
                    style={{
                      marginLeft: 5,
                      marginRight: 5,
                      backgroundColor: '#000000',
                      width: 150,
                    }}>
                    <Text
                      style={
                        (style_flatlist.h2text,
                        {color: '#ffffff', textAlign: 'center'})
                      }>
                      Category
                    </Text>
                    <View
                      style={{
                        padding: 10,
                        backgroundColor: '#0d5e50',
                        alignItems: 'center',
                      }}>
                      <Image
                        style={{width: 50, height: 50}}
                        source={Categories}
                      />
                    </View>
                  </View>
                  <View
                    style={{
                      marginLeft: 5,
                      marginRight: 5,
                      backgroundColor: '#000000',
                      width: 100,
                    }}>
                    <Text
                      style={
                        (style_flatlist.h2text,
                        {color: '#ffffff', textAlign: 'center'})
                      }>
                      Debit
                    </Text>
                    <View
                      style={{
                        padding: 10,
                        backgroundColor: '#0d5e50',
                        alignItems: 'center',
                      }}>
                      <Image
                        style={{width: 70, height: 50}}
                        source={AppLogo3}
                      />
                    </View>
                  </View>
                  <View
                    style={{
                      marginLeft: 5,
                      marginRight: 5,
                      backgroundColor: '#000000',
                      width: 100,
                    }}>
                    <Text
                      style={
                        (style_flatlist.h2text,
                        {color: '#ffffff', textAlign: 'center'})
                      }>
                      Credit
                    </Text>
                    <View
                      style={{
                        padding: 10,
                        backgroundColor: '#0d5e50',
                        alignItems: 'center',
                      }}>
                      <Image
                        style={{width: 70, height: 50}}
                        source={AppLogo3}
                      />
                    </View>
                  </View>
                </View>
                <Container ContainerStyle={{flex: 1}}>
                  <FlatList
                    data={this.state.data}
                    extraData={this.state}
                    renderItem={({item}) => this.renderRow(item)}
                    keyExtractor={(item, index) => index.toString()}
                  />
                </Container>
              </View>
            </ScrollView>

            {/* <View style={styles.container}> */}

            {/* </View> */}
            <Container
              ContainerStyle={{
                flexDirection: 'row',
                width: '85%',
                height: 40,
                backgroundColor: '#fff',
                marginBottom: 20,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {/* <View style={{ width: '20%', marginLeft: 20, height: 40, backgroundColor: "#707070" }}> */}
              <TouchableHighlight
                style={style.submit}
                onPress={() => this.props.navigation.navigate('InCredit')}
                underlayColor="#fff">
                <Text style={style.submitText}>In Credit</Text>
              </TouchableHighlight>
              {/* </View> */}
              {/* <View style={{ width: '20%', marginLeft: '50%', height: 40, backgroundColor: "#707070" }}> */}
              <TouchableHighlight
                onPress={() => this.props.navigation.navigate('OutDebit')}
                style={style.submitRight}
                underlayColor="#fff">
                <Text style={style.submitText}>Out Debit</Text>
              </TouchableHighlight>
              {/* </View> */}
            </Container>
          </Container>
        </LinearGradient>
      );
    }
  }
}

const style_container = StyleSheet.create({
  container: {flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff'},
  head: {height: 50, backgroundColor: '#f1f8ff'},
  text: {margin: 6},
  dataWrapper: {marginTop: -1},
  row: {height: 40, width: '100%'},
});

const styles_table = StyleSheet.create({
  container: {flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff'},
  header: {height: 50, backgroundColor: '#537791'},
  text: {textAlign: 'center', fontWeight: '100'},
  dataWrapper: {marginTop: -1},
  row: {height: 100, backgroundColor: '#E7E6E1'},
});

const styles_table1 = StyleSheet.create({
  container: {flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff'},
  header: {height: 50, backgroundColor: '#537791'},
  text: {textAlign: 'center', fontWeight: '100'},
  // dataWrapper: {marginTop: -1 },
  row: {height: '100%', backgroundColor: '#E7E6E1'},
});

const style_swipper = StyleSheet.create({
  wrapper: {height: 150},

  slide1: {
    height: 120,
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
    alignSelf: 'center',
  },
  slide2: {
    height: 120,
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
    alignSelf: 'center',
  },
  slide3: {
    height: 120,
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
    alignSelf: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
});

const style_flatlist = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  h2text: {
    marginTop: 10,
    fontFamily: 'Helvetica',
    fontSize: 18,
    fontWeight: 'bold',
  },
  flatview: {
    justifyContent: 'center',
    paddingTop: 30,
    borderRadius: 2,
  },
  name: {
    fontFamily: 'Verdana',
    fontSize: 18,
  },
  email: {
    color: 'red',
  },
});
const style = StyleSheet.create({
  row: {
    flex: 1,
    justifyContent: 'space-around',
  },
  appLogo: {
    height: 50,
    width: '2%',
  },
  stretch: {
    width: 50,
    height: 50,
    resizeMode: 'stretch',
  },

  submit: {
    marginTop: 10,
    paddingTop: 10,
    marginRight: '20%',
    paddingBottom: 10,
    backgroundColor: '#5ac683',
    borderRadius: 10,
    width: '35%',
    alignContent: 'center',
    justifyContent: 'center',
    height: '100%',
    marginLeft: '20%',
  },
  submitRight: {
    marginLeft: '15%',
    marginTop: 10,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#5ac683',
    borderRadius: 10,
    width: '35%',
    alignContent: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  submitText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
  },
  inputModal: {
    borderRadius: 10,
    marginBottom: 15,
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#000',
    fontSize: 18,
    color: '#000',
    width: '100%',
    paddingLeft: 10,
    paddingRight: 10,
    height: 60,
  },
  ModalButton: {
    marginTop: 15,
    width: '30%',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EA2626',
    height: 40,
    marginRight: 10,
    marginBottom: 180,
  },
  ModalButtonText: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 18,
  },
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 80,
  },
});
