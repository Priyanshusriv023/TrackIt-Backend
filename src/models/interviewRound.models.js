import mongoose, { Schema } from "mongoose"

const interviewRoundSchema = new Schema(
    {
        applicationId: {
            type: Schema.Types.ObjectId,
            ref: "Application",
            required: true,
        },

        roundName: {
            type: String,
            required: true,
            trim: true,
        },

        roundDate: {
            type: Date,
        },

        questionsAsked: {
            type: String,
            trim: true,
        },

        performanceRating: {
            type: Number,
            min: 1,
            max: 5,
        },

        outcome: {
            type: String,
            enum: ["cleared", "rejected", "waiting"],
            default: "waiting",
        },

        notes: {
            type: String,
            trim: true,
        },
    },
    { timestamps: true }
)

export const InterviewRound = mongoose.model("InterviewRound", interviewRoundSchema)