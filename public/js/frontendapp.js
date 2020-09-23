const url_list = [sign_url, edit_url, claim_url]; 
console.log(url_list);
console.log(client_id);

for (var i=0; i<url_list.length; i++) {
    console.log(i);
    if (url_list[i].includes("https://")) {
        var send_url = url_list[i]; 
        break; 
    }
}
send_url = send_url.replace(/&amp;/g, "&")

$(document).ready(function(){
    
    // $('.submenu h3').on('click', function(){
    //     $(this).next().toggleClass('hidden');
    // });

    // var li = document.createElement('li');
    var headerElem = document.createElement('h5')
    var btn = $('<input/>').attr({type: 'button', id: 'btnRender'});

    if (i===0){
        headerElem.textContent = "You have received signature request!";
        btn.attr({value: "Sign Now!"});
    } else if (i===1) {
        headerElem.textContent = "You can create template!";
        btn.attr({value: "Create Template Now!"});
    } else {
        headerElem.textContent = "You can send signature request!";
        btn.attr({value: "Send Request Now!"});
    }
    $('.main-content').append(headerElem);
    $('.main-content').append(btn);

    $('#btnRender').click(function(){
        const client = new HelloSign({
        clientId: client_id
        }); 

    client.open(send_url, {   
        allowCancel: true,
        testMode: true,
        skipDomainVerification: true, 
        debug: true
        });

    })

});


