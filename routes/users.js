var express = require('express');
var router = express.Router();
var userModel = require('../db_models/userSchema')

//index
router.get('/',function(req,res){
  userModel.find({})
  .sort({username:1}) //sort와 같은 여러 함수가 있는데 이런 함수가 추가되면 cb함수가 .exec함수에 인자로 들어간다
  .exec(function(err,users){
    if(err) return res.json(err)
    console.log(users)
    res.render('users/index',{users:users})
  })
})

//new
router.get('/new',function(req,res){
  res.render('users/new')
})

//create
router.post('/',function(req,res){
  console.log(req.body)
  userModel.create(req.body,function(err,user){
    if(err) return res.json(err)
    res.redirect('/users')
  })
})

//show
router.get('/:username',function(req,res){
  userModel.findOne({username : req.params.username},function(err,user){
    if(err) return res.json(err)
    res.render('users/show',{user:user})
  })
})

//edit
router.get('/:username/edit',function(req,res){
  userModel.findOne({username : req.params.username},function(err,user){
    if(err) return res.json(err)
    res.render('users/edit',{user:user})
  })
})

//update
router.put('/:username',function(req,res){
  userModel.findOne({username : req.params.username})
  .select('password') //필드값을 불러오지 않을때는 [.select('-name')]
  .exec(function(err,user){
    if(err) return res.json(err)

    user.originalPassword = user.password
    user.password = req.body.newPassword? req.body.newPassword : user.password
    for(var p in req.body){
      user[p] = req.body[p]
    }

    user.save(function(err,user){
      if(err) return res.json(err)
      res.redirect('/users/'+user.username)
    })
  })
})

router.delete('/:username',function(req,res){
  userModel.deleteOne({usernmae : req.params.usernmae},function(err){
    if(err) return res.json(err)
    res.redirect('/users')
  })
})

module.exports = router;
