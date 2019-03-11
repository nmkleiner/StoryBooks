const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')


//Passport config
require('./config/passport')(passport)


//Load routes
const auth = require('./routes/auth')

const app = express()

const port = process.env.PORT || 4000


app.get('/', (req,res) => {
    res.send('it works')
})


//Use routes
app.use('/auth', auth)

app.listen(port, () => {
    console.log('server started on port ', port)
})