import express from "express"
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.routes.js";
import applicationRouter from "./routes/application.routes.js"
import interviewRouter from "./routes/interviewRound.routes.js"
import analyticsRouter from "./routes/analytics.routes.js"





const app = express();


//cors configuration
app.use(
    cors({
        origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// --- BASIC CONFIGURATIONS (Middleware) ---
// 1. Parse JSON data (e.g., from Postman or Thunder Client)
app.use(express.json({ limit: "16kb" }));

// 2. Parse URL-encoded data (e.g., from HTML forms)
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// 3. Serve static files (like images) from the 'public' folder
app.use(express.static("public"));

app.use(cookieParser())



//healthcheck
app.get("/api/v1/healthcheck", (req, res) => {
    res.status(200).json({ status: "ok" })
})

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/applications", applicationRouter)
app.use("/api/v1/applications", interviewRouter)
app.use("/api/v1/analytics", analyticsRouter)



app.get("/", (req, res) => {
    res.send("HELLO THERE")
})

//added this beacuse throw new api error message was not showing on frontend with err.response.data.message
 app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
   const message = err.message || "Internal Server Error";
    
   return res.status(statusCode).json({
       statusCode,
       message,
        success: false,
        errors: err.errors || []
     });
 });

export default app;