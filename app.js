const {getHello}=require('./router-controller')

const express = require('express')
const bodyParser = require('body-parser');
const port = 8080

const app = express()

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

app.get('/hello', getHello)


app.listen(port, () => {
    console.log(`server in listening on port ${port}`)
})