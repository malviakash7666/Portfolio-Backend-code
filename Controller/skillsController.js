import { catchAsyncErrors } from "../middleware/CatchAsyncErrors.js";
import ErrorHandler from "../middleware/errors.js";

import { v2 as cloudinary } from "cloudinary";
import { Skill } from "../Models/skillSchema.js";

export const addNewSkill = catchAsyncErrors(async (req, res, next) => {
 
      if (!req.files || !req.files.svg ) {
           return next(new ErrorHandler("image/svg required!", 400));
         }
       
         const svg = req.files.svg;
         const {title,proficency} = req.body;
         if(!title || !proficency){
           return next(new ErrorHandler("Title and proficiencyis required!",400))
         }
       
         const cloudinaryResponse = await cloudinary.uploader.upload(
           svg.tempFilePath,
           { folder: "PORTFOLIO_SKILLS_SVGS" }
         );

         if (!cloudinaryResponse || cloudinaryResponse.error) {
           return next(new ErrorHandler("Svg Upload Failed", 500));
         }
          const skill = await Skill.create({title,proficency,svg:{
        public_id:cloudinaryResponse.public_id,
        url:cloudinaryResponse.secure_url,
    }})
    res.status(200).json({
        success:true,
        message:"skills  added!",
        skill
    })
});
export const deleteSkill = catchAsyncErrors(async (req, res, next) => {

         const {id} = req.params;
         const skill = await Skill.findById(id);
         if(!skill){
           return next(new ErrorHandler("Skill not found"))
         }
         const skillSvgId = skill.svg.public_id;
         await cloudinary.uploader.destroy(skillSvgId)
         await skill.deleteOne()
         res.status(200).json({
           success:true,
           message:"Skill Deleted!"
         })

});
export const updateSkill = catchAsyncErrors(async (req, res, next) => {
   const {id} = req.params;
         let skill = await Skill.findById(id);
         if(!skill){
           return next(new ErrorHandler("Skill not found"))
         }
      const {proficency} = req.body;
skill = await Skill.findByIdAndUpdate(id,{proficency},{
  new:true,
  runvalidators:true,
  useFindAndModify : false,
})
res.status(200).json({
  success:true,
  message:"Skill Updated Successfully!",
  skill
})

});
export const getAllSkills = catchAsyncErrors(async (req, res, next) => {
  const skills = await Skill.find();
  res.status(200).json({
    success:true,
    skills
  })
});
