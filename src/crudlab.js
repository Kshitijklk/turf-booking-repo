require('dotenv').config();
const mongoose = require('mongoose');

async function run() {
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;
    // ---- BLOCK 1: insertOne ----
    // PREDICTION: the returned object conatains object with an ack,
    //  a unique ID, given name and n value
    const r1 = await db.collection('lab').insertOne(
        {
            name: 'justin',
            n: 2
        });
    console.log('insertOne:', r1);
    // ACTUAL: 

    await mongoose.disconnect();
}

run();