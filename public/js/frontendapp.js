const url_list = [sign_url, edit_url, claim_url]; 
console.log(url_list);
console.log(client_id);

for (var i=0; i<url_list.length; i++) {
    console.log(i);
    if (url_list[i].includes("https://")) {
        send_url = url_list[i]; 
        break; 
    }
}
send_url = send_url.replace(/&amp;/g, "&")

$(document).ready(function(){
    
    $('.submenu h3').on('click', function(){
        $(this).next().toggleClass('hidden');
    });

    var li = document.createElement('li');
    var btn = $('<input/>').attr({type: 'button', id: 'btnRender'});

    if (i===0){
        li.textContent = "Signature request - Sign URL: " + send_url; 
        btn.attr({value: "Sign Now!"});
    } else if (i===1) {
        li.textContent = "Create template - Edit URL: " + send_url; 
        btn.attr({value: "Create Template Now!"});
    } else {
        li.textContent = "Unclaimed draft - Claim URL: " + send_url; 
        btn.attr({value: "Send Request Now!"});
    }
    document.getElementById('list').appendChild(li);
    $('#list').append(btn);

    $('#btnRender').click(function(){
        const client = new HelloSign({
        clientId: client_id
        }); 

    client.open(send_url, {   
        allowCancel: true,
        testMode: true,
        skipDomainVerification: true, 
        debug: true
        // container: document.getElementById("signatureContainer")
        });

    })

});


