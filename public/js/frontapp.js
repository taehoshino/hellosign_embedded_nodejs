const form = document.querySelector("form")
const messageOne = document.querySelector("#message-1")
const messageTwo = document.querySelector("#message-2")
const messageThree = document.querySelector("#message-3")


form.addEventListener("submit", (e)=>{

    e.preventDefault()

    switch (type){
        case "sign":
            var signer_name = document.querySelector("#signer-name")
            var signer_email = document.querySelector("#signer-email")
            var template_id = document.querySelector("#template-id")
            var fetchUrl = "http://localhost:5000/api?type="+type+"&signer_email="+signer_email.value+"&signer_name="+signer_name.value+"&template_id="+template_id.value 
            console.log(fetchUrl)           
            break
            
        case "send":
            var requester_email = document.querySelector("#requester-email")
            var signer_name = document.querySelector("#signer-name")
            var signer_email = document.querySelector("#signer-email")
            var template_id = document.querySelector("#template-id")
            var fetchUrl = "http://localhost:5000/api?type="+type+"&requester_email="+requester_email.value+"&signer_email="+signer_email.value+"&signer_name="+signer_name.value+"&template_id="+template_id.value    
            break
    
        case "template":
            var fetchUrl = "http://localhost:5000/api?type="+type    
            break
        
        default:
            console.log("Invalid type name!")
    } 

    messageOne.textContent = "Calling API..."
    messageTwo.textContent = ""
    messageThree.textContent = ""

    fetch(fetchUrl).then((response)=>{
        response.json().then((data)=>{
            if(data.error) {
                messageOne.textContent = data.error
            } else {
                messageOne.textContent = "Here is your " + urlType + " URL."
                messageTwo.textContent = data.url
                if (data.template_id) {
                    messageThree.textContent = "Template ID: " + data.template_id
                }
                
                const client = new HelloSign({
                    clientId: data.client_id
                    }); 
            
                client.open(data.url, {   
                    allowCancel: true,
                    testMode: true,
                    skipDomainVerification: true, 
                    debug: true
                    });
            
            }
        })
    })

})