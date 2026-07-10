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
    // Mongoose will ignore it.

    const r5 = await Animal.create({
        name: "e",
        legs: 4,
        color: "black"
    });

    console.log(r5);

    // ACTUAL: {
    // name: 'e',
    //   legs: 4,
    //     _id: new ObjectId('6a50c0885f658c0e4d79a2b5'),
    //       __v: 0
    //}

    await mongoose.disconnect();

}

run();