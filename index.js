const express = require("express");
const bodyparser  = require("body-parser");
const mongoose   = require("mongoose");
const dotenv   = require("dotenv");
const bodyParser = require("body-parser");

const app =express();
dotenv.config();

const port = process.env.PORT || 8000;


const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;

mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.sc79qgz.mongodb.net/registrationFormDB` ,{
    useNewUrlParser : true,
    useUnifiedTopology : true
});

const registrationSchema = new mongoose.Schema({
    name : String,
    email : String,
    passwoed : String
});

const registration = mongoose.model("registration", registrationSchema);
app.use(bodyParser.urlencoded ({ extended : true}));
app.use(bodyParser.json());
app.use(express.static('frontend'))

app.get("/", (req,res) => {
    res.sendFile(__dirname + "/frontend/index.html")
})

app.post("/register", async (req,res) => {
    try{
        const {name, email, password} = req.body;

        const existingUser = await registration.findOne({email : email})
        
        if(!existingUser){
            const registrationData = new registration({
                name,
                email,
                password
            });
            await registrationData.save(); 
            res.redirect("/success");
        }
        else{
            console.log('user already exists');
            res.redirect('/Exists')

        }
    }

    catch (error){
        console.log(error);
        res.redirect("/Error");
    }
})

app.get("/success", (req, res) =>{
    res.sendFile(__dirname+"/frontend/success.html");
})

app.get("/Error", (req, res) => {
    res.sendFile(__dirname+ "/frontend/error.html");
})

app.get("/Exists", (req, res) => {
    res.sendFile(__dirname+ "/frontend/Exists.html");
})


app.listen(port, ()=>{
    console.log(`server is running on port ${port}`);
})