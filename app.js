require("dotenv").config();
const { getHello, getDistance, getHealth, getPopularsearch, postDistance } = require('./router-controller')

const express = require('express'),
    connectDB = require('./connectDB')


const app = express()
const port = 8080

//connect to DB
connectDB();

//Initializing MiddleWare
app.use(express.json());

//Routes
app.get('/hello', getHello)
app.get('/distance', getDistance)
app.get('/health', getHealth)
app.get('/getPopularsearch', getPopularsearch)
app.post('/distance', postDistance)


app.listen(port, () => {
    console.log(`server in listening on port ${port}`)
})