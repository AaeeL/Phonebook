pragma solidity ^0.4.23;

contract PhoneBook {

    string name;
    Contact[] contacts;

    constructor(string _name) public {
        name = _name;
    }

    function addContact(string fName, string lName, string number) public {
        Contact c = new Contact(fName, lName, number);
        contacts.push(c);
    }

    function getContacts() public view returns(Contact[]) {
        return contacts;
    }

    function getName() public view returns(string) {
        return name;
    }
}

contract Contact {
    string fName;
    string lName;
    string number;

    constructor(string _fName, string _lName, string _number) public {
        fName = _fName;
        lName = _lName;
        number = _number;
    }

    function getFName () public view returns(string) {
        return fName;
    }
    function getLName () public view returns(string) {
        return lName;
    }
    function getNumber () public view returns(string) {
        return number;
    }

}