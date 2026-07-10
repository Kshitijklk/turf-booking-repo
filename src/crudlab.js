require('dotenv').config();
const mongoose = require('mongoose');

async function run() {
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;


    // ---- BLOCK 10 : insertMany ----

    // PREDICTION:
    // I think three documents with status "temp" will be inserted.

    const r10 = await db.collection("lab").insertMany([
        { name: "A", status: "temp" },
        { name: "B", status: "temp" },
        { name: "C", status: "temp" }
    ]);


    console.log("insertMany:", r10);
    // ACTUAL:

    await mongoose.disconnect();

}
run();