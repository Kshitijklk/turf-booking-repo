
require("dotenv").config();

const jwt = require("jsonwebtoken");

const token = jwt.sign(
    {
        sub: "123456789",
        role: "owner"
    },
    process.env.JWT_ACCESS_SECRET,
    {
        expiresIn: "10s"
    }
);

console.log(token);