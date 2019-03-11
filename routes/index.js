const express = require('express')
const exphbs = require('express-handlebars')

const router = express.Router()
const passport = require('passport')


router.get('/', (req,res) => {
    res.render('index/welcome')
})

router.get('/dashboard', (req,res) => {
    res.send('its working')
})




module.exports = router