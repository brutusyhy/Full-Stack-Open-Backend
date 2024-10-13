const express =  require('express');
const morgan = require('morgan');
const cors = require('cors')
const app = express();

const PORT = 3004
morgan.token("post-content", (request)=>{
    if (request.method == "POST"){
        return JSON.stringify(request.body);
    }
})
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-content'));
app.use(cors())
// const requestLogger = (request, response, next) => {
//     console.log('Method:', request.method)
//     console.log('Path:  ', request.path)
//     console.log('Body:  ', request.body)
//     console.log('---')
//     next()
// }

let data = [
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


function generateRandomId(){
    return Math.floor(Math.random()*1000000)
}

app.get("/api/persons", (request, response) => {
    response.json(data)
})

app.get("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id);
    const person = data.find(person => person.id === id);

    if(person){
        response.json(person);
    } else{
        response.status(404).end();
    }
})

app.delete("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id);
    const oldLength = data.length;
    data = data.filter(person => person.id !== id);
    if(data.length === oldLength){
        response.status(404).end();
    } else {
        response.status(204).end();
    }
})

app.post("/api/persons", (request, response) => {
    const body = request.body;
    if(!body.name){
        response.status(400).json({error: "Name is required"});
        return;
    } else if (!body.number){
        response.status(400).json({error: "Number is required"});
        return;
    }
    const existingPerson = data.find(person => person.name === body.name);
    if(existingPerson){
        response.status(400).json({error: `${existingPerson.name} already exists`});
        return;
    }
    const newPerson = {
        id: generateRandomId(),
        name: body.name,
        number: body.number,
    }
    data = data.concat(newPerson);
    response.json(newPerson);
})

app.get("/info", (request, response) => {
    response.write(`Phonebook has info for ${data.length} people\n`);
    response.write(Date());
    response.end();
})



app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

//app.use(unknownEndpoint)
app.use(express.static('dist'))