// SETUP BEGINS
require("dotenv").config();
const mongoUrl = process.env.MONGO_URL;

const express = require("express");
const cors = require("cors");

const ObjectId = require("mongodb").ObjectId;
const MongoUtil = require("./MongoUtil.js");

let app = express();

app.use(express.json());

app.use(cors());
// SETUP END

async function main() {
    db = await MongoUtil.connect(mongoUrl, "PianoSheet");
}

app.get("/" , async (req,res) =>{
    res.status(204)
    console.log('started succcess');
}
)

app.get("/get_all_sheet", async (req, res) => {
    let db = MongoUtil.getDB();

    try {
        let result = await db.collection("cover").find().toArray();
        res.status(200);
        res.send(result);
    } catch {
        res.status(500);
        res.send({
            error: "Internal server error. Please contact administrator"
        });
        console.log(e);
    }

})

app.post("/add_sheet", async (req, res) => {
    let db = MongoUtil.getDB();

    let sheet = req.body.sheet;

    try {
        let result = await db.collection("cover").insertOne(sheet);

        res.send(result);
    } catch {
        res.status(500);
        res.send({
            error: "Internal server error. Please contact administrator"
        });
        console.log(e);
    }

})



app.post("/sheet", async (req, res) => {
    let db = MongoUtil.getDB();

    try {
        let result = await db.collection("cover").findOne(
            {_id:ObjectId(req.body.id)}       
        )
        res.status(200);
        res.send(result);
    } catch {
        res.status(500);
        res.send({
            error: "Internal server error. Please contact administrator"
        });
        console.log(e);
    }

});



main();

// START SERVER
app.listen(3000, () => {
    console.log("Server has started");
});