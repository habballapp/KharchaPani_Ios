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
  TextInput,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {StackNavigator} from 'react-navigation';
import {styles} from '../Login/login_styles';
import {Header, Title} from 'native-base';
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
import Accordion from 'react-native-collapsible/Accordion';
import AsyncStorage from '@react-native-community/async-storage';
import {LOGIN_CHECK, USER_ID} from '../../constants/StorageConstans';
import AppLogo4 from '../../../assets/categoriesheader.png';
import AppLogo6 from '../../../assets/deletelist.png';
import {
  TextField,
  FilledTextField,
  OutlinedTextField,
} from 'react-native-material-textfield';

export default class Categories extends Component {
  fieldCategoryRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      activeSections: [],
      data: [],
      cname: '',
      category: 'Category Name',
      error: false,
      correct: true,
      errorFieldCategory: '',
      borderColor: '#000000',
      users: [
        {id: '1', value: 'A', name: '32', desc: '32'},
        {id: '2', value: 'B', name: '125', desc: '125'},
        {id: '3', value: 'C', name: '151', desc: '151'},
        {id: '4', value: 'D', name: '3231', desc: '3231'},
        {id: '5', value: 'E', name: '2362', desc: '2362'},
      ],
      SECTIONS: [
        {
          title: 'First',
          content: 'Lorem ipsum...',
        },
      ],
    };

    if (this.state.userID === undefined) this.getUserIDFromAsync();
    else {
      this.requestHistoryData();
    }
  }

  getUserIDFromAsync = async () => {
    try {
      const value = await AsyncStorage.getItem(USER_ID);
      if (value !== null) {
        this.setState({userID: value});

        this.requestHistoryData();
      }
    } catch (error) {
      Alert.error('User id not found');
      // Error retrieving data
    }
  };

  _renderSectionTitle = (section) => {
    return (
      <View style={styles.content}>{/* <Text>{section.content}</Text> */}</View>
    );
  };

  onFocusFunction = () => {
    // do some stuff on every screen focus

    this.getUserIDFromAsync();
    const isCorrect = this.state.correct;
  };

  // add a focus listener onDidMount
  async componentDidMount() {
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      this.onFocusFunction();
    });
  }

  _renderHeader = (section) => {
    return (
      <View
        style={{
          width: '40%',
          height: 40,
          marginTop: 30,
          marginLeft: 20,
          marginRight: 20,
          backgroundColor: '#0d5e50',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {/* <Button style = {{borderRadius:15,backgroundColor:"#0d5e50",color:"#707070",width:'100%'}}
                title="Add Category"
                 onPress={() => {this._renderContent}}
                 color="#707070"
                 height = {20}
           / > */}
        <Text style={{fontSize: 16, color: '#ffffff'}}>Add Category</Text>
      </View>
    );
  };

  _renderContent = (section) => {
    return (
      <View style={style.content}>
        <View>
          <TextInput
            style={{
              margin: 15,
              height: 40,
              borderWidth: 1,
              borderColor: this.state.borderColor,
              width: '75%',
              marginLeft: 20,
            }}
            underlineColorAndroid="transparent"
            placeholder={this.state.category}
            placeholderTextColor="#000000"
            autoCapitalize="none"
            value={this.state.cname}
            //  onChangeText = {this.handleEmail}
            onChangeText={(event) => {
              this.setState({cname: event});
            }}
          />

          <View
            style={{
              width: '40%',
              marginLeft: 5,
              marginLeft: 20,
              backgroundColor: '#0d5e50',
            }}>
            <Button
              onPress={() => this.addCategory()}
              title="Add"
              text="Add"
              backgroundColor="#000000"
              color="#ffffff"></Button>
          </View>
        </View>
      </View>
    );
  };

  _updateSections = (activeSections) => {
    this.setState({activeSections});
  };

  addCategory() {
    var that = this;
    var error = false;

    if (this.state.cname == '') {
      this.setState({category: 'Please Enter Category'});
      this.setState({borderColor: '#FF0000'});

      error = true;
    }
    if (error) {
      return;
    }
    this.setState({category: 'Category Name'});
    this.setState({correct: true});
    // this.setState({ isModalVisible: false });
    // Alert.alert(readId);
    fetch(`https://accounts.matz.group/api/insertcategory.php`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userid: this.state.userID,
        name: this.state.cname,
      }),
    })
      .then((response) => response.text())
      .then((responseJson) => {
        responseJson = JSON.parse(responseJson);
        if (responseJson.data == 'Successfully saved') {
          // responseJson = JSON.parse(responseJson);
          // this.setState({ data: responseJson.data }).then(() => {

          // this.props.navigation.navigate("Home", { userID: this.state.userID });
          this.requestHistoryData();
          this.setState({activeSections: []});
          this.setState({cname: ''});

          //  }).catch((err) => { })
        } else {
          Alert.alert('RESPONSE', responseJson.data);
        }
      })
      .catch((error) => {
        Alert.alert(error.toString());
      });
  }

  deleteEntry = (readId) => {
    var that = this;

    // this.setState({ isModalVisible: false });
    // Alert.alert(readId);
    fetch(`https://accounts.matz.group/api/deletecategory.php`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        catid: readId,
      }),
    })
      .then((response) => response.text())
      .then((responseJson) => {
        responseJson = JSON.parse(responseJson);
        if (responseJson.data == 'Successfully Deleted') {
          // responseJson = JSON.parse(responseJson);
          // this.setState({ data: responseJson.data }).then(() => {
          Alert.alert('Deleted successfully.');
          // this.props.navigation.navigate("Home", { userID: this.state.userID });
          this.requestHistoryData();
          //  }).catch((err) => { })
        } else {
          Alert.alert('RESPONSE', responseJson.data);
        }
      })
      .catch((error) => {
        Alert.alert(error.toString());
      });
  };

  requestHistoryData() {
    this.setState({loading: true});

    fetch(`https://accounts.matz.group/api/getCategoryData.php`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userid: this.state.userID,
      }),
    })
      .then((response) => response.text())
      .then((responseJson) => {
        if (responseJson != null) {
          responseJson = JSON.parse(responseJson);
          // responseJson.forE
          // var data_temp = [];
          // for(var k in responseJson) {

          //     data_temp.push(responseJson[k].category);
          //  }

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

  renderRow(item) {
    return (
      <View style={{flex: 1, flexDirection: 'row', margin: 1, marginTop: 10}}>
        <View style={{flexDirection: 'row', width: '40%'}}>
          <View style={{width: '47%', marginLeft: 5}}>
            {/* <Button onPress={() => this.deleteEntry(item.CategoryID)}
              title="Delete"
              backgroundColor="#A1329F"
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
              onPress={() => this.deleteEntry(item.CategoryID)}
              underlayColor="#fff">
              <Image style={{width: 90, height: 30}} source={AppLogo6} />
            </TouchableHighlight>
          </View>
        </View>
        <Text
          style={{
            alignSelf: 'center',
            textAlign: 'left',
            justifyContent: 'center',
          }}>
          {item.CName}
        </Text>
      </View>
    );
  }

  render() {
    return (
      <LinearGradient
        start={{x: 0.0, y: 1.0}}
        end={{x: 1.0, y: 0.0}}
        colors={['#0d5e50', '#166D3B', '#000']}
        style={{flex: 1}}>
        <SafeViewArea style={{flex: 1}}>
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

            <Accordion
              sections={this.state.SECTIONS}
              activeSections={this.state.activeSections}
              renderSectionTitle={this._renderSectionTitle}
              renderHeader={this._renderHeader}
              renderContent={this._renderContent}
              onChange={this._updateSections}
            />

            {/* 
        <FlatList
          ItemSeparatorComponent={
            Platform.OS !== 'android' &&
            (({ highlighted }) => (
              <View
                style={[
                  style.separator,
                  highlighted && { marginLeft: 0 }
                ]}
              />
            ))
          }
          data={[{ title: 'Title Text', key: 'item1' }]}
          renderItem={({ item, index, separators }) => (
            <TouchableHighlight
              key={item.key}
              onPress={() => this._onPress(item)}
              onShowUnderlay={separators.highlight}
              onHideUnderlay={separators.unhighlight}>
              <View style={{ backgroundColor: 'white' }}>
                <Text>{item.title}</Text>
              </View>
            </TouchableHighlight>
          )}
        /> */}

            <View
              style={
                (styles.container, {marginBottom: 20, flex: 1, marginLeft: 20})
              }>
              <View
                style={{flexDirection: 'row', marginBottom: 15, marginTop: 20}}>
                <View
                  style={{
                    backgroundColor: '#000000',
                    width: '30%',
                    marginRight: 5,
                  }}>
                  <Text
                    style={
                      (style_flatlist.h2text,
                      {color: '#ffffff', textAlign: 'center'})
                    }>
                    Actions
                  </Text>
                  <View
                    style={{
                      padding: 10,
                      backgroundColor: '#0d5e50',
                      alignItems: 'center',
                    }}>
                    <Image style={{width: 70, height: 50}} source={AppLogo2} />
                  </View>
                </View>
                <View
                  style={{
                    marginLeft: 5,
                    marginRight: 5,
                    backgroundColor: '#000000',
                    width: '20%',
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
                    <Image style={{width: 70, height: 50}} source={AppLogo1} />
                  </View>
                </View>
              </View>
              <FlatList
                data={this.state.data}
                extraData={this.state}
                renderItem={({item}) => this.renderRow(item)}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>

            {/* <View style={styles.container}> */}

            {/* </View> */}
          </Container>
        </SafeViewArea>
      </LinearGradient>
    );
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
  wrapper: {},

  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5',
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#92BBD9',
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
    marginTop: 50,
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
    marginRight: 40,
    marginLeft: 40,
    marginTop: 10,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: '#68a0cf',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
  },
  submitText: {
    color: '#fff',
    textAlign: 'center',
  },
  container: {
    paddingTop: 23,
  },
  input: {
    margin: 15,
    height: 40,
    borderWidth: 1,
    width: '75%',
    marginLeft: 20,
  },
  submitButton: {
    backgroundColor: '#7a42f4',
    padding: 10,
    margin: 15,
    height: 40,
  },
  submitButtonText: {
    color: 'white',
  },
});
