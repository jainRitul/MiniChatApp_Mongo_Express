const mongoose = require('mongoose');


//schema for chat 
const chatSchema = new mongoose.Schema({
    from : {
        type : String,
        required : true,
    },
    to : {
        type : String,
        required : true,
    },
    msg : {
        type : String,
        maxLength : 50,
    },
    created_at :{
        type : Date,
        required : true,

    }

})

//model for chat
const Chat = mongoose.model("Chat",chatSchema);
//exporting chat to index.js
module.exports = Chat;