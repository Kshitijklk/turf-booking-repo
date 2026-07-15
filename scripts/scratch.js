require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("../src/db");
const Customer = require("../src/models/customer.model");
const { encrypt, hashPhone } = require("../src/utils/crypto");

async function run() {
    await connectDB();

    await Customer.deleteMany({});

    const phone = "9876543210";

    const customer = await Customer.create({
        full_name: "John Doe",
        country_code: "+91",
        phone_number: encrypt(phone),
        phone_number_hash: hashPhone(phone),
        otp: 123456,
        otp_expiry: new Date(Date.now() + 5 * 60 * 1000)
    });

    console.log("Original OTP:", customer.otp);

    customer.otp = 654321;
    await customer.save();

    const updated = await Customer.findById(customer._id);

    console.log("Updated OTP:", updated.otp);

    await mongoose.disconnect();
}

run().catch(console.error);

// question 1)
// answer: A new OTP request overwrites the previous OTP in the customer document 
// if no new OTP is requested, the expired OTP remains stored even after its expiry time