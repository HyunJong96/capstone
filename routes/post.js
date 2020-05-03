var express = require('express')
var router = express.Router()
var postModel = require('../db_models/postSchema')

router.get('/',function(req,res){
    console.log('session check! after login',req.session)
    postModel.find({})
    .sort('-createdAt') //createdAt을 기준으로 내림차순 정렬
    .exec(function(err,posts){
        if(err) return res.json(err)
        res.render('posts/index',{posts:posts})
    })
})

router.get('/new',function(req,res){
    res.render('posts/new')
})

router.post('/',function(req,res){
    postModel.create(req.body,function(err,post){
        if(err) res.json(err)
        res.redirect('/posts')
    })
})

router.get('/:id',function(req,res){
    postModel.findOne({_id:req.params.id},function(err,post){
        if(err) return res.json(err)
        res.render('posts/show',{post:post})
    })
})

router.get('/:id/edit',function(req,res){
    postModel.findOne({_id:req.params.id},function(err,post){
        if(err) return res.json(err)
        console.log('hihi')
        console.log(post)
        res.render('posts/edit',{post:post})
    })
})

router.put('/:id',function(req,res){
    postModel.findOneAndUpdate({_id:req.params.id},req.body,function(err,post){
        if(err) return res.json(err)
        res.redirect('/posts/'+req.params.id)
    })
})

router.delete('/:id',function(req,res){
    postModel.deleteOne({_id:req.params.id},function(err,post){
        if(err) return res.json(err)
        res.redirect('/posts')
    })
})

module.exports=router