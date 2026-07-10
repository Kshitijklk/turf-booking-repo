require('dotenv').config();
const mongoose = require('mongoose');

async function run() {
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;


    // ---- BLOCK 6: insertMany with one violation ---- 
    // PREDICTION: it will insert the first 2 documents, ignore the document that violates the unique
    // constraint, and then insert the last 2 documents. It will return an object with the number of inserted documents and the ids of the inserted documents.
    const r5 = await db.collection('lab').insertMany([]
        { name: "maddie", n: 3 },
        { name: "travis", n: 4 },
        { name: "travis", n: 5 },
        { name: "rick", n: 6 },
        { name: "carl", n: 7 }
    
    ]);
    console.log('insertMany:', r5);
    // ACTUAL:



    await mongoose.disconnect();
}


run();