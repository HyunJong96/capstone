var express = require('express')
var router = express.Router()
var postModel = require('../db_models/postSchema')
var util = require('../public/util')

router.get('/',function(req,res){
    console.log('session check! after login',req.session)
    postModel.find({})
    .populate('author') //relationship이 형성되어 있는 항목의 값을 생성해 준다.post의 author에는 user의 id가 기록되어있다. 이 값을 바탕으로 실제 user의 값을 author에 생성하게 된다.
    .sort('-createdAt') //createdAt을 기준으로 내림차순 정렬
    .exec(function(err,posts){
        if(err) return res.json(err)
        console.log('index_route의 post값 >> ',posts)
        res.render('posts/index',{posts:posts})
    })
})

router.get('/new',util.isLoggedin,function(req,res){
    var post = req.flash('post')[0] || {}
    var errors = req.flash('errors')[0] || {}
    console.log('errors >>>>>> ',errors)
    res.render('posts/new',{post : post, errors : errors})
})

router.post('/',util.isLoggedin,function(req,res){
    console.log('req.user >> ',req.user)
    req.body.author = req.user._id
    console.log('post_create의 req.body >> ',req.body)
    postModel.create(req.body,function(err,post){
        if(err) {
            req.flash('post',req.body)
            req.flash('errors',util.parseError(err))
            return res.redirect('/posts/new')
        }
        res.redirect('/posts')
    })
})

router.get('/:id',function(req,res){
    postModel.findOne({_id:req.params.id})
    .populate('author')
    .exec(function(err,post){
        if(err) return res.json(err)
        res.render('posts/show',{post:post})
    })
})

router.get('/:id/edit',util.isLoggedin,checkPermission,function(req,res){
    var post = req.flash('post')[0]
    var errors = req.flash('errors')[0] || {}
    if(!post){
        postModel.findOne({_id:req.params.id},function(err,post){
            if(err) return res.json(err)
            console.log('hihi')
            console.log(post)
            res.render('posts/edit',{post:post,errors:errors})
        })
    }
    else{
        post._id = req.params.id
        res.render('posts/edit',{post : post, errors : errors})
    }
})

router.put('/:id',util.isLoggedin,checkPermission,function(req,res){
    req.body.updateAt = Date.now()
    postModel.findOneAndUpdate({_id:req.params.id},req.body,{runValidators:true},function(err,post){
        if(err){
            req.flash('post',req.body)
            req.flash('errors',util.parseError(err))
            return res.redirect('/posts/'+req.params.id+'/edit')
        }
        res.redirect('/posts/'+req.params.id)
    })
})

router.delete('/:id',util.isLoggedin,checkPermission,function(req,res){
    postModel.deleteOne({_id:req.params.id},function(err,post){
        if(err) return res.json(err)
        res.redirect('/posts')
    })
})

module.exports=router

function checkPermission(req,res,next){
    postModel.findOne({_id:req.params.id},function(err,post){
        if(err) return res.json(err)
        console.log('checkPermission post >>> ',post)
        if(post.author != req.user.id) return util.noPermission(req,res)//게시물에 기록된 author와 로그인된 user.id를 비교해 다르면  util.noPermission함수를 호출하여 login화면으로 돌려보낸다.
        next()
    })
}