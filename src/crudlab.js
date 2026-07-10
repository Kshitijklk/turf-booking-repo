require('dotenv').config();
const mongoose = require('mongoose');

async function run() {
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;


    // ---- BLOCK 10 : insertMany ----

    // PREDICTION:
    // I think three documents with status "temp" will be inserted.

    const r10 = await db.collection("lab").insertMany([
        { name: "A", status: "temp" },
        { name: "B", status: "temp" },
        { name: "C", status: "temp" }
    ]);


    console.log("insertMany:", r10);
    // ACTUAL:insertMany: { acknowledged: true, insertedCount: 3,insertedIds: {'0': new ObjectId('6a50a2fc76a2de310aa2beb2'),'1': new ObjectId('6a50a2fc76a2de310aa2beb3'),'2': new ObjectId('6a50a2fc76a2de310aa2beb4')}
      }

    await mongoose.disconnect();

}
run();