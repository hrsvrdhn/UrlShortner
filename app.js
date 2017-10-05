const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
var routes = require('./routes/index');
var port = process.env.PORT || 3000;
var app = express();

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://hrsvrdhn:mongo@ds157873.mlab.com:57873/testing');

app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

routes(app);

app.listen(port);
console.log("The node is running on " +port);
