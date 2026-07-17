require("dotenv").config();

const express = require("express");
const connectDB = require("./db");

const authRoutes = require("./routes/auth.routes");
const sportRoutes = require("./routes/sport.routes");

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});


app.use("/auth", authRoutes);
app.use("/sports", sportRoutes);

async function start() {
    await connectDB();

    app.listen(process.env.PORT, () => {
        console.log(`Server on port ${process.env.PORT}`);
    });
}

start();