import {apiResponse} from "../utils/api-Response.js"
import {apiError} from "../utils/api-Error.js"
import {asynchandler} from "../utils/asyncHandler.js"
import { Application } from "../models/application.models.js"
import { InterviewRound } from "../models/interviewRound.models.js"

 const addInterviewRound = asynchandler(async (req, res) => {
    const {applicationId} = req.params;

    if(!applicationId){
        throw new apiError(400,"invalid application Id")
    }

    const application = await Application.findOne({
        _id: applicationId,
        userId: req.user._id
    })

    if (!application) {
        throw new apiError(404, "Application not found")
    }

    const { 
        
        roundName, 
        roundDate, 
        questionsAsked, 
        performanceRating, 
        outcome, 
        notes 
    } = req.body;

    
    if (!roundName) {
        throw new apiError(400,"Round Name is required")
    }
    
    const newRound = await InterviewRound.create({
        applicationId,
        roundName,
        roundDate,
        questionsAsked,
        performanceRating,
        outcome,
        notes
    });

    
    res.status(201)
    .json(new apiResponse(
        201,
        newRound,
        "Interview round added successfully"
    ))
});

const getInterviewRounds = asynchandler(async (req, res) => {
    const { applicationId } = req.params;

    
    if (!applicationId) {
        throw new apiError(400, "Invalid application Id");
    }

   
    const application = await Application.findOne({
        _id: applicationId,
        userId: req.user._id
    });

    if (!application) {
        throw new apiError(404, "Application not found or unauthorized");
    }

    
    const rounds = await InterviewRound.find({ applicationId }).sort({ roundDate: 1 });

    
    return res
        .status(200)
        .json(new apiResponse(
            200, 
            rounds, 
            "Interview rounds retrieved successfully"
        ));
});

const updateInterviewRound = asynchandler(async (req, res) => {
    const { roundId } = req.params;

    
    if (!roundId) {
        throw new apiError(400, "Interview round ID is required");
    }

    
    const { 
        roundName, 
        roundDate, 
        questionsAsked, 
        performanceRating, 
        outcome, 
        notes 
    } = req.body;

    
    const interviewRound = await InterviewRound.findById(roundId);
    if (!interviewRound) {
        throw new apiError(404, "Interview round not found");
    }

  
    const application = await Application.findOne({
        _id: interviewRound.applicationId,
        userId: req.user._id
    });

    if (!application) {
        throw new apiError(403, "Unauthorized to update this interview round");
    }

    if (roundName === "") {
        throw new apiError(400, "Round name cannot be empty");
    }


    const updateFields = {};
    if (roundName !== undefined) updateFields.roundName = roundName;
    if (roundDate !== undefined) updateFields.roundDate = roundDate;
    if (questionsAsked !== undefined) updateFields.questionsAsked = questionsAsked;
    if (performanceRating !== undefined) updateFields.performanceRating = performanceRating;
    if (outcome !== undefined) updateFields.outcome = outcome;
    if (notes !== undefined) updateFields.notes = notes;

    
    
    
    const updatedRound = await InterviewRound.findByIdAndUpdate(
        roundId,
        { $set: updateFields },
        { new: true, runValidators: true }
    );

    
    return res
        .status(200)
        .json(new apiResponse(
            200,
            updatedRound,
            "Interview round updated successfully"
        ));
});

const deleteInterviewRound = asynchandler(async (req, res) => {
    const { roundId } = req.params;

    if (!roundId) {
        throw new apiError(400, "Interview round ID is required");
    }

    const interviewRound = await InterviewRound.findById(roundId);
    if (!interviewRound) {
        throw new apiError(404, "Interview round not found");
    }

    const application = await Application.findOne({
        _id: interviewRound.applicationId,
        userId: req.user._id
    });

    if (!application) {
        throw new apiError(403, "Unauthorized to delete this interview round");
    }

    await InterviewRound.findByIdAndDelete(roundId);

    return res
        .status(200)
        .json(new apiResponse(
            200,
            {},
            "Interview round deleted successfully"
        ));
});

export {
    addInterviewRound,
    getInterviewRounds,
    updateInterviewRound,
    deleteInterviewRound
}
