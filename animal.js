require("dotenv").config();
const mongoose = require("mongoose");

async function run() {

    await mongoose.connect(process.env.MONGO_URI);

    const animalSchema = new mongoose.Schema({
        name: String,
        legs: Number
    });

    const Animal = mongoose.model("Animal", animalSchema);

    // ---- BLOCK 5----

    // PREDICTION:
    // color is not in the schema.
    // Mongoose should ignore it.

    const r5 = await Animal.create({
        name: "e",
        legs: 4,
        color: "black"
    });

    console.log(r5);

    // ACTUAL:

    await mongoose.disconnect();

}

run();