const express = require("express");
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");//to go up one level (to the parent directory).


const app = express();

app.listen(8080, () => {
    console.log("server is listening to port 8080");
});


main().then(() => {
    console.log("connected to db");
    initDb(); // move inside to ensure DB is ready
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wandererlust');
}

const initDb = async () => {
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({
        ...obj,
        owner:"685558b65d3509ae7722564a",
    }))
    await Listing.insertMany(initData.data);
    console.log("data was initialised");
};
