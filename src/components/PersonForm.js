import React from 'react'


const PersonForm = ({ addPerson, name, number }) => {
    return (
    <form onSubmit={addPerson}>  
        <div>
          name: <input value={name.value} onChange={name.onChange}/>
        </div>
        <div>
          number: <input value={number.value} onChange={number.onChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
    </form>
    )
}

export default PersonForm