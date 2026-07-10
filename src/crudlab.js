require('dotenv').config();
const mongoose = require('mongoose');

async function run() {
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;


    // ---- BLOCK 9: updateOne without $set ---- 
    // PREDICTION: it will update the document with name "justin" and set the field n to 10.
    const r8 = await db.collection('lab').updateOne(
        { name: "justin" }, {{ n: 10 } }
    );


console.log('updateOne:', r8);
// ACTUAL: 
await mongoose.disconnect();
}


run();