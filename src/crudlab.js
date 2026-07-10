require('dotenv').config();
const mongoose = require('mongoose');

async function run() {
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;


    // ---- BLOCK 5: index implementation ---- 
    // PREDICTION:It will return an object with name 1
    const r5 = await db.collection('lab').createIndex(
        {name: 1},
        {unique: true}
    );
    console.log('createIndex:', r5);
    // ACTUAL:



    await mongoose.disconnect();
}


run();