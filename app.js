const express = require('express');
const swagger = require('swagger-node-express');
const bodyParser = require('body-parser');
const {mongoose} = require('./db/mongoose');
const cors = require('cors');
var UserController = require('./controller/UserController');
var AuthController = require('./controller/AuthController');
var RoundController = require('./controller/RoundController');
var QuestionsController = require('./controller/QuestionsController');
var AnswersController = require('./controller/AnswersController');


var app = express();
app.use(cors());
swagger.setAppHandler(app);

const port = process.env.port || 3000;
app.use(bodyParser.json());

app.use('/users',UserController);
app.use('/api/auth',AuthController);
app.use('/rounds',RoundController);
app.use('/questions',QuestionsController);
app.use('/answers',AnswersController);


swagger.configure("http://petstore.swagger.wordnik.com", "0.1");

app.listen(port, ()=>{
    console.log(`listening at ${port}`);
});