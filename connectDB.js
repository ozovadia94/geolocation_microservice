const mongoose = require('mongoose')

const connectDB = ()=>{
    const dbURI = process.env.MONGODB

    mongoose.connect(dbURI,{ useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=>{
        console.log('Connected to the DB')
    }).catch((e)=>console.log(e))
}

module.exports=connectDB;