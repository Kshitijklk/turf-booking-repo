require('dotenv').config();
const mongoose = require('mongoose');

async function run() {
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;


    // ---- BLOCK 9: updateOne without $set ---- 
    // PREDICTION: it will execute the find order and return the document and then update the document
    const r = await db.collection("lab").findOneAndUpdate(
        { name: "justin" },
        { $set: { n: 10 } }
    );

    console.log("findOneAndUpdate:", r);
    // ACTUAL: 
    await mongoose.disconnect();


}
run();