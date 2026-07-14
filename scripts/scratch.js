require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("../src/db");
const Customer = require("../src/models/customer.model");

async function run() {
    await connectDB();

    // Build the indexes (run once for this exercise)
    await Customer.syncIndexes();

    await Customer.create({
        full_name: "Test One",
        country_code: "+91",
        phone_number: "9876543210"
    });

    try {
        await Customer.create({
            full_name: "Test Two",
            country_code: "+91",
            phone_number: "9876543210"
        });
    } catch (err) {
        console.log(err.code);
        console.log(err.name);
    }

    await mongoose.disconnect();
}

run();