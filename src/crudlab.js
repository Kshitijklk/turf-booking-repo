require('dotenv').config();
const mongoose = require('mongoose');

async function run() {
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;


    // ---- BLOCK 8: updateOne with $set ---- 
    // PREDICTION: it will update the document with name "justin" and set the field n to 10.
    const r7 = await db.collection('lab').updateOne(
        { name: "justin" }, { $set: { n: 10 } }
    );


    console.log('updateOne:', r7);
    // ACTUAL: 

    await mongoose.disconnect();
}


run();