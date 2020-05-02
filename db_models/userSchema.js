const mongoose = require('mongoose')
var bcrypt = require('bcryptjs')

var userSchema = mongoose.Schema({
    username:{
        type : String,
        require : [true,'사용자의 이름이 필요합니다.'],//첫번째 파라미터는 ture,false 두번째는 에러메세지
        match : [/^.{4,12}$/,'username은 4-12자를 작성해야합니다.'],
        trim : true,
    },
    password :{
        type : String,
        require : [true,'비밀번호가 필요합니다.'],
        select : false  //db에서 해당 모델을 읽어 올때 해당 항목값을 읽어오지 않는다.
    },
    name:{
        type : String, 
        require : [true, '닉네임이 필요합니다.'],
        match : [/^.{4,12}$/,'닉네임은 4-12자를 작성하해야합니다.']
    },
    email : {
        type : String,
        match : [/^[a-zA-Z0-9]+@[a-zA-Z-0-9.-]+\.[a-zA-Z]{2,}$/,'유효한 email을 작성하세요!']
    },
    phone : {type : String},
});


//virtual함수는 db schema에는 없지만 객체에는 있는 가상의 필드를 만들어 준다.
userSchema.virtual('passwordConfirmation')  //passwordConfirmation 필드를 가상으로 만들어준다.
.set(function(value){ this._passwordConfirmation = value})//값을 입력할 때 함수로 조건을 만든다.
.get(function(){return this._passwordConfirmation})//값을 출력할때 함수로 조건을 만든다.

userSchema.virtual('originalPassword')
.set(function(value){this._originalPassword=value})
.get(function(){return this._originalPassword})

userSchema.virtual('currentPassword')
.set(function(value){this._currentPassword=value})
.get(function(){return this._currentPassword})

userSchema.virtual('newPassword')
.set(function(value){this._newPassword=value})
.get(function(){return this._newPassword})


var passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/
var passwordRegexErrorMessage = '비밀번호는 8자리~16자리와 숫자와 알파벳을 섞어주세요'

userSchema.path('password').validate(function(v){
    var user = this

    //create user
    if(user.isNew){ //해당 모델이 생성되는 경우 true, 아니면 false의 값을 가진다.
        if(!user.passwordConfirmation){ 
            user.invalidate('passwordConfirmation','Password Confirmation은(는) 필수항목입니다')
        }
        if(!passwordRegex.test(user.password)){
            user.invalidate('password',passwordRegexErrorMessage)
        }
        else if(user.password != user.passwordConfirmation){
            user.invalidate('passwordConfirmation','비밀번호가 일치하지 않습니다')
        }
    }

    //update user
    if(!user.isNew){
        if(!user.currentPassword){
            user.invalidate('currentPassword','Current Password는 필수항목입니다')
        }
        else if(!bcrypt.compareSync(user.currentPassword,user.originalPassword)){   //user.currentPassword는 입력받은 text값이고 user.originalPassword는 user의 password hash값이다. hash를 해독해서 text를 비교하는것이 아니라 text값을 hash로 만들고 그 값이 일치하는 지를 확인하는 과정입니다.
            user.invalidate('currentPassword','Current Pssword가 유효하지않습니다.')
        }
        
        if(user.newPassword && !passwordRegex.test(user.newPassword)){
            user.invalidate('newPassword',passwordRegexErrorMessage)
        }
        if(user.newPassword !== user.passwordConfirmation){
            user.invalidate('passwordConfirmation','새 비밀번호와 비밀번호 확인이 올바르지 않습니다')
        }
    }
})

// hash password // 3
userSchema.pre('save', function (next){ //'save'이벤트가 일어나기 전에 먼저 cb함수를 실행시킨다.
    var user = this;
    if(!user.isModified('password')){ // 3-1    isModified함수는 해당 값이 db에 기록된 값과 비교해서 변경된 경우 true, user가 생성됬을 경우는 항상true이며 수정시는 password가 변경됬을 경우만 true, user.password의 변경이 없다면 해당위치에 hash가 저장되어있으므로 다시 hash를 만들지 않는다.
      return next();
    }
    else {
      user.password = bcrypt.hashSync(user.password); //3-2 user를 생성하거나 password가 수정되었으면 bcrypt.hashSync함수로 password를 hash값으로 바꾼다.
      return next();
    }
  });
  
  // model methods // 4
  userSchema.methods.authenticate = function (password) {   //user model의 password hash와 입력받은 password text를 비교하는 method
    var user = this;
    return bcrypt.compareSync(password,user.password);
  };


module.exports=mongoose.model('users',userSchema)