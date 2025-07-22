import { catchAsyncErrors } from "../middleware/CatchAsyncErrors.js";
import ErrorHandler from "../middleware/errors.js";
import { softwareApplication } from "../Models/softwareApplicationSchema.js";
import  {v2 as cloudinary} from "cloudinary"



export const postApplication = catchAsyncErrors(async (req,res,next) => {

    if (!req.files || !req.files.svg ) {
        return next(new ErrorHandler("image/icon required!", 400));
      }
    
      const svg = req.files.svg;
      const {name} = req.body;
      if(!name){
        return next(new ErrorHandler("name is required!",400))
      }
    
      const cloudinaryResponse = await cloudinary.uploader.upload(
        svg.tempFilePath,
        { folder: "PORTFOLIO_SOFTWARE_APPLICATION" }
      );
 
      if (!cloudinaryResponse || cloudinaryResponse.error) {
        return next(new ErrorHandler("Svg Upload Failed", 500));
      }
     
    const softwareApplications = await softwareApplication.create({name,svg:{
        public_id:cloudinaryResponse.public_id,
        url:cloudinaryResponse.secure_url,
    }})
    res.status(200).json({
        success:true,
        message:"software application added!",
        softwareApplications
    })
})

export const deleteApplication = catchAsyncErrors(async (req,res,next) => {
const {id} = req.params;
const softwareapplications = await softwareApplication.findById(id);
if(!softwareapplications){
  return next(new ErrorHandler("software application not found"))
}
const softwareApplicationSvgId = softwareapplications.svg.public_id;
await cloudinary.uploader.destroy(softwareApplicationSvgId)
await softwareapplications.deleteOne()
res.status(200).json({
  success:true,
  message:"Appllication Deleted!"
})
    
})

export const getAllApplication = catchAsyncErrors(async (req,res,next) => {
  const allApplications = await softwareApplication.find();
  res.status(200).json({
    success:true,
    allApplications,
  })

    
})