import dotenv from "dotenv"
import app from "./app.js"
import connectDB from "./db/database.js"

dotenv.config({
    path: "./.env"
})


const port = process.env.PORT;



connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`your application http://localhost:${port} is running successfully`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed", err);
    process.exit(1);
  });