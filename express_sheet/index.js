// SETUP BEGINS
require("dotenv").config();
const mongoUrl = process.env.MONGO_URL;
const ObjectId = require('mongodb').ObjectId;
const express = require("express");
const cors = require("cors");

const MongoUtil = require("./MongoUtil.js");
const { Decimal128 } = require("mongodb");
const { json } = require("stream/consumers");
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

app.put("/updatesheet", async (req, res) => {
    let db = MongoUtil.getDB();
    const sheet = req.body.sheet;
    const id = req.body.id;
    try {
        await sheet.findById(id,( updateSheet)=>{
           updateSheet.songName = newSongName
           updateSheet.save();
        })
            // {_id:ObjectId(req.body.id)}       
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

app.post("/reviews", async (req, res) => {
    let db = MongoUtil.getDB();
    let review= req.body.reviews;
   
    try {
        let result = await db.collection("cover").insertOne(review)
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
    let _limit = req.body.limit? req.body.limit:20;
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


app.post("/login",async (req,res)=>{ //takes in userEmail and password in body
    let db = MongoUtil.getDB();
    let result = await db.collection("user").find(
        { userEmail:req.body.userEmail},       
    ).toArray()
    if(result.length<1){
        res.send([false, {reason:'Email not fund'}])
        return
    }
    if(result[0].password !== req.body.password){
        res.send([false, {reason:'Wrong Password'}])
        return
    }
    
    res.status(200)
    res.send([true, {username:result[0].username,userEmail:result[0].userEmail,userNickName:result[0].userNickName}])
    return

})

app.post("/register",async (req,res)=>{ //takes in an user object in body
    let db = MongoUtil.getDB();
    let result = await db.collection("user").find(
        { userEmail:req.body.user.userEmail}       
    ).toArray()
    if(result.length>=1){
        res.send([false, {reason:'Email is registered'}])
        return
    }

    result = await db.collection("user").find(
        {username:req.body.user.username}       
    ).toArray()
    if(result.length>=1){
        res.send([false, {reason:'user name is registered'}])
        return
    }

    res.status(200)
    let respond = await db.collection("user").insertOne(req.body.user);
    res.send([true, JSON.stringify(respond)])
    return

})





main();

// START SERVER
app.listen(3000, () => {
    console.log("Server has started");
});