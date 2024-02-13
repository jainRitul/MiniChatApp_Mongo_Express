const mongoose = require('mongoose');
const Chat = require('./models/chat.js');

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

//inserting 
let allChats = [
    {

        from : "Ritul",
        to:"Papa",
        msg :"Papa job lag gyi 25 lakh package hai",
        created_at : new Date()
        
    },
    {

        from : "Papa",
        to:"Ritul",
        msg :"Wahhhh beta Wahhh mera kohinoor h tu",
        created_at : new Date()

    },
    {

        from : "Ritul",
        to:"Mummy",
        msg :"Mummy ab paiso ki chinta mt krna",
        created_at : new Date()

    },
    {

        from : "Bhaiya",
        to:"Ritul",
        msg :"Aj to tu mujh s bhi baddii bangyi",
        created_at : new Date()

    },
    {

        from : "Prinjal",
        to:"Ritul",
        msg :"Dono sath nikl te h phir pune next week",
        created_at : new Date()

    },

]

Chat.insertMany(allChats)
.then((res)=>{
    console.log(res);
}).catch((err)=>{
    console.log(err);
})
