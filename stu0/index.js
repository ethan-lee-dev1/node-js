const cors = require('cors')
const express = require('express')
const mySqlProxy = require('./mySqlProxy')

const PORT = 80
const app = express()
const corsOptions = { origin: ['http://localhost:3000'], optionsSuccessStatus: 200 }

// Middleware...
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

//
// GET /message
//

app.get('/message', cors(corsOptions), async (req, res) => { 
    res.send({message: 'Hello World!!!'})
})

//
// GET /person
//

app.get('/person/:id', cors(corsOptions), async (req, res) => { 
    const personId = req.params['id']
    const p = await mySqlProxy.selectPersonById(personId)
    res.send(p)
})

app.listen(PORT, () => {
    console.log(`Express Web API running on port: ${PORT}`)
})