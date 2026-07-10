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

    // ACTUAL: ValidationError: Animal validation failed: legs:
    //  Cast to Number failed for value "{ years: 4 }" (type Object) at path "legs"
    await mongoose.disconnect();

}

run();