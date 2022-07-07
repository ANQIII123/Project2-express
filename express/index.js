const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');
const {connect} = require('./MongoUtil')

const MongoClient = require('mongodb').MongoClient;
const dotenv = require('dotenv').config();

console.log(process.env);


const app = express();
app.set('view engine', 'hbs'); 
wax.on(hbs.handlebars); 
wax.setLayoutPath('./views/layouts');

const MONGO_URI = process.env.MONGO_URI;

async function connect(mongoUri, dbName) {        //to make this reusable！

    const client = await MongoClient.connect(mongoUri, {
        "useUnifiedTopology": true 
    })

    const db = client.db(dbName);
    return db;
}

async function main() {

    const db = connect(MONGO_URI, "sample_airbnb");
    app.get('/test', async function(req,res) {
        let data = await db.collection('listingsAndReviews').find({}).limit(10).toArray();
       res.send(data);
                 
    })

    app.get('/', function (req, res) {
        res.render('hello.hbs')
    })
}
main();


app.listen(3000, function () {
    console.log("hello world");
})

















/*const express = require('express');
const hbs = require('hbs');
const wax = require("wax-on");
const MongoUtil = require("./MongoUtil.js");
const ObjectId = require('mongodb').ObjectId;
const axios = require('axios');
require('dotenv').config()

async function main(){

let app = express();

app.set('view engine', 'hbs');
app.use(express.static('public'));

app.use(express.json());

wax.on(hbs.handlebars);
wax.setLayoutPath("./views/layouts");
app.use(express.urlencoded({ extended: false }));

//链接mongo
await MongoUtil.connect(process.env.MONGO_URL, 'cico');


//routes.testing
app.get('/', function(req, res){
    res.json({"test": "test"})
})

// route to get all covers
app.get('/all-cover', function(req,res){
    res.json({})
})

// route to post a cover

// route to update a cover

// route to delete a cover

/*app.get('/contact-us',function(req,res){
    res.send("<h1>Contact us at 81235748</h1>");
})

app.get('/contact-us/:email',function(req,res){
    res.send("xxxx@gmail.com"+req.params.email);
})


app.get('/addpiano_sheet', (req,res)=>{
    res.render('addpiano_sheet')
})


app.listen(3000,function(){
    console.log("server started")
})

}
main();
*/