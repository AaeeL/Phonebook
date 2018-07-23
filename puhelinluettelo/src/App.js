/*eslint no-undef:0 */

import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Web3 from 'web3';
import Contract from 'truffle-contract';
import Contact from './Contact.json'
import PhoneBook from './PhoneBook.json'

if(typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider)  
} 

class App extends Component {

  constructor(props) {
    super(props)

    this.state = {
      init: false,
      name: ""
    }
  }

  componentDidMount() {
    this.PhoneBook = new Contract(PhoneBook)
    this.Contact = new Contract(Contact)
    this.PhoneBook.setProvider(web3.currentProvider)
    this.Contact.setProvider(web3.currentProvider)
    web3.eth.getAccounts().then(accounts => {
      this.PhoneBook.web3.eth.defaultAccount = accounts[0]
      this.Contact.web3.eth.defaultAccount = accounts[0]     
    })
  }

  newPhoneBook = async (name) => {
    this.currentBook = await this.PhoneBook.new(name)
    await this.loadPhoneBook()
    this.setState({init:true})
  }
  loadPhoneBook = async() => {
    this.phonebook = {}
    this.phonebook.name = await this.currentBook.getName()
    this.phonebook.addresses = await this.currentBook.getContacts()
    this.phonebook.contacts = []
    let promises = []
    this.phonebook.addresses.forEach(async address => {
      let a = this.loadContact(address)
      promises.push(a)
      this.phonebook.contacts.push(await a)
    })

    await Promise.all(promises)
    
    this.setState({phonebook: this.phonebook});
  }
  loadContact = async(address) => {
    let contract = this.Contact.at(address)
    let contact = {}
    contact.fName = await contract.getFName()
    contact.lName = await contract.getLName()
    contact.number = await contract.getNumber()
    console.log(contact);
    return contact
    
  }

  addContact = async(fName, lName, number) => {
    let lastLength = this.phonebook.addresses.length;
    await this.currentBook.addContact(fName, lName, number)
    await this.loadPhoneBook()
    while (this.phonebook.addresses.length === lastLength) {
      await this.loadPhoneBook();
    }
    
  }
  render() {
    if(!this.state.init) {
      return(
        <AddPhoneBook addBook={this.newPhoneBook}/>
      )
    }
    return (
      <div className="App">
      <h1>{this.phonebook.name}</h1>
      <Contacts phonebook={this.state.phonebook.contacts}/>
      <NewContact addContact={this.addContact}/>
      </div>
    );
  }
}

let Contacts = ({phonebook}) => {
  console.log(phonebook);
  
  return(
    <ul>
      {phonebook.map(contact => <li key={contact.fName}>{contact.lName} {contact.fName} {contact.number}</li>)}
    </ul>
  )
}

class NewContact extends Component {

  constructor(props) {
    super(props)
    this.state = {
      fName: "",
      lName:"",
      number:""
    }
  }

  setFirst = (event) => {
    this.setState({fName:event.target.value})
  }
  setLast = (event) => {
    this.setState({lName:event.target.value})
  }
  setNumber = (event) => {
    this.setState({number:event.target.value})
  }
  submit = (event) => {
    event.preventDefault()
    this.props.addContact(this.state.fName, this.state.lName, this.state.number)
  }

  render() {
    return(
      <form onSubmit={this.submit}>
      Etunimi: <input type="text" onChange={this.setFirst}/>
      Sukunimi: <input type="text" onChange={this.setLast}/>
      Numero: <input type="text" onChange={this.setNumber}/>
      <input type="submit"/>
      </form>
    )
  }
}
class AddPhoneBook extends Component {

  constructor(props) {
    super(props)
    this.state = {
      name: ""
    }
  }

  setName = (event) => {
    this.setState({name:event.target.value})
  }

  submit = (event) => {
    event.preventDefault()
    this.props.addBook(this.state.name)
    
  }

  render() {
    return(
      <form onSubmit={this.submit}>
        Luettelon nimi: <input type="text" onChange={this.setName} value={this.state.name}/>
        <input type="submit" value="Ok"/>
      </form>
    )
  }
}

export default App;
