require('dotenv').config();
const mongoose = require('mongoose');

async function run() {
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;

    // ---- BLOCK 16: drop ----

    // PREDICTION:
    // I think drop() will delete the entire collection

    const r15 = await db.collection("lab").drop();

    console.log("drop:", r15);

    // ACTUAL:

    await mongoose.disconnect();

}
run();