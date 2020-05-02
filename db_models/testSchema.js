var mongoose = require('mongoose')

var testSchema = mongoose.Schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
    password:{type : String, required:[true,'비밀번호가 필요합니다']},
    createdAt: { type: Date, default: Date.now },
    updateAt: { type: Date }
})



testSchema.path('password').validate(function (v) {
    var user = this
    //create user
    if (user.isNew) { //해당 모델이 생성되는 경우 true, 아니면 false의 값을 가진다.
        if (!user.passwordConfirmation) {
            user.invalidate('passwordConfirmation', 'Password Confirmation은(는) 필수항목입니다')
        }
        if (user.password != user.passwordConfirmation) {
            user.invaludate('passwordConfirmation', '비밀번호가 일치하지 않습니다')
        }
    }

    //update user
    if (!user.isNew) {
        if (!user.currentPassword) {
            user.invalidate('currentPassword', 'Current Password는 필수항목입니다')
        }
        else if (user.currentPassword != user.originalPassword) {
            user.invalidate('currentPassword', 'Current Pssword가 유효하지않습니다.')
        }

        if (user.newPassword !== user.passwordConfirmation) {
            user.invalidate('passwordConfirmation', '새 비밀번호와 비밀번호 확인이 올바르지 않습니다')
        }
    }
})

module.exports = mongoose.model('tests', testSchema)  