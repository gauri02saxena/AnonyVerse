const express= require("express");
const ejs=require("ejs")
const bodyParser= require("body-parser");
const mongoose=require("mongoose");

const app=express();

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static("public"));


mongoose.connect("mongodb://127.0.0.1:27017/userDB",{useNewUrlParser:true, useUnifiedTopology:true});

const userSchema= {
    email: String,
    password: String
}

const User= mongoose.model("User", userSchema);


app.get("/", function(req,res)
{
    res.render("home");
});

app.get("/login", function(req,res)
{
    res.render("login");
});

app.get("/register", function(req,res)
{
    res.render("register");
});



app.listen(3000,function(){
    console.log("Server started on port 3000");
});