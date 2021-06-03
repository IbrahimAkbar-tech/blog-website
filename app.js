//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require('lodash');

mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false});

const homeStartingContent = "This is my first blog post for this website. I have created this using HTML/CSS, Bootstrap, Node.js, Express.js, MongoDB. The purpose of this site is to allow myself to compose messages and post these onto the home page.";
const aboutContent = "";
const contactContent = "If you wish to get in contact with me: grandline1@hotmail.co.uk";
//let posts = [];

const app = express();

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//home
app.get("/", function(req, res){

  Post.find({}, function(err, posts){
   res.render("home", {
     homeStartingContent: homeStartingContent,
     posts: posts
     });
 });
});

//about
app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

//contact
app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

//compose message
app.get("/compose", function(req, res){res.render("compose");
});


//Allow dynamic browsing
//create a new url to each post using post.ejs template
//Loops through each element in posts array
//checks to see if requested title is === stored Title
//if so render post template and post the given data
app.get("/posts/:elementId", function(req, res){

  const requestedPostId = req.params.elementId;

  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content});
  });
});

//post Title and Message submitted in the compose tab
//add both to post object
//push this object to array posts
//redirect user back to home page to show them the posts they have added
app.post("/compose", function(req, res){
  const post = new Post ({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  //posts.push(post);
  post.save(function(err){
    if(!err){
      res.redirect("/");
    }
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
