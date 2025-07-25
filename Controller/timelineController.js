
import { catchAsyncErrors } from "../middleware/CatchAsyncErrors.js";
import { Timeline } from "../Models/timelineSchema.js";
import ErrorHandler  from "../middleware/errors.js"

export const postTimeline = catchAsyncErrors(async (req, res, next) => {
 
const {title, description,from,to} = req.body;
const newTimeline = await Timeline.create({ title, description,timeline:{from,to}})
res.status(200).json({
    success:true,
    message:"New timeline add!",
    newTimeline
})

});
export const deleteTimeline = catchAsyncErrors(async (req, res, next) => {
    const {id} = req.params;
    const timeline = await Timeline.findById(id);
    if (!timeline){
        return next(new ErrorHandler("No timeline was found!",404))
    }
    await timeline.deleteOne();
    res.status(200).json({
        success:true,
        message:"Timeline Dlete Successfully"
    })
});
export const getAllTimeline = catchAsyncErrors(async (req, res, next) => {
    const timeline = await Timeline.find();
    res.status(200).json({
        success:true,
        timeline
    })
});
