const mongoose = require('mongoose')

var userSchema = mongoose.Schema({
    name:{
        type : String,
        require : true,
        unique : true
    },
    email : {type : String},
    phone : {type : String}
})

module.exports=mongoose.model('users',userSchema)