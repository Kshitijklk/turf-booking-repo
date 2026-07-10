require('dotenv').config();
const mongoose = require('mongoose');

async function run() {
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;


    // ---- BLOCK 10: returnDocument ----
    // PREDICTION: { returnDocument: 'after' } will first update the document and then return the updated value
    const r9 = await db.collection("lab").findOneAndUpdate(
        { name: "justin" },
        { $set: { n: 300 } },
        { returnDocument: 'before' }
    );

    console.log("returnDocument:", r9);
    // ACTUAL: returnDocument: { _id: new ObjectId('6a50806720e08eea7d262102'),   name: 'justin',  n: 20 }
    await mongoose.disconnect();


}
run();