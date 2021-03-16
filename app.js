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
    const url = "xxxxx"
    const options = {
        method: "POST",
        auth: "xxxxx"
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
