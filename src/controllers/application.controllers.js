import {Application} from "../models/application.models.js";
import {asynchandler} from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/api-Response.js";
import { apiError } from "../utils/api-Error.js";


const createApplication = asynchandler(async(req,res) => {
          const {companyName,role,currentStatus,jobUrl,location,ctc,appliedDate,notes,reminder} = req.body;
          
          if(!companyName || !role){
            throw new apiError(400,"companyName and role is required")
          }

          const application = await Application.create({
               userId: req.user._id,  
               companyName,
               role,
               currentStatus: currentStatus || "Applied",
               jobUrl,
               location,
               ctc,
               appliedDate,
               notes,
               reminder,
               statusHistory: [{ status: currentStatus || "Applied", changedAt: new Date() }]
            })

          return res
                .status(201)
                .json(
                     new apiResponse(201,
                        application,
                        "Application created successfully")
                )
})

const getUserApplications = asynchandler(async (req, res) => {
          const { status, company, sortBy = "createdAt", order = "desc", startDate, endDate } = req.query;
         
          
          const filter = { userId: req.user._id };
         
          if (status) {
            filter.currentStatus = status;
          }
         
          if (company) {
            filter.companyName = { $regex: company, $options: "i" }; // case-insensitive search
          }
         
          if (startDate || endDate) {
            filter.appliedDate = {};
            if (startDate) filter.appliedDate.$gte = new Date(startDate);
            if (endDate) filter.appliedDate.$lte = new Date(endDate);
          }
         
          const sortOrder = order === "asc" ? 1 : -1;
         
          const applications = await Application.find(filter)
            .sort({ [sortBy]: sortOrder });
         
          return res
            .status(200)
            .json(
              new apiResponse(200, applications, "Applications fetched successfully")
            );
         });

const updateApplication = asynchandler(async (req, res) => {
    const { applicationId } = req.params;
    const { companyName, role, currentStatus, jobUrl, location, ctc, appliedDate, notes, reminder } = req.body;

    const application = await Application.findOne({
        _id: applicationId,
        userId: req.user._id
    });

    if (!application) {
        throw new apiError(404, "Application not found");
    }

    
    if (currentStatus && currentStatus !== application.currentStatus) {
        application.statusHistory.push({
            status: currentStatus,
            changedAt: new Date()
        });
        application.currentStatus = currentStatus;
    }

    
    if (companyName) application.companyName = companyName;
    if (role) application.role = role;
    if (jobUrl) application.jobUrl = jobUrl;
    if (location) application.location = location;
    if (ctc) application.ctc = ctc;
    if (appliedDate) application.appliedDate = appliedDate;
    if (notes) application.notes = notes;
    if (reminder) application.reminder = reminder;

    await application.save();

    return res
        .status(200)
        .json(
            new apiResponse(200, application, "Application updated successfully")
        );
});

const deleteApplication = asynchandler(async(req,res) => {
          const {applicationId} = req.params;

          const application = await Application.findByIdAndDelete({
               _id: applicationId,
               userId: req.user._id
          })

          if(!application){
               throw new apiError(404,"application not found")
          }

        

          return res
                .status(200)
                .json(
                     new apiResponse(200,{},"Application deleted successfully")
                )
});

const getApplicationById = asynchandler(async(req,res) => {
     const {applicationId} = req.params;

     const application = await Application.findById(applicationId)

     if (!application || application.userId.toString() !== req.user._id.toString()) {
           throw new apiError(404, "Application not found")
     }

     return res
           .status(200)
           .json(
                new apiResponse(200,application,"Application fetched successfully")
           )
});


const deleteStatusHistoryEntry = asynchandler(async (req, res) => {
    const { applicationId, entryId } = req.params;

    const application = await Application.findOne({
        _id: applicationId,
        userId: req.user._id
    });

    if (!application) {
        throw new apiError(404, "Application not found");
    }

    application.statusHistory = application.statusHistory.filter(
        entry => entry._id.toString() !== entryId
    );

    // auto update currentStatus to last entry in history
    const lastEntry = application.statusHistory[application.statusHistory.length - 1];
    application.currentStatus = lastEntry.status;

    await application.save({ validateBeforeSave: false });

    return res.status(200).json(new apiResponse(200, application, "Status entry deleted"));
});



export {createApplication ,getUserApplications,getApplicationById,updateApplication,deleteApplication,deleteStatusHistoryEntry }

        