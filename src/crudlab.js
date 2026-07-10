require('dotenv').config();
const mongoose = require('mongoose');

async function run() {
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;


    // ---- BLOCK 7: insertMany with ordered: false ---- 
    // PREDICTION: with ordereed:false now it might insert the first 2 documents, ignore the document that violates the unique
    // constraint, and then insert the last 2 documents. 
    const r6 = await db.collection('lab').insertMany([
        { name: "maddie", n: 3 },
        { name: "travis", n: 4 },
        { name: "travis", n: 5 },
        { name: "rick", n: 6 },
        { name: "carl", n: 7 }

    ], { ordered: false });
    console.log('insertMany:', r6);
    // ACTUAL: it threw an error and did not insert the first three cause 1nd and 2nd were already in the 
    //collection and the third was a dupe. It did insert the last two documents.

    await mongoose.disconnect();
}


run();