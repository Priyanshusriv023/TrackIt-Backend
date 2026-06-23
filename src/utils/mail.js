import Mailgen from "mailgen"
import nodemailer from "nodemailer"


const sendEmail = async (options)=> {
       const mailGenerator = new Mailgen({
        theme: "default",
        product: {
        name: "TrackIt",
        link: "https://trackit.vercel.app", 
    }
     })

        const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent);
        const emailHTML = mailGenerator.generate(options.mailgenContent);

        const Transporter = nodemailer.createTransport({
                 host: process.env.MAILTRAP_SMTP_HOST,
                 port: process.env.MAILTRAP_SMTP_PORT,

                 auth: {
                     user: process.env.MAILTRAP_SMTP_USER,
                     pass: process.env.MAILTRAP_SMTP_PASS
                 }
        })

        const mail = {
             from: "webinoxabc@gmail.com",
             to: options.email,
             subject: options.subject,
             text: emailTextual,
             html: emailHTML,
        }

        try{
            await Transporter.sendMail(mail);
        }
        catch(error){
             console.error("mail service failed")
             console.error("😒ERROR:",error)
        }
}



const emailVerificationMailgenContent = (username, verificationUrl) => {
    return {
        body: {
            name: username,
            intro: "Welcome to TrackIt! Start tracking your job applications in one place.",
            action: {
                instructions: "Please verify your email to get started:",
                button: {
                    color: "#4F46E5",
                    text: "Verify Email",
                    link: verificationUrl
                }
            },
            outro: "If you didn't create a TrackIt account, you can safely ignore this email."
        }
    }
}

const forgotPasswordMailgenContent = (username, passwordResetUrl) => {
    return {
        body: {
            name: username,
            intro: "You requested a password reset for your TrackIt account.",
            action: {
                instructions: "Click the button below to reset your password. This link expires in 20 minutes:",
                button: {
                    color: "#4F46E5",
                    text: "Reset Password",
                    link: passwordResetUrl
                }
            },
            outro: "If you didn't request this, please ignore this email. Your password won't change."
        }
    }
}

export {
    emailVerificationMailgenContent,
    forgotPasswordMailgenContent,
    sendEmail,
}