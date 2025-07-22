import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../middleware/errors.js";
import { v2 as cloudinary } from "cloudinary";
import { Project } from "../Models/projectSchema.js";

export const addProject = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files.projectBanner).length === 0) {
    return next(new ErrorHandler("Project banner image is required!", 400));
  }
  const { projectBanner } = req.files;
  const {
    title,
    description,
    getRepoLink,
    projectLink,
    technologies,
    stack,
    deployed,
  } = req.body;
  if (
    !title ||
    !description ||
    !getRepoLink ||
    !projectLink ||
    !technologies ||
    !stack ||
    !deployed
  ) {
    return next(new ErrorHandler("please provide all details!", 400));
  }

  const cloudinaryResponse = cloudinary.uploader.upload(
    projectBanner.tempFilePath,
    {
      folder: "Project_Banner",
    }
  );
  if (!cloudinaryResponse || cloudinaryResponse.error) {
    return next(new ErrorHandler("Project Svg/image Upload Failed", 500));
  }
  const project = await Project.create({
    title,
    description,
    getRepoLink,
    projectLink,
    technologies,
    stack,
    deployed,
    projectBanner: {
      public_id: (await cloudinaryResponse).public_id,
      url: (await cloudinaryResponse).secure_url,
    },
  });

  res.status(201).json({
    success: true,
    message: "New project added",
    project,
  });
});
export const updateProject = catchAsyncErrors(async (req, res, next) => {
  const newProjectData = {
    title: req.body.title,
    description: req.body.description,
    getRepoLink: req.body.getRepoLink,
    projectLink: req.body.projectLink,
    technologies: req.body.technologies,
    stack: req.body.stack,
    deployed: req.body.deployed,
  };
  const project = await Project.findById(req.params.id);

  if (req.files && req.files.projectBanner) {
    const projectBanner = req.files.projectBanner;

    if (project.projectBanner && project.projectBanner.public_id) {
      await cloudinary.uploader.destroy(user.projectBanner.public_id);
    }

    const cloudinaryResponse = await cloudinary.uploader.upload(
      projectBanner.tempFilePath,
      {
        folder: "Project_Banner",
      }
    );
    newProjectData.projectBanner = {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    };
  }

  const projects = await Project.findByIdAndUpdate(
    req.params.id,
    newProjectData,
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );
  res.status(200).json({
    success: true,
    message: "Project Updated Successfully",
    projects,
  });
});
export const deleteProject = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const project = await Project.findById(id);
  if (!project) {
    return next(new ErrorHandler("No Project Found!", 404));
  }
  await project.deleteOne();
  res.status(200).json({
    success: true,
    message: "Project Deleted!",
  });
});
export const getAllProject = catchAsyncErrors(async (req, res, next) => {
  const project = await Project.find();
  res.status(200).json({
    success: true,
    project,
  });
});
export const getSingle = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const project = await Project.findById(id);
  if (!project) {
    return next(new ErrorHandler("No Project Found!", 404));
  }
  res.status(200).json({
    success: true,
    project,
  });
});
