// SETUP BEGINS
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;
const MongoUtil = require("./MongoUtil.js");

const mongoUrl = process.env.MONGO_URL;

let app = express();
// !! Enable processing JSON data
app.use(express.json());
// !! Enable CORS
app.use(cors());
// SETUP END
async function main() {
    let db = await MongoUtil.connect(mongoUrl, "PianoSheet");
}

main();
// START SERVER
app.listen(3000, () => {
    console.log("Server has started");
});

app.post("/free_food_sighting", async (req, res) => {
    // the document must have
    // description: a brief of description what the free food has
    // food: an array of short phrases (no more than 100 characters) about
    // what the free food has
    // datetime: when is it sighted (default to the NOW -- current date
    // time, must be the YYYY-MM-DD format)
    let description = req.body.description;
    let food = req.body.food;
    let datetime = new Date(req.body.datetime) || new Date();
    try {
        // tell mongo to insert the document
        let result = await db.collection("free_food_sightings").insertOne({
            description: description,
            food: food,
            datetime: datetime
        });
        res.status(200);
        res.send(result);
    } catch (e) {
        res.status(500);
        res.send({
            error: "Internal server error. Please contact administrator"
        });
        console.log(e);
    }
});


