var express = require("express");
var bodyParser = require("body-parser");
var passport = require("passport");
var bcrypt = require("bcryptjs");
var path = require("path");
const mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:/FFSD-1');
var db = mongoose.connection;
db.on('error', console.log.bind(console, "connection error"));
db.once('open', function(callback) {
        console.log("connection succeeded");
    })
    //mongoose.connect('mongodb://localhost:27017/FFSD-1').then(() => {
    //console.log("Database Connected");
    //}).catch((err) => {
    //console.log("Error" + err.message);
    //});

var app = express();

app.use(bodyParser.json());

/* app.use(express.static('HTML'));
app.use(express.static('IMAGES'));
app.use(express.static('CSS')); */

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/Views"));

app.get('/', function(req, res) {
    res.render('Home');
});

app.get('/Login', function(req, res) {
    res.render('Login');
});

app.get('/UserProfile', function(req, res) {
    res.render('UserProfile');
});

app.get('/UserDetails', function(req,res){
    res.render('UserDetails');
})

app.get('/home_1', function(req, res) {
    res.render('home_1');
});
app.get('/Contactus', function(req, res) {
    res.render('Contactus');
});

// For Signup
app.post('/signup', function(req, res) {
    var email = req.body.email;
    var pass = req.body.password;
    var pass1 = req.body.password1;
    var username = req.body.username;
    var dob = req.body.dob;
    var profession = req.body.profession;
    var info = req.body.info;

    var data = {
        "email": email,
        "password": pass,
        "password1": pass1,
        "username": username,
        "dob": dob,
        "profession": profession,
        "info": info
    }
    db.collection('signup_details').insertOne(data, function(err, collection) {
        if (err) throw err;
        console.log("Record inserted Successfully");
    });
    return res.redirect('home_1');

})

app.post('/contactus', function(req, res) {
    var name = req.body.name;
    var email = req.body.email;
    var ph_num = req.body.phone;
    var mssg = req.body.message;

    var data = {
        "name": name,
        "email": email,
        "phone": ph_num,
        "message": mssg
    }
    db.collection('contactus').insertOne(data, function(err, collection) {
        if (err) throw err;
        console.log("Record inserted Successfully");
    });
    return res.redirect('/HTML/Success.html');

})

// For Login

app.post('/login', function(req, res) {
    const email = req.body.email;
    const pass = req.body.password;

    const data = {
        "email": email,
        "password": pass
    }

    
    db.collection('signup_details').findOne(data, function(err, user) {
        if (user) {
            console.log("login successful")
            res.redirect('home_1');
        } else {
            console.log("Incorrect details")
            res.redirect('Login')
        }
    })

})

// for admin login



// For UserDetails
app.post('/userdetails', function(req, res) {
    var Username = req.body.name;
    var email = req.body.email;
    var DOB = req.body.DOB;
    var prof = req.body.prof;
    var info = req.body.info;



    var data = {
        "username": Username,
        "email": email,
        "DOB": DOB,
        "profession": prof,
        "Additional Info": info
    }
    db.collection('users').insertOne(data, function(err, collection) {
        if (err) throw err;
        console.log("Record inserted Successfully");
    });
    return res.redirect('/HTML/Success.html');

})

var signup_details = db.collection('signup_details');
var contactus = db.collection('contactus');
var users = db.collection('users');

// to display all users in admin page

app.get('/user_display', function(req,res){
    signup_details.find({}).toArray(function(err,result){
       if(err) throw err;
       res.render("user_display",{data: result});
    })
 })

// to count all users
/* 
signup_details.count(function (err, res1) {
    if (err)
        throw err;
    db.close();
}); */


// To display contactus messages in admin page

app.get('/contact_display', function(req,res){
    contactus.find({}).toArray(function(err,result){
       if(err) throw err;
       res.render("contact_display",{data: result});
    })
 })

app.get('/', function(req, res) {
    res.set({
        'Access-control-Allow-Origin': '*'
    });
    return res.redirect('Home');
}).listen(3000)

console.log("server listening at port 3000");