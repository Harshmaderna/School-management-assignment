import dotenv from "dotenv";
import express from "express";
import cors from "cors"
import sequelize from "./config/db.js";
import router from "./routes/schoolRoutes.js";


dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", router)

const PORT = process.env.PORT || 3000;

const dbConnect = async () => { 
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log("all models are synced successfully");
    console.log("database connected successfully");
  } catch (error) {
    console.log("Unable to connect database", error.message);
  }
  app.get("/", (req, res) => {
    res.send("backend running");
  });
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}; 

dbConnect()
