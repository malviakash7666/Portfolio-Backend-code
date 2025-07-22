import mongoose from "mongoose";

const softwareApplicationSchema = new mongoose.Schema({
 name:{
type:String,
required:[true,"please provide a name"]
 },
    svg:{
        public_id:{
            type:String,
            required:true,
        },
        url:{
            type:String,
            required:true,
        },
    }
})
export const softwareApplication = mongoose.model("softwareApplication",softwareApplicationSchema)