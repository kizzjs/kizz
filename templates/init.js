var request = new XMLHttpRequest();
request.onreadysatechange = function() {
    if(request.readyState === 4) {
        if(request.status === 200) {
            var response = request.responseText;
            console.log(response);
        }
    }
};
request.open('get', 'index.html');
request.send();