const {api_key, client_id} = require("./config")
const hellosign = require("hellosign-sdk")({key: api_key})
const chalk = require("chalk")


// Send signature request with file 
const send_signature_request = (email_address, callback) => {
    const options = {
        test_mode: 1,
        clientId: client_id, 
        subject: "Signature request from Nodejs", 
        message: "Please sign asap", 
        signers: [
            {
                email_address, 
                name: "Willy Williams"
            }
        ], 
        files: ["Test.pdf"]
    }

    hellosign.signatureRequest.createEmbedded(options).then(({signature_request})=>{
        const signature_id = signature_request.signatures[0].signature_id
        hellosign.embedded.getSignUrl(signature_id).then(({embedded})=>{
            console.log(chalk.blue.inverse("Sign URL: " + embedded.sign_url))
            callback(embedded.sign_url)
        }).catch((err)=>{
            console.log(chalk.yellow.bold(err))
        })
    })    
}

// Send signature request with template
const send_signature_request_with_template = (template_id, email_address, callback) => {
    const options = {
        test_mode: 1, 
        clientId: client_id, 
        template_id, 
        subject: "Signature request with template from Nodejs", 
        message: "Please sign asap", 
        signers: [
            {
                email_address, 
                name: "Willy Williams", 
                role: "Signer" 
            }
        ],
        custom_fields: 
        [
            {
                "name" : "FullName",
                "value": "William Williams"
            }, 
            {
                "name": "IsRegistered",
                "value" : true
            }
        ]
    }

    hellosign.signatureRequest.createEmbeddedWithTemplate(options).then(({signature_request}) => {
        const signature_id = signature_request.signatures[0].signature_id
        hellosign.embedded.getSignUrl(signature_id).then(({embedded})=>{
            console.log(chalk.blue.inverse("Sign URL: " + embedded.sign_url))
            callback(embedded.sign_url)
        })
    }).catch((err)=>{
        console.log(chalk.yellow.bold(err))
    })
}


// Create embedded template draft
const create_template_draft = (callback) => {
    const options = {
        test_mode: 1,
        clientId: client_id,  
        title: "Embedded template", 
        subject: "Embedded template created from NodeJS", 
        message: "This is a template", 
        signer_roles: [{name: "Signer"}],
        files: ["Test.pdf"],
        merge_fields: [
            {"name": "FullName", "type": "text"},
            {"name": "IsRegistered","type": "checkbox"}
        ]
    }

    const results = hellosign.template.createEmbeddedDraft(options).then(({template})=>{
        console.log(chalk.green.inverse("Template ID: " + template.template_id))
        console.log(chalk.blue.inverse("Edit URL: " + template.edit_url))
        callback(template.template_id, template.edit_url)
    }).catch((err)=>{
        console.log(chalk.yellow.bold(err))
    })
}


// Create embedded unclaimed draft with file
const create_unclaimed_draft = (email_address, callback) => {
    const options = {
        test_mode: 1,
        clientId: client_id,
        type: "request_signature", //The type of the draft. By default this is "request_signature", but you can set it to "send_document" if you want to self sign a document and download it.
        subject: "Embedded Unclaimed Draft", 
        requester_email_address: email_address, 
        files: ["Test.pdf"],
        is_for_embedded_signing: 0 // The request created from this draft will also be signable in embedded mode if set to 1. Defaults to 0.
    }

    hellosign.unclaimedDraft.createEmbedded(options).then(({unclaimed_draft}) => {
        console.log(chalk.green.inverse("Signature request ID: " + unclaimed_draft.signature_request_id))
        console.log(chalk.blue.inverse("Claim URL: " + unclaimed_draft.claim_url))
        callback(unclaimed_draft.claim_url)
    }).catch((err)=>{
        console.log(chalk.yellow.bold(err))
    })

}


// Create embedded unclaimed draft with template
const create_unclaimed_draft_with_template = (template_id, email_address, callback) => {
    const options = {
        test_mode: 1, 
        clientId: client_id, 
        template_id, 
        title: "Embedded Unclaimed Draft with Template", 
        requester_email_address: email_address, 
        signers: [{
            role: "Signer", 
            email_address: "SIGNER_EMAIL_ADDRESS", 
            name: "Willy Williams"
        }], 
        is_for_embedded_signing: 0
    }

    hellosign.unclaimedDraft.createEmbeddedWithTemplate(options).then(({unclaimed_draft}) => {
        console.log(chalk.green.inverse("Signature request ID: " + unclaimed_draft.signature_request_id))
        console.log(chalk.blue.inverse("Claim URL: " + unclaimed_draft.claim_url))
        callback(unclaimed_draft.claim_url)
    }).catch((err)=>{
        console.log(chalk.yellow.bold(err))
    })
}

module.exports = {
    send_signature_request,
    send_signature_request_with_template,
    create_template_draft, 
    create_unclaimed_draft, 
    create_unclaimed_draft_with_template
}
