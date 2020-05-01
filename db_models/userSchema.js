const mongoose = require('mongoose')

var userSchema = mongoose.Schema({
    username:{
        type : String,
        require : [true,'사용자의 이름이 필요합니다.'],//첫번째 파라미터는 ture,false 두번째는 에러메세지

    },
    password :{
        type : String,
        require : [true,'비밀번호가 필요합니다.'],
        select : false  //db에서 해당 모델을 읽어 올때 해당 항목값을 읽어오지 않는다.
    },
    name:{
        type : String, 
        require : [true, '닉네임이 필요합니다.']
    },
    email : {type : String},
    phone : {type : String},
},{
    toObject : {virtuals : true}
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

userSchema.path('password').validate(function(v){
    var user = this

    //create user
    if(user.isNew){ //해당 모델이 생성되는 경우 true, 아니면 false의 값을 가진다.
        if(!user.passwordConfirmation){ 
            user.invalidate('passwordConfirmation','Password Confirmation은(는) 필수항목입니다')
        }
        if(user.password != user.passwordConfirmation){
            user.invaludate('passwordConfirmation','비밀번호가 일치하지 않습니다')
        }
    }

    //update user
    if(!user.isNew){
        if(!user.currentPassword){
            user.invalidate('currentPassword','Current Password는 필수항목입니다')
        }
        else if(user.currentPassword != user.originalPassword){
            user.invalidate('currentPassword','Current Pssword가 유효하지않습니다.')
        }
        
        if(user.newPassword !== user.passwordConfirmation){
            user.invalidate('passwordConfirmation','새 비밀번호와 비밀번호 확인이 올바르지 않습니다')
        }
    }
})


module.exports=mongoose.model('users',userSchema)