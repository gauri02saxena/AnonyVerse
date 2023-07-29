require("dotenv").config();
const express= require("express");
const ejs=require("ejs")
const bodyParser= require("body-parser");
const mongoose=require("mongoose");
const session = require("express-session");
const passport=require("passport");
const passportLocalMongoose= require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require("mongoose-findorcreate");

const app=express();


app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static("public"));

//Initializing session
app.use(session({

    secret:"Three may keep a secret",
    resave:false,
    saveUninitialized:false
}));

//Initializing passport
app.use(passport.initialize());
//Use passport to set up session
app.use(passport.session());



mongoose.connect("mongodb://127.0.0.1:27017/userDB",{useNewUrlParser:true, useUnifiedTopology:true});
// mongoose.set("useCreateIndex", true);

const userSchema= new mongoose.Schema ({
    email: String,
    password: String,
    googleId: String,
    secret: String
});

//To hash, salt passwords and save users to db
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);


const User= mongoose.model("User", userSchema);

passport.use(User.createStrategy());
//used when we have sessions
passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, {
        id: user.id,
        username: user.username,
        picture: user.picture
      });
    });
  });
  
  passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, user);
    });
  });


passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets"
  },
  function(accessToken, refreshToken, profile, cb) {
 
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
        
      return cb(err, user);
    });
  }
));


app.get("/", function(req,res)
{
    res.render("home");
});

app.get("/auth/google",
  passport.authenticate("google", { scope: ['profile'] }));

app.get("/auth/google/secrets", 
  passport.authenticate('google', { failureRedirect: "/login" }),
  function(req, res) {
    // Successful authentication, redirect to secrets page.
    res.redirect("/secrets");
  });

app.get("/login", function(req,res)
{
    res.render("login");
});

app.get("/register", function(req,res)
{
    res.render("register");
});

app.get("/secrets", function(req,res)
{
  //finding users who have secret field not equal to null i.e they have a secret
   User.find({"secret":{$ne:null}})
   .then((foundUser)=>{res.render("secrets", {usersHavingSecrets: foundUser})})
   .catch((err)=>console.log(err));
});

app.get("/submit", function(req,res)
{
    if(req.isAuthenticated())
    {
        res.render("submit");
    }
    else{
        res.redirect("/login");
    }
});

app.post("/submit", function(req,res)
{
  const submittedSecret= req.body.secret;


  User.findById(req.user.id)
  .then((foundUser)=>{
    foundUser.secret=submittedSecret;
    foundUser.save()
    .then(()=>res.redirect("/secrets"));
  })
  .catch((err)=>console.log(err));
});


app.get("/logout", function(req,res)
{
    req.logout(function(err) {
        if (err) { console.log(err); }
        else{
            res.redirect('/');
        }
        
      });
});

app.post("/register", function(req,res)
{

    User.register({username:req.body.username}, req.body.password,function(err, user)
    {
        if(err)
        {
            console.log(err);
            res.redirect("/register");
        }
        else{
            passport.authenticate("local")(req,res,function(){
                res.redirect("/secrets");
            });
        }
    })
   
});

app.post("/login", function(req,res)
{
    

    const user=new User({
         username:req.body.username,
        password:req.body.password 
    })

    //using passport to login
    req.login(user,function(err)
    {
        if(err)
        {
            console.log(err);
            res.redirect("/register");
        }
        else{
            passport.authenticate("local")(req,res,function(){
                res.redirect("/secrets");
            });
            
        }
    });

});

app.listen(3000,function(){
    console.log("Server started on port 3000");
});