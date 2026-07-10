require("dotenv").config();
const mongoose = require("mongoose");

async function run() {

    await mongoose.connect(process.env.MONGO_URI);

    const animalSchema = new mongoose.Schema({
        name: String,
        legs: Number
    });

    const Animal = mongoose.model("Animal", animalSchema);

    // ---- BLOCK  ----

    // PREDICTION:
    // Mongoose using type casting will convert the string "4"
    // into the Number 4 and save the document.

    const r2 = await Animal.create({
        name: "b",
        legs: "4"
    });

    console.log(r2);

    // ACTUAL:
    await mongoose.disconnect();

}

run();