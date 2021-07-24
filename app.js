const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var _ = require("lodash");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

const postSchema = new mongoose.Schema({
  title: String,
  content: String
})

const Post = mongoose.model("Post", postSchema);

const homeStartingContent = "Welcome to my Daily";
const aboutContent = "I'm Simon. Yeah, it's me";
const contactContent = "Send a mail to simonkuforiji@gmail.com";

app.get("/", function(req, res){
  Post.find({}, function(err, postArray){
    if(!err){
      res.render("home", {
        homeStartingContent: homeStartingContent, 
        allPosts: postArray
      });
    } else{
      console.log(err);
    }
  });
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
})

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
})

app.get("/compose", function(req, res){
  res.render("compose");
})

app.post("/compose", function(req, res){
  const newTitle = req.body.composedTitle;
  const newBody = req.body.composedBody;

  //save if doesnt exist already
  Post.findOne({title: newTitle}, function(err, postObject){
    if(!err){
      if(!postObject){
        const newPost = new Post({
          title: newTitle,
          content: newBody
        });
        newPost.save();
        console.log("Successfully created " + newTitle + " post");
        res.redirect("/");
      } else{
        console.log(newTitle + " post already exists");
      }
    } else{
      console.log(err);
    }
  });
});

app.get("/posts/:postTitle", function(req, res){
  const requestedTitleId = req.params.postTitle;
  Post.findOne({_id: requestedTitleId}, function(err, foundObject){
    if(!err){
      res.render("post", {
        postContentTitle: foundObject.title,
        postContentBody: foundObject.content
      });
    } else{
      console.log(err);
    }
  });
})

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function() {
  console.log("Server started on port 3000");
});