// SETUP BEGINS
require("dotenv").config();
const mongoUrl = process.env.MONGO_URL;
const ObjectId = require('mongodb').ObjectId;
const express = require("express");
const cors = require("cors");

const MongoUtil = require("./MongoUtil.js");
const { Decimal128 } = require("mongodb");
let app = express();

app.use(express.json());


app.use(cors());
// SETUP END

async function main() {
    db = await MongoUtil.connect(mongoUrl, "PianoSheet");
}

app.get("/" , async (req,res) =>{
    res.status(204)
    res.send('server started')
    console.log('started succcess');
})

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

    }

})

app.post("/addSheet", async (req, res) => {
    let db = MongoUtil.getDB();
 
    let sheet = req.body.sheet;

    sheet.cover.cost = Decimal128(sheet.cover.cost)
    
    try {
        let result = await db.collection("cover").insertOne(sheet);
        res.send(result);
    } catch {
        res.status(500);
        res.send({
            'error': "Internal server error. Please contact administrator"
        });
    }

})



app.post("/deletesheet", async (req, res) => {
    let db = MongoUtil.getDB();

    try {
        let result = await db.collection("cover").deleteOne(
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


app.post("/getSheetById", async (req, res) => {
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

})

app.post("/getSheet", async (req, res) => {
    let db = MongoUtil.getDB();

    let _keyword = req.body.keyword;
    let _limit = req.body.limit? req.body.limit:5;
    let _difficulty = req.body.difficulty;
    let _maxCost = req.body.maxCost;

    const query = { $and:[{$text: { $search: _keyword }}]};

    if(_difficulty){
        query.$and.push({'cover.difficulty': _difficulty })
    }
    if(_maxCost){
        query.$and.push({ 'cover.cost': { $lte: _maxCost } })
    }
    
    try {
        let result = await db.collection("cover").find(
            query       
        ).limit(_limit).toArray()
        res.status(200);
        res.send(result);
    } catch {
        res.status(500);
        res.send({
            error: "Internal server error. Please contact administrator"
        });
    }

})





main();

// START SERVER
app.listen(3000, () => {
    console.log("Server has started");
    const query = { $and:[{$text: { $search: 'hello' }}]}
    query.$and.push({'cover.difficulty': 'easy' })
    console.log(query)
});