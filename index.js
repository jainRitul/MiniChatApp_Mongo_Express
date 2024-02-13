const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const model = require('./models/chat.js');
const Chat = require('./models/chat.js');
const { log } = require('console');
const methodOverride = require('method-override');
const ExpressError = require("./ExpressError.js");

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
    await mongoose.connect('mongodb://127.0.0.1:27017/fakewhatsapp');
}




//Index route show all chats
app.get("/chats", async (req,res,next)=>{
    try{
   let chats = await Chat.find();
   console.log(chats);
   res.render("index.ejs",{chats});}
   catch(err){
       next(err);
   }
})
 

//adding new chat 
app.get("/chats/new",(req,res)=>{
    res.render("new.ejs");
})

//create route or insert new chat data to database
app.post("/chats",async (req,res,next)=>{
    try{
        let {from,to,msg} = req.body;
        let newChat = new Chat({
            from : from,
            to : to,
            msg:msg,
            created_at : new Date()
        })
        await  newChat.save();
        res.redirect("/chats");
    }
    catch(err){
         next(err);
    }

    
})
//root route
app.get("/",(req,res)=>{
    throw new ExpressError(400,"page not found");
    res.send("root is working")
})
//New //show
app.get("/chats/:id",async (req,res,next)=>{
   try{
    let {id} = req.params;
    let chat = await Chat.findById(id);
    if(!chat) {
       next(new ExpressError(404,"Chat not found"));
    }
    res.render("edit.ejs",{chat});
   }
    catch(err){
        next(err);
    }

})

//edit route
app.get("/chats/:id/edit",async (req,res,next)=>{
    try{
        let {id} = req.params;
        let chat = await Chat.findById(id);
        res.render("edit.ejs",{chat});
    }
   
    catch(err){
        next(err);
    }
})

//update route
app.put("/chats/:id", async (req,res,next)=>{
    try{
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
    }catch(err){
        next(err);
    }
})


//delete route
app.delete("/chats/:id",async (req,res,next)=>{
    try{
        let {id} = req.params;
        let DeltedChat = await Chat.findByIdAndDelete(id);
        console.log(DeltedChat);
        res.redirect("/chats");
    }catch(err){
        next(err);
    }
})
//error handling middleware
app.use((err,req,res,next)=>{
   let  {status=500,message="Some error occured"} = err;
   res.status(status).send(message);
})
//listening port
app.listen(8080,()=>{
    console.log("app listening at port 8080");
})