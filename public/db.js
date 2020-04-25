const mongoose = require('mongoose')

module.exports=function(){
    var db = mongoose.connection
    db.on('error',console.error)
    db.once('open',function(){
        console.log('몽고디비 연결')
    })

    mongoose.connect('mongodb://localhost/mongodb_tutorial'),{
        userNewUrlParser:true,
        useUnifiedTopology:true,
        useCreateIndexs:true,
        useFindAndModify:true
    }
}