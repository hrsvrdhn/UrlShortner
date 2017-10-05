const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
var routes = require('./routes/index');
var port = process.env.PORT || 3000;
if(process.env.NODE_ENV !== 'production')
	var config = require('./config');
var app = express();

mongoose.Promise = global.Promise;
mongoose.connect(process.env.DATABASE_URL || config.development.database);

app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

routes(app);

app.listen(port);
console.log("The node is running on " +port);
