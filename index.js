const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const model = require('./models/chat.js');
const Chat = require('./models/chat.js');
const { log } = require('console');
const methodOverride = require('method-override');

app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
//creating connection with database
main().then(()=>{
    console.log("connection established");
})
.catch((err)=>{
    console.log(err);
})
async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');
}




//Index route show all chats
app.get("/chats", async (req,res)=>{
   let chats = await Chat.find();
   console.log(chats);
   res.render("index.ejs",{chats});
})
 

//adding new chat 
app.get("/chats/new",(req,res)=>{
    res.render("new.ejs");
})
//create route or insert new chat data to database
app.post("/chats",(req,res)=>{
    let {from,to,msg} = req.body;
    let newChat = new Chat({
        from : from,
        to : to,
        msg:msg,
        created_at : new Date()
    })
    newChat
    .save()
    .then(()=>{
        console.log("chat was saved");
    })
    .catch((err)=>{
        console.log(err);
    })
    
    res.redirect("/chats");
    
})
//root route
app.get("/",(req,res)=>{
    res.send("root is working")
})

//edit route
app.get("/chats/:id/edit",async (req,res)=>{
    let {id} = req.params;
    let chat = await Chat.findById(id);
    res.render("edit.ejs",{chat});

})

//update route
app.put("/chats/:id", async (req,res)=>{
    let {id} = req.params;
    let {msg : newMsg} = req.body;
    console.log(newMsg);
    let updatedChat = await Chat.findByIdAndUpdate(
        id,
        {msg : newMsg},
        {runValidators:true , new : true}
    );
    // console.log(updatedChat);
    res.redirect("/chats");
    // console.log(newMsg);
    // res.redirect("/chats");    
})


//delete route
app.delete("/chats/:id",async (req,res)=>{
    let {id} = req.params;
    let DeltedChat = await Chat.findByIdAndDelete(id);
    console.log(DeltedChat);
    res.redirect("/chats");
})
//listening port
app.listen(8080,()=>{
    console.log("app listening at port 8080");
})