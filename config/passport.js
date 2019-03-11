const GoogleStartegy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose')
const keys = require('./keys')

module.exports = (passport) => {
    passport.use(
        new GoogleStartegy({
            clientID: keys.googleClientID,
            clientSecret: keys.googleClientSecret,
            callbackURL: '/auth/google/callback',
            proxy: true
        }, (accessToken, refreshToken, profile, done) => {
            console.log('accessToken,profile',accessToken, profile)
            })
    )
}