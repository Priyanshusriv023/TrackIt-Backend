import cron from "node-cron"
import { Application } from "../models/application.models.js"
import { User } from "../models/user.models.js"
import { sendEmail } from "./mail.js"
import { reminderMailgenContent } from "./mail.js"

const startReminderCron = () => {
    // runs every hour
    cron.schedule("0 * * * *", async () => {
        console.log("⏰ Running reminder cron job...")

        try {
            const now = new Date()

            // find all applications with due reminders not yet sent
            const applications = await Application.find({
                "reminder.date": { $lte: now },
                "reminder.sent": false
            })

            for (const application of applications) {
                const user = await User.findById(application.userId)

                if (!user) continue

                await sendEmail({
                    email: user.email,
                    subject: `Reminder: Follow up on ${application.companyName}`,
                    mailgenContent: reminderMailgenContent(
                        user.username,
                        application.companyName,
                        application.role,
                        application.currentStatus
                    )
                })

                application.reminder.sent = true
                await application.save({ validateBeforeSave: false })

                console.log(`✅ Reminder sent for ${application.companyName} to ${user.email}`)
            }

        } catch (error) {
            console.error("❌ Cron job error:", error)
        }
    })
}

export { startReminderCron }