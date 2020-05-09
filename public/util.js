var util={}

util.parseError = function parseError(errors){
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

  util.isLoggedin = function(req,res,next){//사용자의 로그인이 되었는지 판단하고 로그인 되지 않았다면 에러메시지와 함꼐 로그인 페이지로 보내는함수
    if(req.isAuthenticated()){
      next()  //로그인된 상태이면 다음 callback함수를 호출한다.
    }
    else{
      req.flash('errors',{login:'util_Please login first'})
      res.redirect('/homepage/login')
    }
  }

  util.noPermission = function(req,res){//route에 접근권한이 없다고 판단된 경우 에러메시지를 보낸다. isLoggedin과 다르게 접근권한여부를 판단하지 않는다.
    req.flash('errors',{login:"util_You don't have permission"})
    req.logout()
    res.redirect('/homepage/login')
  }

  module.exports=util