var express = require('express')
var router = express.Router()
var passport = require('../config/passport')

router.get('/', function (req, res) {
    console.log('hihi')
    res.render('home/welcom')
})
router.get('/about', function (req, res) {
    res.render('home/about')
})
router.get('/login', function (req, res) {
    var username = req.flash('username')[0] 
    var errors = req.flash('errors')[0] || {}
    console.log(`username : ${username} && errors : ${errors}`)
    res.render('home/login', { username: username, errors: errors })
})

router.post('/login', function (req, res, next) {
    var errors = {}
    var isValid = true

    if (!req.body.username) {
        isValid = false,
            errors.username = 'Username이 필요합니다.'
    }
    if (!req.body.password) {
        isValid = false,
            errors.password = 'Password가 필요합니다.'
    }

    if (isValid) {
        next()
    }
    else {
        req.flash('errors', errors)
        res.redirect('/homepage/login')
    }
},
    passport.authenticate('local-login', {
        successRedirect: '/posts',
        failureRedirect: '/homepage/login'
    }))

router.get('/logout',function(req,res){
    req.session.destroy(function(err){
        req.logout()
        res.redirect('/homepage')
    })
})

module.exports = router