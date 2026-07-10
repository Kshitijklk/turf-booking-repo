// require('dotenv').config();
// const mongoose = require('mongoose');

// async function run() {
//     await mongoose.connect(process.env.MONGO_URI);
//     const db = mongoose.connection.db;

//     // ---- BLOCK 16: drop ----

//     // PREDICTION:
//     // I think drop() will delete the entire collection

//     const r15 = await db.collection("lab").drop();

//     console.log("drop:", r15);

//     // ACTUAL: drop: true


//     await mongoose.disconnect();

// }
// run(); 


//====================================
//------funtions implemaentation-----
//====================================


require("dotenv").config();
const mongoose = require("mongoose");

// INSERT FUNCTION

async function insertUser(user) {
    const db = mongoose.connection.db;

    const result = await db.collection("lab").insertOne(user);

    return result;
}

// FIND FUNCTION

async function findUsers(filter) {
    const db = mongoose.connection.db;

    const result = await db.collection("lab")
        .find(filter)
        .toArray();

    return result;
}

//-------- UPDATE FUNCTION--------

async function updateUser(filter, update) {
    const db = mongoose.connection.db;

    const result = await db.collection("lab")
        .updateOne(filter, update);

    return result;
}


//---------- DELETE FUNCTION--------

async function deleteUser(filter) {
    const db = mongoose.connection.db;

    const result = await db.collection("lab")
        .deleteOne(filter);

    return result;
}


// -------MAIN FUNCTION---------

async function run() {

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected\n");

    
    //----------INSERT----------    
    const r1 = await insertUser({
        name: "Justin",
        age: 20
    });

    console.log("Insert Result:");
    console.log(r1);

    
    //---------- FIND-----------
    
    const r2 = await findUsers({
        name: "Justin"
    });

    console.log("\nFind Result:");
    console.log(r2);

    
    //---------- UPDATE----------
    
    const r3 = await updateUser(
        { name: "Justin" },
        {
            $set: {
                age: 25
            }
        }
    );

    console.log("\nUpdate Result:");
    console.log(r3);

    
    // ---------FIND AGAIN----------

    const r4 = await findUsers({
        name: "Justin"
    });

    console.log("\nAfter Update:");
    console.log(r4);

    // ---------DELETE----------
   
    const r5 = await deleteUser({
        name: "Justin"
    });

    console.log("\nDelete Result:");
    console.log(r5);

    
    await mongoose.disconnect();

}

run();



//output: PS D:\turf-booking> node src/crudlab.js
// ◇ injected env(2) from.env // tip: ⌘ multiple files { path: ['.env.local', '.env'] }
// MongoDB Connected

// Insert Result:
// {
//     acknowledged: true,
//         insertedId: new ObjectId('6a511e265ed1a80242c0616c')
// }

// Find Result:
// [
//     {
//         _id: new ObjectId('6a511e265ed1a80242c0616c'),
//         name: 'Justin',
//         age: 20
//     }
// ]

// Update Result:
// {
//     acknowledged: true,
//         modifiedCount: 1,
//             upsertedId: null,
//                 upsertedCount: 0,
//                     matchedCount: 1
// }

// After Update:
// [
//     {
//         _id: new ObjectId('6a511e265ed1a80242c0616c'),
//         name: 'Justin',
//         age: 25
//     }
// ]

// Delete Result:
// { acknowledged: true, deletedCount: 1 }
// PS D: \turf - boo