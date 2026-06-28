import { Application } from "../models/application.models.js"
import { asynchandler } from "../utils/asyncHandler.js"
import { apiResponse } from "../utils/api-Response.js"
import { apiError } from "../utils/api-Error.js"
import mongoose from "mongoose"

const getDashboardStats = asynchandler(async (req, res) => {
    const userId = new mongoose.Types.ObjectId(req.user._id)

    // 1. Total applications + grouped by status
    const statusStats = await Application.aggregate([
        {
            $match: { userId }
        },
        {
            $group: {
                _id: "$currentStatus",
                count: { $sum: 1 }
            }
        }
    ])

    // convert array to object { Applied: 5, OA: 2 ... }
    const byStatus = {}
    
    statusStats.forEach(item => {
        byStatus[item._id] = item.count
         
    })

    const totalApplications = Object.values(byStatus).reduce((a, b) => a + b, 0)

    // 2. Success rate
    const offers = byStatus["Offer"] || 0
    const successRate = totalApplications > 0
        ? ((offers / totalApplications) * 100).toFixed(2)
        : 0

    // 3. Weekly trend (last 8 weeks)
    const weeklyTrend = await Application.aggregate([
        {
            $match: {
                userId,
                appliedDate: {
                    $gte: new Date(Date.now() - 8 * 7 * 24 * 60 * 60 * 1000) // last 8 weeks
                }
            }
        },
        {
            $group: {
                _id: {
                    year: { $isoWeekYear: "$appliedDate" },
                    week: { $isoWeek: "$appliedDate" }
                },
                count: { $sum: 1 }
            }
        },
        {
            $sort: { "_id.year": 1, "_id.week": 1 }
        },
        {
            $project: {
                _id: 0,
                week: {
                    $concat: [
                        { $toString: "$_id.year" },
                        "-W",
                        { $toString: "$_id.week" }
                    ]
                },
                count: 1
            }
        }
    ])

    // 4. Monthly trend (last 6 months)
    const monthlyTrend = await Application.aggregate([
        {
            $match: {
                userId,
                appliedDate: {
                    $gte: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000) // last 6 months
                }
            }
        },
        {
            $group: {
                _id: {
                    year: { $year: "$appliedDate" },
                    month: { $month: "$appliedDate" }
                },
                count: { $sum: 1 }
            }
        },
        {
            $sort: { "_id.year": 1, "_id.month": 1 }
        },
        {
            $project: {
                _id: 0,
                month: {
                    $concat: [
                        { $toString: "$_id.year" },
                        "-",
                        { $toString: "$_id.month" }
                    ]
                },
                count: 1
            }
        }
    ])

    // 5. Average days from Applied to latest status change
    const avgDays = await Application.aggregate([
        {
            $match: {
                userId,
                "statusHistory.1": { $exists: true } // at least 2 status entries
            }
        },
        {
            $project: {
                daysDiff: {
                    $divide: [
                        {
                            $subtract: [
                                { $arrayElemAt: ["$statusHistory.changedAt", -1] }, // last status
                                { $arrayElemAt: ["$statusHistory.changedAt", 0] }   // first status
                            ]
                        },
                        1000 * 60 * 60 * 24 // convert ms to days
                    ]
                }
            }
        },
        {
            $group: {
                _id: null,
                averageDays: { $avg: "$daysDiff" }
            }
        }
    ])

    return res.status(200).json(
        new apiResponse(200, {
            totalApplications,
            byStatus,
            successRate: parseFloat(successRate),
            weeklyTrend,
            monthlyTrend,
            averageDaysToResponse: avgDays[0]?.averageDays?.toFixed(1) || 0
        }, "Dashboard stats fetched successfully")
    )
})

export { getDashboardStats }