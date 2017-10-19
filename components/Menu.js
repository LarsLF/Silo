import React, {Component} from 'react';
import ReactNative from 'react-native';
import {Actions} from 'react-native-router-flux';
import * as firebase from 'firebase';
import StatusBar from './StatusBar';
import ActionButton from './ActionButton';
import ListItem from './ListItem';
import styles from '../styles';
import HomePage from './HomePage';
import About from './About';
import BottomToolbar from 'react-native-bottom-toolbar';
import FAQ from './FAQ';
import GuideToIcons from './GuideToIcons';
import NotificationSettings from './NotificationSettings';
import SendFeedback from './SendFeedback';



const {
  AsyncStorage,
  ListView,
  StyleSheet,
  TextInput,
  Text,
  View,
  KeyboardAvoidingView,
  TouchableHighlight,
  Alert,
  Lars,
} = ReactNative;

//definnere hvad classen hedder og hvad den extender

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      })
    };
    this.itemsRef = this.getRef().child('items');
  }
  async userLogout() {
    try {
      await AsyncStorage.removeItem('id_token');
      Alert.alert('Log Out Successfully!');

    Actions.Authentication();
    } catch (error) {
      console.log('AsyncStorage error: ' + error.message);
    }
  }
  getRef() {
    return firebase.database().ref();
  }
  listenForItems(itemsRef) {
    itemsRef.on('value', (snap) => {

      // get children as an array
      var items = [];
      snap.forEach((child) => {
        items.push({
          title: child.val().title,
          _key: child.key
        });
      });

      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(items)
      });

    });
  }
  componentDidMount() {
    this.listenForItems(this.itemsRef);
  }

  userLogout() {
    firebase.auth().signOut()
    .then(() => {
      AsyncStorage.removeItem('user');
      Alert.alert('Log Out Successfully!');
      Actions.Authentication();
    })
    .catch((error) => {
      console.log('Signout error: ' + error.message);
    });
  }

  render() {
    return (
      <KeyboardAvoidingView style={styles.listContainer} behavior="padding" >
        <StatusBar title="Menu" />
      
        <ActionButton onPress={Actions.About} title="About" />
        <ActionButton onPress={Actions.FAQ} title="FAQ" />
        <ActionButton onPress={Actions.GuideToIcons} title="Guide to Icons" />
        <ActionButton onPress={Actions.NotificationSettings} title="Notification settings" />
        <ActionButton onPress={Actions.SendFeedback} title="Send feedback" />
        
        <TextInput
        style={{flex: 1}}
        />
        <ActionButton onPress={this.userLogout.bind(this)} title="Log Out"/>
        <BottomToolbar>
              <BottomToolbar.Action 
                title="Home"
                onPress={(index, propsOfThisAction) =>
                  Actions.HomePage()}
              />
              <BottomToolbar.Action
                title="Logout"
                onPress={(index, propsOfThisAction) =>
                  Actions.Authentication()}
              />
              <BottomToolbar.Action
                title="Menu"
                onPress={(index, propsOfThisAction) =>
                  console.warn(index + ' ' + JSON.stringify(propsOfThisAction))}
              />
            </BottomToolbar>
      </KeyboardAvoidingView>
    )
  }
  _addItem() {
    this.itemsRef.push({ title: this.state.text });
  }

  _renderItem(item) {
    const onPress = () => {
      Alert.alert(
        'Show: '+item.title+'?',
        null,
        [
          {text: 'Yes', onPress: (text) => this.itemsRef.child(item._key).remove()},
          {text: 'Cancel', onPress: (text) => console.log('Cancelled')}
        ],
        {cancelable: false}
      );
    };

    return (
      <ListItem item={item} onPress={onPress} />
    );
  }
}

//Exporterer til app.js så den kan bruges
module.exports = Menu;
