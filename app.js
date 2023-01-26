const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

function reload(){
  window.location.reload();
};

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb://127.0.0.1:27017/DBlogToDo');

const arr = [];

const listschema = mongoose.Schema({
  name : String,
  item : [String] // it became an array of object type of normalSchema 
});

const List = mongoose.model("List",listschema);

app.get("/",(req,res)=>{ // for root route 
  List.find({},(err,data)=>{
    if(data.length === 0){
      res.render("homie");
    }else{
      res.render("home",{post : data});
    }
  });
});

app.get("/todoName",(req,res)=>{
  res.render("todoName")
});

app.post("/todoList",(req,res)=>{
  const Name = req.body.name_inp;
  res.redirect("/" + Name);
});

app.get("/:topic",(req,res)=>{
  const topic = req.params.topic;
  
  List.findOne({name : topic },(err,data)=>{
    if(!data){
      const cList = new List({
        name : topic,
        item : []
      });
      cList.save();
      res.redirect("/" + topic);
    }
    else{
      if(err){console.log(err);}
      else{
        res.render("list2",{listTitle: data.name, newListItems: data.item});
      }
    }
  });
});

// to add element
app.post("/storeHouse",(req,res)=>{
  const val_1 = req.body.newItem;
  const val_2 = req.body.list;
  List.findOne({name : val_2 },(err,data)=>{
    data.item.push(val_1);
    data.save();
    res.redirect("/"+val_2);
  });
});

// to delete element
app.post("/dele",(req,res)=>{
  var me = req.body.chkbox;
  var hid = req.body.hiddenInp;
      List.findOneAndUpdate({name : hid},{$pull : {item : me}},(err)=>{
        if(err){
          console.log(err);
        }else{
          res.redirect("/"+hid)
        }
      });
});

// app.get("/todoList",(req,res)=>{
//   res.render("list2",{listTitle: "affe", newListItems: arr});
// });


app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});