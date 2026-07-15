const otpSchema = new mongoose.Schema({

    phone_number_hash: { type: String, required: true, index: true },

    otp_hash: { type: String, required: true },

    attempts: { type: Number, default: 0 },

    expires_at: { type: Date, required: true },

}, { timestamps: true });

otpSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Otp', otpSchema);

// observations re-written:
// question 1) With a separate Otp collection, expired OTPs are automatically deleted using MongoDB's TTL index
//  this keeps the database clean because old OTPs are removed without manual cleanup
//   However, the application must still check whether expires_at is greater than the 
//   current time during verification because the TTL deletion runs in the background 
//   and is not immediate

//   question 2) Every OTP request now writes only to the Otp collection instead of updating the Customer document 
//   the Customer collection stores only permanent customer information and is mainly used for reading
//   this reduces unnecessary writes to customer records and improves performance as the number of
//    users grows

//    question 3) With a separate Otp collection, the data model no longer forces only one OTP to exist 
//    the application can decide whether to allow one active OTP or multiple OTPs 
//    this gives more flexibility and lets the developer choose the required behaviour instead of 
//    being limited by the customer schema

//    question 4) A new user can request an OTP even if no customer record exists the OTP is stored in the
//     Otp collection, and the customer account is created only after successful OTP verification 
//     if the user never verifies the OTP, the OTP document is automatically deleted by the TTL index
//     , preventing incomplete or unnecessary customer records from being stored