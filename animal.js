require("dotenv").config();
const mongoose = require("mongoose");

async function run() {

    await mongoose.connect(process.env.MONGO_URI);

    const animalSchema = new mongoose.Schema({
        name: String,
        legs: Number
    });

    const Animal = mongoose.model("Animal", animalSchema);

    // ---- BLOCK 3----

    // PREDICTION:
    // "four" cannot be converted into a Number,
    // so Mongoose should throw an error.

    const r3 = await Animal.create({
        name: "c",
        legs: "four"
    });

    console.log(r3);

    // ACTUAL:


    await mongoose.disconnect();

}

run();