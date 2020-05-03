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
  var user = req.flash('user')[0]  || {}
  var errors = req.flash('errors')[0] || {}
  res.render('users/new',{user:user,errors:errors})
})

//create
router.post('/',function(req,res){
  console.log(req.body)
  userModel.create(req.body,function(err,user){
    if(err) {
      req.flash('user',req.body)
      req.flash('errors',parseError(err))
      return res.redirect('/users/new')
    }
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
  var user = req.flash('user')[0] || {}
  var errors = req.flash('errors')[0] || {}
  console.log(`user : ${user} && errors : ${errors}`)
  if(!user){
    userModel.findOne({username : req.params.username},function(err,user){
      if(err) return res.json(err)
      res.render('users/edit',{username:req.params.username, user:user, errors:errors})
    })
  }
  else{
    res.render('users/edit',{username:req.params.username, user:user, errors:errors})
  }
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
      //console.log(`user${p} : `,user[p])
      //console.log(`req.body${p} : `,req.body[p])
    }
    console.log('user >> ',user)

    user.save(function(err,user){
      if(err) {
        req.flash('user',req.body)
        req.flash('errors',parseError(err))
        console.log('update flash_user >> ',req.body)
        console.log('update flash_errors >> ',parseError(err))
        return res.redirect('/users/'+req.params.username+'/edit')
      }
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

function parseError(errors){
  //console.log('errors! : ',errors.errors)
  var parsed={}
  if(errors.name == 'ValidationError'){
    for(var name in errors.errors){
      //console.log('name >>>>>>>>>>>>>>>>>>>>>>> ',name)
      var ValidationError = errors.errors[name]
      console.log('help !! >> ',ValidationError)
      parsed[name] = {message:ValidationError.message}
    }
  }
  else if(errors.code =='11000' && errors.errmsg.indexOf('username')>0){
    parsed.username = {message:'This username already exists!'}
  }
  else{
    parsed.unhandled = JSON.stringify(errors)
  }
  return parsed
}