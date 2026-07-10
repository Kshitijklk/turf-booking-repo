require('dotenv').config();
const mongoose = require('mongoose');

async function run() {
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;


    // ---- BLOCK14 : indexes before deleteMany ----

    // PREDICTION:
    // I think the collection has the default _id index and the unique name index.

    const r13 = await db.collection("lab").indexes();

    console.log("Indexes:", r13);

    // ACTUAL:Indexes: [
   // { v: 2, key: { _id: 1 }, name: '_id_' },
    //{ v: 2, key: { name: 1 }, name: 'name_1', unique: true }
      ]

    await mongoose.disconnect();

}
run();