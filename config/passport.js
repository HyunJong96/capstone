var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy //1
var userModel = require('../db_models/userSchema')

//2
passport.serializeUser(function(user,done){ //로그인할때 DB에서 user정보를 찾은 것을 session에 저장하는 역할
    done(null,user.id)  //user정보 중 id만 session에 저장한다.
})
passport.deserializeUser(function(id, done){ //clinet의 request가 들어올때마다 user의 정보를 session에서 찾아내 object화 해주는 역할
    userModel.findOne({_id:id},function(err,user){
        done(err,user)
    })
})

//local strategy
passport.use('local-login',
    new LocalStrategy({
        usernameField : 'username',// username 로그인 form의 해당 항목 이름
        passwordField : 'password',// password도 로그인 form의 해당 항목 이름
        passReqToCallback : true
    },
    function(req,username,password,done){// 로그인시 현재 함수가 호출
        userModel.findOne({username:username})
        .select({password:1})
        .exec(function(err,user){
            if(err) return done(null,user)  //done함수의 첫번째 parameter는 항상 error를 담기 위한것으로 null로 비워줘야한다.

            if(user && user.authenticate(password)){//user.method.authenticate에서 form에서 입력한 password와 db에 hash화 된 password를 비교해서 그값이 같고 user의 정보가 있다면 return
                return done(null,user)
            }
            else {
                req.flash('username',username)
                req.flash('errors',{login:'The username or password 이 틀렸습니다.'})
                return done(null, false)
            }
        })
    }
    )    
)

module.exports = passport