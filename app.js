const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const path = require('path')
const mongoose = require('mongoose')
const passport = require('passport')
const session = require('express-session')
const cookieParser = require('cookie-parser')

//Load models
require('./models/User')
require('./models/Story')

//Passport config
require('./config/passport')(passport)


//Load routes
const auth = require('./routes/auth')
const index = require('./routes/index')
const stories = require('./routes/stories')

//Load Keys
const keys = require('./config/keys')

//handlebars helpers
const { truncate, stripTags, formatDate, select, editIcon} = require('./helpers/hbs')

//Map Global Promises
mongoose.Promise = global.Promise

//Mongoose Connect
mongoose.connect(keys.mongoURI, {useNewUrlParser: true})
    .then(() => console.log('Mongo connected'))
    .catch(err => console.log(err))

const app = express()

//Body Parser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// Method override middleware
app.use(methodOverride('_method'))

//Handlebars Middleware
app.engine('handlebars', exphbs({
    helpers: {truncate, stripTags, formatDate, select, editIcon},
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

//Set Global Vars
app.use((req, res, next) => {
    res.locals.user = req.user || null
    next()
})

//Set static folder
app.use(express.static(path.join(__dirname, 'public')))

//Use routes
app.use('/', index)
app.use('/auth', auth)
app.use('/stories', stories)




const port = process.env.PORT || 4000
app.listen(port, () => {
    console.log('server started on port ', port)
})