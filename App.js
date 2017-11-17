import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Modal,
  TouchableHighlight,
  Image,
  AsyncStorage,
} from 'react-native'
import { Constants } from 'expo'
import DatePicker from 'react-native-datepicker'
import {
  Text,
  Header,
  FormLabel,
  FormInput,
  Card,
  Icon,
  Button,
} from 'react-native-elements'

import Storage from 'react-native-storage'
import moment from 'moment'
import '@expo/vector-icons'

const storage = new Storage({
  size: 1000,
  storageBackend: AsyncStorage,
  defaultExpires: null,
  enableCache: true,
})

export default class App extends Component {
  state = {
    payables: 10,
    balance: 100,
    nextPayDay: moment().add(30, 'days'),
    modalVisible: false,
    allowance: 0,
    daysToNextPayDay: 30,
  }
  componentDidMount() {
    storage
      .load({
        key: 'state',
      })
      .then(state => {
        if (state) this.setState(state)
      })
      .catch(err => {
        console.warn(err)
      })
    setInterval(() => {
      this.calculateAllowance()
      this.calculateDaysToNextPayDay()
    }, 1000)
  }
  persistStateToStorage = () => {
    setTimeout(
      () =>
        storage.save({
          key: 'state',
          data: this.state,
          expires: null,
        }),
      100,
    )
  }

  calculateAllowance = () => {
    let allowance = Math.floor(
      (this.state.balance - this.state.payables) /
        moment(this.state.nextPayDay).diff(moment(), 'days', false),
    )
    this.setState({ allowance })
  }
  calculateDaysToNextPayDay = () => {
    this.setState({
      daysToNextPayDay: moment(this.state.nextPayDay).diff(
        moment(),
        'days',
        false,
      ),
    })
  }
  setModalVisible = visible => {
    this.setState({ modalVisible: visible })
    this.persistStateToStorage()
  }
  handleBalanceChange = balance => {
    this.setState({ balance })
    this.persistStateToStorage()
  }

  handleNextPayDayChange = nextPayDay => {
    this.setState({ nextPayDay: moment(nextPayDay) })
    this.persistStateToStorage()
  }

  handlePayablesChange = payables => {
    this.setState({ payables })
    this.persistStateToStorage()
  }
  render() {
    return (
      <View style={styles.container}>
        <Header>
          <Icon
            name="help"
            color="#ffffff"
            onPress={() => this.setModalVisible(true)}
          />
          <Text style={{ color: '#ffffff' }}>Bonobo Budget </Text>
          <Text>.</Text>
        </Header>

        <FormLabel>Balance €</FormLabel>
        <FormInput
          onChangeText={this.handleBalanceChange}
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
          onChangeText={this.handlePayablesChange}
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
          date={moment(this.state.nextPayDay).format('YYYY-MM-DD')}
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
            this.persistStateToStorage()
          }}
        />
        <Card containerStyle={styles.results}>
          <Text style={styles.title}>Each day you can spend: </Text>
          <Text style={styles.allowance}>
            {this.state.allowance} €
          </Text>
          <Text style={styles.title}>
            Next pay day is in {this.state.daysToNextPayDay} days
          </Text>
        </Card>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {}}
        >
          <View style={styles.helpContainer}>
            <Button
              onPress={() => this.setModalVisible(false)}
              title="BACK TO MAIN VIEW"
              backgroundColor="#397af8"
              buttonStyle={{ marginLeft: -15, marginBottom: 5 }}
              icon={{ name: 'arrow-back' }}
            />
            <Text h4>About</Text>
            <Text>
              The bonobo is an endangered species. Here are two bonobos! This
              photo is from Wikipedia.
            </Text>

            <Image
              style={{
                width: 150,
                height: 188,
                margin: 10,
                alignSelf: 'center',
              }}
              source={require('./images/bonobo.jpg')}
            />
            <Text h4>How it works</Text>
            <Text>
              Bonobo Budget is a simple budget manager. Find out how much money
              you can spend each day, until your next paycheck arrives.
            </Text>
            <Text>
              1. Enter how much money you got into Balance field. 2. Enter sum
              of all your bills until your next pay day in the Payables field
              and 3. Set your next pay day.
            </Text>
            <Text h4>Credits</Text>
            <Text>
              Logo Icon: https://commons.wikimedia.org/wiki/File:Monkey.svg
            </Text>
          </View>
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
  helpContainer: {
    margin: 10,
    marginTop: 0,
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
