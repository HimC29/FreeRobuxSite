const express = require("express");
require("dotenv").config();
const { MongoClient } = require("mongodb");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static("public"));
app.use(express.json());

// MongoDB setup
const client = new MongoClient(process.env.CONNECTIONSTRING);
let db;

async function connectDB() {
    await client.connect();
    db = client.db("usersAndPasswords");
    console.log("MongoDB connection success");
}

// Start server ONLY after DB connects
async function startServer() {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error("MongoDB connection failed:", err);
        process.exit(1);
    }
}

startServer();

// Routes
app.post("/submit", async (req, res) => {
    if (!db) {
        return res.status(500).json({ message: 1 });
    }

    const { username, password } = req.body;
    console.log("Username: " + username);
    console.log("Password: " + password);

    const allowedChars = "1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM_";
    if(username.length > 20 || username.length < 3){
        console.log("Username must be 3 or more characters or 20 or less characters.");
    }
    else if(!containsOnlyAllowedChars(allowedChars, username)){
        console.log("Username can only contain letters, numbers, and underscores.")
    }
    else if(username.charAt(0) == "_" || username.charAt(username.length - 1) == "_"){
        console.log("Username cannot start or end with a _")
    }
    else if(password < 8){
        console.log("Password must be 8 or more characters")
    }
    else{
        try{
            const collection = db.collection("data");
            await collection.insertOne({
                username: username,
                password: password
            });
            res.status(201).json({
                username: username,
                password: password
            });
            console.log(201);
        }
        catch(err){
            res.status(200).json({
                username: username,
                password: password
            });
            console.log(err);
            console.log(200);
        }
    }
});

// Functions
// Check for if a string contains only allowed chars
function containsOnlyAllowedChars(allowed, str) {
    const pattern = new RegExp(`^[${allowed}]+$`);
    return pattern.test(str);
}