import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderName:{
        type:String,
        minLength:[2,"The minLength of SenderName should be atleast 2 character"]
    },
    subject:{
        type:String,
        minLength:[2,"The minLength of Subject should be atleast 2 character"]
    },
    message:{
        type:String,
        minLength:[2,"The minLength of Message should be atleast 2 character"]
    },
    createAt:{
        type:Date,
        default:Date.now()
    }
})

export const Message = mongoose.model("Message",messageSchema)