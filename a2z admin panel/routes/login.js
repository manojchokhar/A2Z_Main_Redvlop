var express = require("express");
var route = express.Router();
var exe = require("./connection");
route.get("/",function(req,res){
    res.render("login/login.ejs");
});

route.post("/check_admin",async function(req,res){
    var d = req.body;
    var sql = `SELECT * FROM admin_tbl WHERE admin_email = '${d.username}' AND admin_password = '${d.password}'`;
    var data =await exe(sql);
    if(data.length > 0)
    {
        req.session['admin_id'] = data[0].admin_id;
        res.redirect("/admin");
    }
    else
    {
        // res.send("Login Failed");
        res.redirect("/login");
    }
});
module.exports = route;