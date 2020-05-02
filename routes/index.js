var express = require('express');
var router = express.Router();
var methodOverride = require('method-override')
var userModel = require('../db_models/userSchema')
var testModel = require('../db_models/testSchema')

router.get('/virtualtest',function(req,res){
  res.render('test/test2')
})
router.post('/virtualtest2',function(req,res){
  testModel.create(req.body,function(err,result){
    if(err) return res.json(err)
    res.redirect('/virtualtest')
  })
})

router.get('/query',function(req,res){
  res.render('test/test')
})
/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/contacts')
});

router.get('/contacts',function(req,res){
  userModel.find({},function(err,contacts){ //function(에러,검색결과)
    if(err) return res.json(err)
    console.log('contact >> ',contacts)
    res.render('contacts/index',{contacts:contacts})
  })
})

router.get('/contacts/new',function(req,res){
  res.render('contacts/new')
})

router.post('/contacts',function(req,res){
  console.log('post_contacts >> ',req.body)
  userModel.create(req.body,function(err,contact){
    if(err) return res.json(err)
    res.redirect('/contacts')
  })
})

router.get('/contacts/:id',function(req,res){
  console.log('get_contacts/:id')
  console.log('req.params.id >> ',req.params.id)
  userModel.findOne({'_id':req.params.id},function(err,contact){
    if(err) return res.json(err)
    console.log('contact_result >> ',contact)
    res.render('contacts/show',{contact:contact})
  })
})

router.get('/contacts/:id/edit',function(req,res){
  userModel.findOne({'_id':req.params.id},function(err,contact){
    if(err) return res.json(err)
    res.render('contacts/edit',{contact:contact})
  })
})

router.put('/contacts/:id',function(req,res){
  userModel.findOneAndUpdate({'_id':req.params._id},req.body,function(err,contact){ //첫번째 parameter:찾을 조건, 두번째 parameter:update할 정보로 입력 data
    if(err) return res.json(err)
    res.redirect('/contacts/'+req.params.id)
  })
})

router.delete('/contacts/:id',function(req,res){
  userModel.deleteOne({_id:req.params.id},function(err){
    if(err) return res.json(err)
    res.redirect('/contacts')
  })
})

module.exports = router;
