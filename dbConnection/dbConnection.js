import mongoose from "mongoose";

function ConnectToDB() {
    mongoose.connect(process.env.MONGO_URI,{
        dbName:"Portfolio"
    }).then(()=>{
    
    }).catch((error)=>{
        
    })
    
}
export default ConnectToDB;