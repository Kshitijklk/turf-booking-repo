require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("../src/db");
const Customer = require("../src/models/customer.model");
const { encrypt } = require("../src/utils/crypto");

async function run() {
    await connectDB();


console.log(encrypt("9876543210"));
console.log(encrypt("9876543210"));

await Customer.create({
  full_name: "John Doe",
  country_code: "+91",
  phone_number: encrypt("9876543210")
});

await Customer.create({
  full_name: "Jane Doe",
  country_code: "+91",
  phone_number: encrypt("9876543210")
});
    await mongoose.disconnect();

}

run().catch(console.error);

// observations:
// 1) ecrypting the same plaintext ("9876543210") twice results in different ciphertexts each time
//  This is due to the use of a random IV in the encryption process, which
//   ensures that even if the same plaintext is encrypted multiple times, the 
//   output will be unique each time
// 2) the unique index didnt stop the insertion of duplicate phone numbers because the encrypted
//  values are different each time, even though the original plaintext is the same
//   This means that the unique index on the phone_number field in the database does not 
//   prevent duplicates based on the original plaintext value, only on the encrypted value
