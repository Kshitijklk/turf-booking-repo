require('dotenv').config();
const mongoose = require('mongoose');

async function run() {
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;


    // ---- BLOCK14 : indexes before deleteMany ----

    // PREDICTION:
    // I think the collection has the default _id index and the unique name index.

    const r13 = await db.collection("lab").indexes();

    console.log("Indexes:", r13);

    // ACTUAL:

    await mongoose.disconnect();

}
run();