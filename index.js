const express = require('express')
const app = express()
const port = process.env.PORT || 5000;

const toy = require('./data/actionfigure.json');
const membership = require('./data/Membership.json')

// middleware
const cors = require('cors')
app.use(cors())

app.get('/', (req, res) => {
  res.send('marveltoy store API is running')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.get('/toy', (req,res) => {
    res.send(toy);
})

app.get('/toy/:id', (req,res) => {
    const id = req.params.id;
    const selectedToy = toy.find(toyfigure => toyfigure.id === id);
    res.send(selectedToy);
})

app.get('/membership', (req,res) => {
    res.send(membership);
})

app.get('/membership/:id', (req,res) => {
    const id = req.params.id;
    const seletedMembership = membership.find(cardtype => cardtype.id === id);
    res.send(seletedMembership);
})