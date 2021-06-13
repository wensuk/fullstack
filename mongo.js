// const mongoose = require('mongoose')

// if (process.argv.length < 3) {
//   console.log('Please provide the password as an argument: node mongo.js <password>')
//   process.exit(1)
// }

// const password = process.argv[2]

// const url =
//   `mongodb+srv://wen:${password}@cluster0.khf9n.mongodb.net/phonebook?retryWrites=true&w=majority`

// mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

// const personSchema = new mongoose.Schema({
//   name: String,
//   number: String,
// })

// const Person = mongoose.model('Person', personSchema)

// const name = process.argv[3]
// const num = process.argv[4]

// if (name == null && num == null) {
//     Person
//      .find({})
//      .then(persons => {
//          persons.map(person => {
//             console.log(`${person.name} ${person.number}`)
//         })
//         mongoose.connection.close()
//     })
// }else{
//     const person = new Person({
//     name: name,
//     number: num,
//     })

//     person.save().then(result => {
//     console.log(`added ${name} number ${num} to phonebook`)
//     mongoose.connection.close()
//     })
// }