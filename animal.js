require("dotenv").config();
const mongoose = require("mongoose");

async function run() {

    await mongoose.connect(process.env.MONGO_URI);

    const animalSchema = new mongoose.Schema({
        name: String,
        legs: Number
    });

    const Animal = mongoose.model("Animal", animalSchema);

    // ---- BLOCK 4----

    // PREDICTION:
    // An object cannot be converted into a Number,
    // so Mongoose should throw a Error.

    const r4 = await Animal.create({
        name: "d",
        legs: {
            years: 4
        }
    });

    console.log(r4);

    // ACTUAL:
    await mongoose.disconnect();

}

run();