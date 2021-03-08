//start server
const express = require("express")
const app = express()

//lets heroku choose a port
app.listen(process.env.PORT || 3000, function(){
    console.log("Server is running on port 3000.");
})

//https api request
const https = require("https");

//body-parser for processing html input
app.use(express.urlencoded({extended: true}))

//access static files like css and images used in the html
app.use(express.static("public"))

//handle get request
app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html")   
})

//always make sure form has action and method POST
app.post("/", function(req,res){

    //take info from html form
    const firstName = req.body.firstname 
    const lastName = req.body.lastname
    const email = req.body.email
    
    //present data in JSON format for Mailchimp
    const data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }         
        }]
    }

    //flatten the data
    const jsonData = JSON.stringify(data)

    //post data to Mailchimp
    const url = "https://us1.api.mailchimp.com/3.0/lists/5f11c53985"
    const options = {
        method: "POST",
        auth: "evitaaa:e6bf656ed66bed4baa6ef938f63a1e89-us1"
    }
    //req has to be saved as a const so we can write jsonData with it
    const request = https.request(url, options, function(response){
        if(response.statusCode === 200){
            res.sendFile(__dirname + "/success.html")
        } else {
            res.sendFile(__dirname + "/failure.html")
        }
        response.on("data", function(data){
            //console.log(JSON.parse(data))
        })
    })

    //sending data through request
    request.write(jsonData)
    request.end()
})

//try again button redirects to home page
app.post("/failure", function(req, res){
    res.redirect("/")
})

// API KEY: e6bf656ed66bed4baa6ef938f63a1e89-us1
// LIST ID: 5f11c53985