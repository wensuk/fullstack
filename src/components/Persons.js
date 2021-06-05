import React from 'react'

const Persons = ({ filter, persons, removeContact}) => {
    return(
        persons.filter(person => 
            person.name.toLowerCase().includes(filter.toLowerCase())).map(person =>
                <div key={person.id}>
                    {person.name} {person.number}
                    <button value={person.id} onClick={removeContact}>delete</button>
                </div>)
    )

}


export default Persons