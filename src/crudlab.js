require('dotenv').config();
const mongoose = require('mongoose');

async function run() {
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;


    // ---- BLOCK 4: deleteOne ----
    //since there are two objects with the name justin, i cannot set "name" as a unique index, hence execution of deletOne before insertMany 
    // PREDICTION:it will delete the first object named justin(since there are two), its id , name and n value
    const r4 = await db.collection('lab').deleteOne(
        {name: 'justin'});
    console.log('deleteOne:', r4);
    // ACTUAL:



    await mongoose.disconnect();
}


run();