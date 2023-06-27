App.controller('home', function (page) {
    // put stuff here

});

App.controller('create', function (page) {
    // put stuff here
});

try {
    App.restore();
} catch (err) {
    App.load('home');
}
//function to clear the input and textarea field after submit
function ClearFields() {
    document.getElementById("title").value = "";
    document.getElementById("content").value = "";
}

$(document).ready(function () {
    var rootUrl = 'https://puregemblog.000webhostapp.com';
    
    const url = `${rootUrl}/wp-json/wp/v2/posts`;
    
    var tokenUrl = `${rootUrl}/wp-json/jwt-auth/v1/token`;
    
    var adminDet = {
    username: "admin",
    password: "PureGem04.",
    };
    
    var token;
    loadData();
    
    $.post(tokenUrl, adminDet,
        function (data, status) {
        //console.log("token: " + data.token);
        token = data.token;
    });
    
    
    function loadData() {
        $.getJSON(url, function (data) {
            //console.log(data);

            
            $("#spinner").remove();
            
            $("#mainDiv").empty();
            
            for (var i = 0; i < data.length; i++) {
                var div = document.createElement('div');
                div.innerHTML = `
                <div class="card pt-1">
                    <div class="card-body">
                        <h4 class="card-title">${data[i].title.rendered}</h4>
                        <p class="card-text text-wrap">${data[i].content.rendered}</p>
                    </div>
                </div>`;
                $("#mainDiv").append(div);
            };
        });
    }
    
    $('form').submit(function (event) {
        
        event.preventDefault();
        var formData = {
            title: $('input[name=title]').val(),
            content: $('textarea[name=content]').val(),
            status: 'publish',
        };

        //console.log(formData);
        $.ajax({
            url: url,
            method: 'POST',
            data: JSON.stringify(formData),
            crossDomain: true,
            contentType: 'application/json',
            headers: {
            Authorization: 'Bearer ' + token
            },
            success: function (data) {
                //console.log(data);
                loadData();
            },
            error: function (error) {
                console.log(error);
            }
        });
        ClearFields();
    });
});
