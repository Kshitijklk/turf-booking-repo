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
        full_name: "John williams",
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

// questio 2)
// Every OTP request writes to the Customer document, while authenticated requests
//  frequently read the same document 
// this mixes high - frequency writes with frequent reads on the same collection

// At around 100 users, this has little impact at a 100,000 + users, it can reduce performance because
// the customer collection 
// is handling both temporary OTP updates and regular customer readseparating OTPs into their own collection keeps customer data mostly read - only while
//  OTP data handles the rewrites independently

// question 3)
// the otp collection is designed to store only one oto at the time This may not be the behaviour we
// want because  the first OTP was still valid when it was sent, but it no longer works after being
//  overwritten

// This behaviour happens because the data model stores only one OTP in the customer document 
// every new OTP replaces the previous one

// question 4)
// creating a half built record fills the databsase with unneccessary data A better solution is to 
//  a separate OTP collection.The OTP is stored there temporarily after the user verifies the OTP, 
//  the customer account can be created with complete information if the user never verifies, the 
//  OTP record can simply expire and be deleted automatically