const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(express.static('dist'))
app.use(cors())
app.use(express.json()) // takes request bodies and makes them into Javascript Objects

morgan.token('data', function getData(request) {
    const output = JSON.stringify(request.body)
    if(output !== "{}") {
        return output
    }
})

app.use(morgan(":method :url :status :res[content-length] - :response-time ms :data"))

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })

app.get('/api/persons', (request, response) => {
    console.log(persons)
    response.send(persons)
})

app.get("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (!person) {
        response.status(404).send("<h1>Status code 404: person with id " + id + " not in phonebook<h1>")
    } else {
        response.send(person)
    }
})

app.get("/info", (request, response) => {
    const now = new Date()
    response.send("<p>Phonebook has info for " + persons.length + " people<p>" + "<p>" + now + "<p>")
})

app.delete("/api/persons/:id", (request, response) => {
    console.log("deleting mandem")
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    console.log("current persons: ", persons)
    response.status(204).end()
    
})

app.post("/api/persons", (request, response) => {
    const newPerson = request.body
    if(!newPerson.name || !newPerson.number) {
        response.status(400).send({error: "Missing name or number"})
    }
    else if (persons.some(person => person.name === newPerson.name)) {
        response.status(400).send({error: "Name must be unique"})
    } else {

        newPerson.id = Math.floor(Math.random() * 1000)
        //console.log(newPerson)
        persons = persons.concat(newPerson)
        response.json(newPerson)
    }
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
