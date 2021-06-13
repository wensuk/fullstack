require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

const Person = require('./models/person')

app.use(express.static('build'))
app.use(express.json())
app.use(cors())

// Predefined format 
// app.use(morgan('tiny'))

// Cusrom format (Define token.post content )
morgan.token('post', (req, res) => { return JSON.stringify(req.body) })

app.use(morgan(function (tokens, req, res) {
  if (tokens.method(req, res) === 'POST') {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      tokens.post(req, res)
    ].join(' ')
  }
}))


const now = new Date()

app.get('/', (req, res) => {
  res.send('<h1>Hey its working</h1>')
})

app.get('/info', (req, res) => {
  Person
    .find({})
    .then(results => {
      res.send(`<h1>Phonebook has info for ${results.length} people</h1> ${now}`)
    })
})

app.get('/api/persons', (req, res) => {
  Person
    .find({})
    .then(results => {
      res.json(results)
    })
})

app.get('/api/persons/:id', (req, res, next) => {

    //1st Version
    // const id = Number(req.params.id)
    // const person = persons.find(person => person.id === id)
    // console.log("person" + person)

    // if (person) {
    //   res.json(person)
    // }else{
    //   res.status(404).end()
    // }

    //2nd Version
    Person.findById(req.params.id)
      .then(person => {
        if (person) {
          res.json(person)
        }else{
          res.status(400).end()
        }
    })
    .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
    const body = req.body.personObject

    //1st Version
    // const check = persons.find(person => {
    //   console.log(person.name, typeof person.name, body.name, typeof body.name, person.name === body.name)
    //   return person.name === body.name
    // })

    // if (!body.name) {
    //   return res.status(400).json({
    //     error: 'Name Missing'
    //   })
    // }

    // if (!body.number) {
    //   return res.status(400).json({
    //     error: 'Number Missing'
    //   })    
    // }

    // if (persons.find(person => person.name === body.name)) {
    //   return res.status(400).json({
    //     error: "Name must be unique"
    //   })
    // }

    // const rid = Math.floor(Math.random() * 100) + 1
  
    // const person = {
    //   name: body.name,
    //   number: body.number,
    //   id: rid
    // }

    // persons.concat(person)

    // res.json(person)

    //2nd Version
    if (body.name === undefined) {
      return res.status(400).json({
        error: 'Name Missing'
      })
    }

    if (body.number === undefined) {
      return res.status(400).json({
        error: 'Number Missing'
      })
    }


    const person = new Person({
      name: body.name,
      number: body.number
    })

    person.save().then(savedPerson => {
      res.json(savedPerson)
    })
    .catch(error => {
      res.status(400).send(error.message)
    })

    // Person.findOne({ name: body.name }, { runValidators: true, context: 'query' }, (error, result) => {
    //     // if (error.name === 'CastError') {
    //     //   res.status(400).send({ error: 'Malformatted ID'})
    //     // }
    //     // if (error.name === 'ValidationError') {
    //     //   res.status(400).json({ error: error.message })
    //     // }
    //     if (error) [
    //       console.log(error)
    //     ]
    //     if (result) {
    //       Person.findOneAndUpdate( { name: body.name }, { number: body.number }, { new: true })
    //         .then(updatedPerson => {
    //           res.json(updatedPerson)
    //         })
    //         .catch(error => next(error))
    //     }
    //     if (!result) {
    //       person.save().then(savedPerson => {
    //         res.json(savedPerson)
    //       })
    //       .catch(error => next(error))
    //     }
    // })
  
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
      .then(result => {
        res.status(202).end()
      })
      .catch(error => next(error))
    // const id = Number(req.params.id)
    // persons = persons.filter(person => person.id !== id)

    // res.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  // Invalid Id Error 
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } 
  next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)