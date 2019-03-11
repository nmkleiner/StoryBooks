const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const passport = require('passport')
const session = require('express-session')
const cookieParser = require('cookie-parser')

//Load user model
require('./models/User')

//Passport config
require('./config/passport')(passport)


//Load routes
const auth = require('./routes/auth')
const index = require('./routes/index')

//Load Keys
const keys = require('./config/keys')

//Map Global Promises
mongoose.Promise = global.Promise

//Mongoose Connect
mongoose.connect(keys.mongoURI, {useNewUrlParser: true})
    .then(() => console.log('Mongo connected'))
    .catch(err => console.log(err))

const app = express()


//Handlebars Middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}))
app.set('view engine', 'handlebars')


app.get('/googleb6962b232bd20e12.html', (req,res) => {

    res.sendFile('googleb6962b232bd20e12.html', {
        root: __dirname + '/htmls',
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    })
})


app.use(cookieParser())
app.use(session({
    secret: 'sex',
    resave: false,
    saveUninitialized: false
}))


//Passport middleware
app.use(passport.initialize())
app.use(passport.session())

//Set Globla Vars
app.use((req, res, next) => {
    res.locals.user = req.user || null
    next()
})

//Use routes
app.use('/', index)
app.use('/auth', auth)




const port = process.env.PORT || 4000
app.listen(port, () => {
    console.log('server started on port ', port)
})