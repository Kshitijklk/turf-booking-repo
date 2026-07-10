require('dotenv').config();
const mongoose = require('mongoose');

async function run() {
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;


    // ---- BLOCK : findOne ----
    // PREDICTION:it will return the first object named justin(since there are two), its id =, name and n value
    const r3 = await db.collection('lab').findOne(
        {name: 'justin'});
    console.log('findOne:', r3);
    // ACTUAL: 



    await mongoose.disconnect();
}


run();