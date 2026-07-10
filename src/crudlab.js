require('dotenv').config();
const mongoose = require('mongoose');

async function run() {
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;


    // ---- BLOCK 10: returnDocument ----
    // PREDICTION: { returnDocument: 'after' } will first update the document and then return the updated value
    const r9 = await db.collection("lab").findOneAndUpdate(
        { name: "justin" },
        { $set: { n: 20 } },
        { returnDocument: 'after' }
    );

    console.log("returnDocument:", r9);
    // ACTUAL: 
    await mongoose.disconnect();


}
run();