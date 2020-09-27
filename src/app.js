// require modules
const http = require("http")
const express = require("express")
const morgan = require("morgan")
const path = require("path")
const {send_signature_request, send_signature_request_with_template, create_template_draft, create_unclaimed_draft, create_unclaimed_draft_with_template} = require("./request")
const {client_id} = require("./config")


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


// Index page
app.get("", (req, res)=>{
    res.render("index", {
    })
})

// API page
app.get("/api", (req, res)=>{

    switch (req.query.type) {
        case "sign":
            if (!req.query.signer_email || !req.query.signer_name) {
                res.send({
                    error: "Please provide signer information."
                })
            } else if (req.query.template_id) {
                send_signature_request_with_template(req.query.template_id, req.query.signer_email, req.query.signer_name, (sign_url = undefined)=>{
                    res.send({client_id, url: sign_url})
                })
        
            } else {
                send_signature_request(req.query.signer_email, req.query.signer_name, (sign_url = undefined)=>{
                    res.send({client_id, url: sign_url})
                })
        
            }
            break
        
        case "send":
            if (!req.query.requester_email || !req.query.signer_email || !req.query.signer_name) {
                res.send({
                    error: "Please provide requester and signer information!"
                })
            } else if (req.query.template_id) {
                create_unclaimed_draft_with_template(req.query.template_id,req.query.requester_email,req.query.signer_email,req.query.signer_name,(claim_url=undefined)=>{
                    res.send({client_id, url: claim_url})
                })
            } else {
                create_unclaimed_draft(req.query.requester_email,req.query.signer_email,req.query.signer_name,(claim_url=undefined)=>{
                    res.send({client_id, url: claim_url})
                })
            }
            break

        case "template":
            create_template_draft((template_id,edit_url)=>{
                res.send({client_id, template_id, url: edit_url})
            })

        default:
            console.log("Invalid type name!")
    }
})

// Sign page 
app.get("/sign", (req, res)=>{
    res.render("sign", {
    })
})

// Send page 
app.get("/send", (req, res)=>{
    res.render("send", {
    })
})

// Template page 
app.get("/template", (req, res)=>{
    res.render("template", {
    })
})

// Resouces page
app.get("/resources", (req, res)=>{
    res.render("resources", {
    })

})

// instantiate local server at port 5000
const server = http.createServer(app)
server.listen(5000)
