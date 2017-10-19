import React, {Component} from 'react';
import ReactNative from 'react-native';
import {Actions} from 'react-native-router-flux';
import * as firebase from 'firebase';
import StatusBar from './StatusBar';
import ActionButton from './ActionButton';
import ListItem from './ListItem';
import styles from '../styles';
import HomePage from './HomePage';
import BottomToolbar from 'react-native-bottom-toolbar'

const {
  AsyncStorage,
  ListView,
  StyleSheet,
  TextInput,
  Text,
  Item,
  View,
  _key,
  KeyboardAvoidingView,
  TouchableHighlight,
  Alert,
  TextInputlars,
} = ReactNative;

//definnere hvad classen hedder og hvad den extender

class Topic extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: false };
     this.fireRef = firebase.storage().ref('items')
    //  this.AnswersRef = firebase.storage().ref('items/'+this.props.item._key+'/answers')
     this.itemsRef = firebase.database().ref().child('items/'+this.props.item._key+'/answers')
    }
    
  getRef() {
    return firebase.database().ref();
  }

  _addAnswer() {
    this.itemsRef.push({ title: this.state.text });
  }

  render() {
    return (
      <KeyboardAvoidingView style={styles.listContainer} behavior="padding" >
        <StatusBar title="Topic - DØK Channel" />

        <TouchableHighlight onPress={this.props.onPress}>
          <View style={styles.li}>
            <Text style={styles.liText}>{this.props.item.title}</Text>
            <Text style={styles.liText}>{this.props.item.answers.title}</Text>
          </View>
        </TouchableHighlight>

        <TextInput
            style={{flex: 1}}
        />

        <TextInput
            style={{height: 40}}
            placeholder="Type your answer here!"
            onChangeText={(text) => this.setState({text})}
        />

          <ActionButton onPress={this._addAnswer.bind(this)} title="Add" />

            <BottomToolbar>
              <BottomToolbar.Action
                title="Home"
                onPress={(index, propsOfThisAction) =>
                  Actions.HomePage()}
              />
              <BottomToolbar.Action
                title="Noti"
                onPress={(index, propsOfThisAction) =>
                  console.warn(index + ' ' + JSON.stringify(propsOfThisAction))}
              />
              <BottomToolbar.Action
              title="Menu"
              onPress={(index, propsOfThisAction) =>
                Actions.Menu()}
              />
            </BottomToolbar>
      </KeyboardAvoidingView>

    )
  }
}

//Exporterer til app.js så den kan bruges
module.exports = Topic;
