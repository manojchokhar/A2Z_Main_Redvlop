var express = require("express");
var bodyparser = require("body-parser");
var upload = require("express-fileupload");
var session = require("express-session");
var loginRoute = require("./routes/login");
var adminRoute = require("./routes/admin");
var app = express();
var cors=require("cors");
// for security reason we use core to share data outside the projects of node to import in react
app.use(bodyparser.urlencoded({extended:true}));
app.use(upload());
app.use(session({
    secret:"A2Z IT HUB",
    resave:true,
    saveUninitialized:true
}));     
app.use(express.static("public/"));
app.use(cors());
app.use("/login",loginRoute);
app.use("/admin",adminRoute);


app.listen(2000);