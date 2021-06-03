import React, { useState, useEffect } from 'react'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Filter from './components/Filter'
import personService from './services/persons'
import Notification from './components/Notification'
import ErrorNotification from './components/ErrorNotification'


const App = () => {

  const [ persons, setPersons ] = useState([]) 

  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber] = useState('')
  const [ newFilter, setNewFilter] = useState('')
  const [ errorMessage, setErrorMessage ] = useState('')
  const [ statusMessage, setStatusMessage ] = useState('')

  const hook = () => {
    personService
      .getAll()
      .then(data => {
        setPersons(data) 
        setStatusMessage(null)
        setErrorMessage(null)
      })
      .catch(error => {
        setErrorMessage('Error. Cannot access data')
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000) 
      })
  }
  useEffect(hook, [])


  // Add new contact
  const addPerson = (event) => {
    event.preventDefault()

    const personObject = {
      name: newName,
      number: newNumber
    }

    // Handle Update
    persons.map(person => {
      if (person.name === newName) {
        console.log("found a duplicate ones!")
        const replace = window.confirm(`${newName} is already added to phonebook. Do you want to replace the old contact?`)
        if (replace) {
          personService
            .update(person.id, personObject)
            .then(data => {
              setStatusMessage(`${newName} Succesfully Updated!`)
              setTimeout(() => {
                setStatusMessage(null)
              }, 5000) 
            })
            .catch(error => {
              setErrorMessage(`${newName} has been deleted. Cannot update`)
              setTimeout(() => {
                setErrorMessage(null)
              }, 5000) 
            })
          }else{
            console.log("Not replacing....")
          }
      }
    })

    // Check existance & create new contact
    const checkName = persons.map(person => person.name)
    if (!checkName.includes(newName)) {
      personService
      .create(personObject)
      .then(data => {
        setPersons(persons.concat(data))
        setStatusMessage(`${newName} Succesfully Added!`)
        setTimeout(() => {
          setStatusMessage(null)
        }, 5000) 
        setNewName('')
        setNewNumber('')
      })
      .catch(error => {
        setErrorMessage('Error. Cannot create data')
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000) 
      })
      console.log("Reset!")
    }
  }

  const addName = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const addNumber = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const searchName = (event) => {
    console.log(event.target.value)
    setNewFilter(event.target.value)
  }

  const removeContact = (event) => {
    event.preventDefault()
    const promp = window.confirm("Are you sure you want to delete this contact?")
    if (promp) {
      console.log("Deleting...")
      personService
        .remove(event.target.value)
        .then(data => {
          setStatusMessage("Succesfully Deleted!")
          setTimeout(() => {
            setStatusMessage(null)
          }, 5000) 
        })
        .catch(error => {
          setErrorMessage(`'Error. Cannot delete data'`)
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000) 
        })
    }
  }


  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={statusMessage} />
      <ErrorNotification errorMessage={errorMessage} />
      <h2>Search</h2>
      <Filter value={newFilter} onChange={searchName}/>

      <h2>Add A New</h2>
      <PersonForm addPerson={addPerson} name={{value: newName, onChange: addName }}
        number={{value: newNumber, onChange: addNumber}} />

      <h2>Numbers</h2>
        <Persons filter={newFilter} persons={persons} removeContact={removeContact} />

      <br></br>
      <div>debug: {newName} {newNumber} {newFilter} </div>
    </div>
  )
}

export default App