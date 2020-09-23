// require modules
const http = require("http")
const express = require("express")
const morgan = require("morgan")
const path = require("path")
const chalk = require("chalk")
const {send_signature_request, send_signature_request_with_template, create_template_draft, create_unclaimed_draft, create_unclaimed_draft_with_template} = require("./request")
const {client_id, signer_email, requester_email, template_id} = require("./config")
const { title } = require("process")
const { sign } = require("crypto")

// assign variables to user input
const command = process.argv[2]
const opt = process.argv[3]

// instantiate express
const app = express()

// use logger
app.use(morgan("combined"))

// set templates folder
app.set("views", path.join(__dirname, "../templates"))

// setup static directory to serve
app.use(express.static(path.join(__dirname, "../public")))

// set view engine
app.set("view engine", "ejs")

// iniitialize urls
var sign_url = undefined
var edit_url = undefined
var claim_url = undefined

const funcRender = (sign_url, edit_url, claim_url) => {
    app.get("/", (req, res)=>{
        return res.render("index", {
            client_id, 
            sign_url, 
            edit_url, 
            claim_url,
            title: "API Request Options", 
            message: "This is Hellosign Embedded API testing tool!"
        })
    })
}

// call functions based on user input
if (command === "send") {
    if (opt === "template") {
        send_signature_request_with_template(template_id, signer_email, (sign_url = undefined)=>{
            funcRender(sign_url, edit_url, claim_url)
        })

    } else {
        send_signature_request(signer_email, (sign_url = undefined)=>{
            funcRender(sign_url, edit_url, claim_url)
        })
        
    }

} else if (command === "unclaimed") {
    if (opt === "template") {
        create_unclaimed_draft_with_template(template_id, requester_email, (claim_url = undefined)=>{
            funcRender(sign_url, edit_url, claim_url)
        })

    } else {
        create_unclaimed_draft(requester_email, (claim_url = undefined)=>{
            funcRender(sign_url, edit_url, claim_url)
        })
        
    }

} else if (command === "template") {
    create_template_draft((template_id = undefined, edit_url = undefined)=>{
        funcRender(sign_url, edit_url, claim_url)
    })
    
} else {
    console.log(chalk.red.inverse("Invalid command value!"))
    funcRender(sign_url, edit_url, claim_url)
}

// Resouces page
app.get("/resources", (req, res)=>{
    res.render("resources", {
        title: "Learning Resources",
        message: "Here are some useful links." 
    })

})

// instantiate local server at port 5000
const server = http.createServer(app)
server.listen(5000)
