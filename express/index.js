const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');

// const {connect} = require('./MongoUtil');
const MongoUtil = require('./MongoUtil')

const ObjectId = require('mongodb').ObjectId;

const dotenv = require('dotenv').config();


// require in handlebars-helpers
const helpers = require('handlebars-helpers')({
    'handlebars': hbs.handlebars
})

const app = express();
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
  
    async function coverId(id) {
        let covers = await db.collection('covers').findOne({
            '_id': ObjectId(id)
        });
        return covers;
    }
    

    const db = await MongoUtil.connect(MONGO_URI, "tgc18_cico");
    app.get('/test', async function(req,res) {
     
        let data = await db.collection('listingsAndReviews').find({}).limit(10).toArray();
        res.send(data);
    });

    app.get('/', async function (req, res) {
        const allCovers = await db.collection('covers')
                                 .find({}) 
                                 .toArray();

        res.render('cover.hbs',{
            'covers': allCovers
        })
    })

  
    app.get('/add-cover', function(req,res){
        res.render('add-cover.hbs');
    })

    app.post('/add-cover', async function(req,res){
        let coverName = req.body.coverName;
        let coverAuthor = req.body.coverAuthor;
        let tags = getCheckboxValues(req.body.tags);

        let coverDocument = {
            'coverName': coverName,
            'coverAuthor': coverAuthor,
            'tags': tags
        };

        await db.collection('covers').insertOne(coverDocument);
        res.redirect("/");

    })

    app.get('/edit-cover/:id', async function(req,res){
        let id = req.params.id;
        let covers = await coverId(id);
        res.render('edit-cover', {
            'covers': covers
        });
    })

    app.post('/edit-cover/:id', async function(req,res){
        let id = req.params.id;
        let edittedCover = {
            'coverName': req.body.coverName,
            'coverAuthor': req.body.coverAuthor,
            'tags': getCheckboxValues(req.body.tags)
        }
     
        await db.collection('covers').updateOne({
            '_id': ObjectId(id)
        }, {
            '$set': edittedCover
        })
        res.redirect('/');
    })

    app.get('/delete-cover/:id', async function(req,res){
        let id = req.params.id;
        let covers = await coverId(id);
        res.render('delete-cover',{
            'covers': covers
        })
    })

    app.post('/delete-food/:id', async function(req,res){
        let id = req.params.id;
        await db.collection('covers').deleteOne({
            '_id':ObjectId(id)
        })
       res.redirect('/')
    })


        
main();


app.listen(3000, function () {
    console.log("hello world");
})











// const express = require('express');
// const hbs = require('hbs');
// const wax = require("wax-on");
// const MongoUtil = require("./MongoUtil.js");
// const ObjectId = require('mongodb').ObjectId;
// const axios = require('axios');
// require('dotenv').config()

// async function main(){

// let app = express();

// app.set('view engine', 'hbs');
// app.use(express.static('public'));

// app.use(express.json());

// wax.on(hbs.handlebars);
// wax.setLayoutPath("./views/layouts");
// app.use(express.urlencoded({ extended: false }));

// //链接mongo
// await MongoUtil.connect(process.env.MONGO_URL, 'cico');


// //routes.testing
// app.get('/', function(req, res){
//     res.json({"test": "test"})
// })

// // route to get all covers
// app.get('/all-cover', function(req,res){
//     res.json({})
// })

// // route to post a cover

// // route to update a cover

// // route to delete a cover

// /*app.get('/contact-us',function(req,res){
//     res.send("<h1>Contact us at 81235748</h1>");
// })

// app.get('/contact-us/:email',function(req,res){
//     res.send("xxxx@gmail.com"+req.params.email);
// })


// app.get('/addpiano_sheet', (req,res)=>{
//     res.render('addpiano_sheet')
// })


// app.listen(3000,function(){
//     console.log("server started")
// })

// }
// main();

}
