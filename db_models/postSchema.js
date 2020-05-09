var mongoose = require('mongoose')

var postSchema = mongoose.Schema({
    title : {type:String, required:[true,'title이 필요합니다.']},
    body:{type:String, required:[true,'body가 필요합니다']},
    author:{type : mongoose.Schema.Types.ObjectId, ref:'users',required:true},
    createdAt:{type:Date, default:Date.now},
    updateAt:{type:Date}
})

module.exports = mongoose.model('posts',postSchema)