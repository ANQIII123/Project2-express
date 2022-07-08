const express = require('express');

const hbs = require('hbs');
const wax = require('wax-on');
const MongoUtil = require('./MongoUtil')
const ObjectId = require('mongodb').ObjectId;
const dotenv = require('dotenv').config();

// require in handlebars-helpers
const helpers = require('handlebars-helpers')({
    'handlebars': hbs.handlebars
})


let app = express();

app.listen(3000, ()=>{
    console.log("Server started")
})

app.set('view engine', 'hbs');
wax.on(hbs.handlebars);  
wax.setLayoutPath('./views/layouts');

app.use(express.urlencoded({
    extended: false
}));

const MONGO_URI = process.env.MONGO_URI;

function getCheckboxValues(rawTags) {
    let tags = [];
    if (Array.isArray(rawTags)) {
        tags = rawTags;
    } else if (rawTags) {
        tags = [ rawTags ];
    }
    return tags;
}


async function main() {

    async function ObjectId(id) {
        let covers = await db.collection('covers').findOne({
            '_id': ObjectId(id)
        });
        return covers;
    }
    
    const db = await MongoUtil.connect(MONGO_URI, "PianoSheet");

    app.get('/cover', async function(req,res) {
     
        let data = await db.collection('cover').find({}).limit(2).toArray();
        res.send(data);
    });

    app.get('/', function(req,res){
        res.send("<h1>Express testing123</h1>");
    })


    // app.get('/',async function(req,res) {
    //   res.send(<h1>"Express test"</h1>)
    // })
    // app.get('/',async function(req,res){
    //     const allCovers = await db.collection('cover')
    //     res.render('cover.hbs'),{
    //   'cover':allCovers
    //     }
    // })

    // app.get('/add-cover', function(req,res){
    //     res.render('add-cover.hbs');
    // })

    // app.post('/add-cover', async function(req,res){
    //     let songName = req.body.songName;
    //     let coverComposer = req.body.coverComposer;
    //     let tags = getCheckboxValues(req.body.tags);

    //     let coverDocument = {
    //         'songName': songName,
    //         'coverComposer': coverComposer,
    //         'tags': tags
    //     };

    //     await db.collection('covers').insertOne(coverDocument);
    //     res.redirect("/");
//})
}

main();
