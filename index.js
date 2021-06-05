const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
app.use(express.static('build'))

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

app.use(express.json())

let persons = 
[
    {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1
    },
    {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": 2
    },
    {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": 3
    },
    {
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": 4
    }
]

const len = persons.length;
const now = new Date();

app.get('/', (req, res) => {
  res.send('<h1>Hey its working</h1>')
})

app.get('/info', (req, res) => {
    res.send(`<h1>Phonebook has info for ${len} people</h1> ${now}`)
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    console.log("person" + person)

    if (person) {
      res.json(person)
    }else{
      res.status(404).end()
    }
})

app.post('/api/persons', (req, res) => {
    const body = req.body

    // const check = persons.find(person => {
    //   console.log(person.name, typeof person.name, body.name, typeof body.name, person.name === body.name)
    //   return person.name === body.name
    // })

    if (!body.name) {
      return res.status(400).json({
        error: 'Name Missing'
      })
    }

    if (!body.number) {
      return res.status(400).json({
        error: 'Number Missing'
      })    
    }

    if (persons.find(person => person.name === body.name)) {
      return res.status(400).json({
        error: "Name must be unique"
      })
    }

    const rid = Math.floor(Math.random() * 100) + 1
  
    const person = {
      name: body.name,
      number: body.number,
      id: rid
    }

    persons.concat(person)

    res.json(person)
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)

    res.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})