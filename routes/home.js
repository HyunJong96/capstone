var express = require('express')
var router = express.Router()

router.get('/',function(req,res){
    console.log('hihi')
    res.render('home/welcom')
})
router.get('/about',function(req,res){
    res.render('home/about')
})

module.exports=router