const express = require('express');
const hbs = require("hbs");
const wax = require("wax-on");
const MongoUtil = require("./MongoUtil.js");

require('dotenv').config()
async function main(){
let app = express();

app.set("view engine", "hbs");
app.use(express.static("public"));

wax.on(hbs.handlebars);
wax.setLayoutPath("./views/layouts");
app.use(express.urlencoded({ extended: false }));
//链接mongo
await MongoUtil.connect(process.env.MONGO_URL, 'cico');


//routes.各种渠道
app.get('/',function(req,res){
    res.send("<h1>Welcome to our page</h1>");
})

app.get('/contact-us',function(req,res){
    res.send("<h1>Contact us at 81235748</h1>");
})

app.get('/contact-us/:email',function(req,res){
    res.send("xxxx@gmail.com"+req.params.email);
})

app.get('/', function(req, res){
    res.render('index.hbs');
})

app.get('/addpiano_sheet', (req,res)=>{
    res.render('addpiano_sheet')
})

app.listen(3000,function(){
    console.log("server started")
})

}
main();
