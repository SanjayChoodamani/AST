import express from "express";
import bodyParser from "body-parser";
import ruleRoutes from './routes/rules.js'
import connectMongoDB from "./db/connectMongoDB.js";
import cors from "cors";

// Initialize app and middleware
const app = express();
app.use(bodyParser.json());

app.use(cors());

// Start server
const PORT = process.env.PORT || 3000;

//Middleware for rules
app.use('/api/rules', ruleRoutes);


// Database connection and server startup
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
    connectMongoDB(); // Connect to MongoDB
});

