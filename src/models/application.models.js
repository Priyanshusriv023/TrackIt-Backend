import mongoose, { Schema } from "mongoose"

const statusEnum = [
    "Applied",
    "OA",
    "Interview Round 1",
    "Interview Round 2",
    "HR Round",
    "Offer",
    "Rejected"
]


const applicationSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        companyName: {
            type: String,
            required: true,
            trim: true,
        },

        role: {
            type: String,
            required: true,
            trim: true,
        },

        currentStatus: {
            type: String,
            enum: statusEnum,
            default: "Applied",
        },

        jobUrl: {
            type: String,
            trim: true,
        },

        location: {
            type: String,
            trim: true,
        },

        ctc: {
            type: String,
            trim: true,
        },

        appliedDate: {
            type: Date,
            default: Date.now,
        },

        notes: {
            type: String,
        },

        resumeVersion: {
            type: {
                url: String,
                localpath: String,
            },
            default: {
                url: "",
                localpath: "",
            }
        },

        statusHistory: [
            {
                status: {
                    type: String,
                    enum: statusEnum,
                },
                changedAt: {
                    type: Date,
                    default: Date.now,
                }
            }
        ],

        reminder: {
            date: {
                type: Date,
            },
            sent: {
                type: Boolean,
                default: false,
            }
        }
    },
    { timestamps: true }
)

export const Application = mongoose.model("Application", applicationSchema)