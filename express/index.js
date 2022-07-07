const express = require('express');
const hbs = require("hbs");
const wax = require("wax-on");
const MongoUtil = require("./MongoUtil.js");

require('dotenv').config()
async function main(){
let app = express();

app.use(express.json());

app.set("view engine", "hbs");
app.use(express.static("public"));

wax.on(hbs.handlebars);
wax.setLayoutPath("./views/layouts");
app.use(express.urlencoded({ extended: false }));
//链接mongo
await MongoUtil.connect(process.env.MONGO_URL, 'cico');


//routes.各种渠道
app.get('/', function(req, res){
    res.json({"test": "test"})
})

// route to get all covers

// route to post a cover

// route to update a cover

// route to delete a cover

app.get('/contact-us',function(req,res){
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
