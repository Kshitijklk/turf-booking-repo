require('dotenv').config();
const mongoose = require('mongoose');

async function run() {
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;


    // ---- BLOCK 15: deleteMany ----

    // PREDICTION:
    // i predict deleteMany({}) will remove all documents leaving the colection exmpty

    const r14 = await db.collection("lab").deleteMany({});

    console.log("deleteMany:", r14);

    // ACTUAL:

    await mongoose.disconnect();

}
run();