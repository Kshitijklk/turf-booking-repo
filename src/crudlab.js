require('dotenv').config();
const mongoose = require('mongoose');

async function run() {
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;


    // ---- BLOCK 12: deleteOne ----

    // PREDICTION: I think deleteOne() will delete only one document.

    const r11 = await db.collection("lab").deleteOne({
        status: "temp"
    });

    console.log("deleteOne:", r11);

    // ACTUAL:deleteOne: { acknowledged: true, deletedCount: 1 }

    await mongoose.disconnect();

}
run();