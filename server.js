const express = require("express");
const mongoose = require('mongoose');
const bodyParser = require("body-parser"); /* deprecated */
const cors = require("cors");

const app = express();
require('dotenv').config();

var corsOptions = {
  origin: "*"
};

mongoose.Promise = global.Promise;
mongoose.set('debug', true);
// mongoose.connect('mongodb://127.0.0.1:27017/thirukulamdb', { useNewUrlParser: true, useUnifiedTopology: true })
//mongoose.connect('mongodb://192.168.0.190:27017/thirukulamdb', { useNewUrlParser: true, useUnifiedTopology: true }) 
//mongoose.connect('mongodb://192.168.0.195:27017/thirukulamdb', { useNewUrlParser: true, useUnifiedTopology: true }) 
//mongoose.connect('mongodb://172.235.15.172:27017/thirukulamdb', { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.connect('mongodb://localhost:27017/thirukulam', { useNewUrlParser: true, useUnifiedTopology: true }) 


  .then(() =>  console.log('connection successful'))
  .catch((err) => console.error(err));

app.use(cors(corsOptions));
app.use(bodyParser.json());
// parse requests of content-type - application/json
app.use(express.json()); /* bodyParser.json() is deprecated */

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true })); /* bodyParser.urlencoded() is deprecated */

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to thirukulam-matrimony application." });
});

require("./app/routes/auth.routes.js")(app);
require("./app/routes/profileManagement.routes.js")(app);
require("./app/routes/partnerPreference.routes.js")(app);
require("./app/routes/master.routes.js")(app);
require("./app/routes/matches.routes.js")(app);
require("./app/routes/cms.routes.js")(app);
require("./app/routes/subscription.route.js")(app)
//console.log(process.env.PORT);
//set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
