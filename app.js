const express = require('express');
const bodyParser = require('body-parser');
const {mongoose} = require('./db/mongoose');
var UserController = require('./controller/UserController');
var AuthController = require('./controller/AuthController');

var app = express();
app.use('/users',UserController);
app.use('/api/auth',AuthController);
const port = process.env.port || 3000;
app.use(bodyParser.json());

app.listen(port, ()=>{
    console.log(`listening at ${port}`);
});