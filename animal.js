require("dotenv").config();
const mongoose = require("mongoose");

async function run() {

    await mongoose.connect(process.env.MONGO_URI);

    const animalSchema = new mongoose.Schema({
        name: String,
        legs: Number
    });

    const Animal = mongoose.model("Animal", animalSchema);

    // ---- BLOCK 1 ----

    // PREDICTION:
    // The document will be created successfully cause both fields match the schema.

    const r1 = await Animal.create({
        name: "a",
        legs: 4
    });

    console.log(r1);

    // ACTUAL:{
    //name: 'a',
    //  legs: 4,
    //    _id: new ObjectId('6a50bbd4f70f106c515b1a75'),
    //__v: 0

    await mongoose.disconnect();

}

run();