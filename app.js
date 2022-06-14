//mongo:
//ozovadia
//synamediaOzEx12

require("dotenv").config();
const { getHello, getDistance, getHealth, getPopularsearch, postDistance } = require('./router-controller')

//connect MongoDB
require('./connectDB')

const express = require('express')

// const bodyParser = require('body-parser');
const port = 8080
const app = express()


app.use(express.json());


// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

//Middlewares


//Routes
app.get('/hello', getHello)
app.get('/distance', getDistance)
app.get('/health', getHealth)
app.get('/getPopularsearch', getPopularsearch)
app.post('/distance', postDistance)


app.listen(port, () => {
    console.log(`server in listening on port ${port}`)
})