require('dotenv').config();
const express = require('express');
const connectDB = require('./db');

const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

async function start() {
    await connectDB();
    app.listen(process.env.PORT, () => {
        console.log(`Server on port ${process.env.PORT}`);
    });
}

start();