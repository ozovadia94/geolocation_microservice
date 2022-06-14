const mongoose = require('mongoose')

// const dbURI = `mongodb+srv://${process.env.mongoUser}:${process.env.mongoPassword}@geolocation-microservic.cv9e54d.mongodb.net/MyDB?retryWrites=true&w=majority` 

const connectDB = ()=>{
    const dbURI = process.env.MONGODB

    mongoose.connect(dbURI,{ useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=>{
        console.log('Connected to the DB')
    }).catch((e)=>console.log(e))
}

module.exports=connectDB;
