import React, { Component } from 'react'
import { Text, View, StyleSheet, Modal, TouchableHighlight } from 'react-native'
import { Constants } from 'expo'
import DatePicker from 'react-native-datepicker'
import {
  Header,
  FormLabel,
  FormInput,
  Card,
  Icon,
  Button,
} from 'react-native-elements'

import moment from 'moment' // 2.19.1
import '@expo/vector-icons' // 6.1.0
export default class App extends Component {
  state = {
    payables: 0,
    balance: 100,
    nextPayDay: moment().add(30, 'days'),
    modalVisible: false,
  }

  _setModalVisible = visible => {
    this.setState({ modalVisible: visible })
  }
  _handleBalanceChange = balance => {
    this.setState({ balance })
  }

  _handleNextPayDayChange = nextPayDay => {
    this.setState({ nextPayDay: moment(nextPayDay) })
  }

  _handlePayablesChange = payables => {
    this.setState({ payables })
  }
  render() {
    return (
      <View style={styles.container}>
        <Header>
          <Icon
            name="help"
            color="#ffffff"
            onPress={() => this._setModalVisible(true)}
          />
          <Text style={{ color: '#ffffff' }}>Bonobo Budget </Text>
          <Text>.</Text>
        </Header>

        <FormLabel>Balance €</FormLabel>
        <FormInput
          onChangeText={this._handleBalanceChange}
          placeholder="How much money do you have?"
          value={this.state.balance.toString()}
          inputStyle={{
            height: 44,
            padding: 8,
            alignSelf: 'stretch',
            color: 'black',
          }}
        />
        <FormLabel>Payables (sum of all the bills and etc.)</FormLabel>
        <FormInput
          value={this.state.payables.toString()}
          onChangeText={this._handlePayablesChange}
          inputStyle={{
            height: 44,
            padding: 8,
            alignSelf: 'stretch',
            color: 'black',
          }}
        />
        <FormLabel labelStyle={{ marginBottom: 10 }}>Next pay day:</FormLabel>
        <DatePicker
          style={{ width: 200 }}
          date={this.state.nextPayDay.format('YYYY-MM-DD')}
          mode="date"
          placeholder="select date"
          format="YYYY-MM-DD"
          minDate={moment().format('YYYY-MM-DD')}
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          customStyles={{
            dateIcon: {
              position: 'absolute',
              left: 20,
              top: 4,
              marginLeft: 0,
            },
            dateInput: {
              marginLeft: 56,
            },
          }}
          onDateChange={date => {
            this.setState({ nextPayDay: moment(date) })
          }}
        />
        <Card containerStyle={styles.results}>
          <Text style={styles.title}>Each day you can spend: </Text>
          <Text style={styles.allowance}>
            {Math.floor(
              (this.state.balance - this.state.payables) /
                this.state.nextPayDay.diff(moment(), 'days', false),
            )}{' '}
            €
          </Text>
          <Text style={styles.title}>
            Next pay day is in{' '}
            {this.state.nextPayDay.diff(moment(), 'days', false)} days
          </Text>
        </Card>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {}}
        >
          <Text>Help</Text>
          <Button
            onPress={() => this._setModalVisible(false)}
            title="Back"
            backgroundColor="#397af8"
          />
        </Modal>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingTop: Constants.statusBarHeight,
  },
  title: {
    marginLeft: 20,
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left',
    color: '#34495e',
  },
  allowance: {
    marginBottom: 0,
    fontSize: 90,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'green',
    marginLeft: 20,
  },
  results: {
    marginTop: 30,
    alignSelf: 'center',
  },
})
