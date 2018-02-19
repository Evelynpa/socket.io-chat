var socket = io.connect('http://localhost:3000',{'forceNew':true});

$(function () {
    var socket = io.connect();//http://34.227.11.223:3000
    $('#messageForm').submit(function (e) {
        socket.emit('chat message', $('#m').val());
        $('#m').val('');
        e.preventDefault();
    });

    // $('#userForm').submit(function (e) {
    //     socket.emit('new user', $('#username').val());
    //     $('#username').val('');
    //     e.preventDefault();
    // });
    var user = $('#username').val()
    socket.on('chat message', function (data) {
        $('#messages').append(`<li><b>${data.user} :</b>${data.msg}</li>`);
    });

    $('#userForm').submit(function (e) {
        socket.emit('new user', $('#username').val(), function (nickname) {
            console.log(nickname);
            if (nickname) {
                $('#userFormArea').hide();
                $('#messageArea').show();
            }
        });
        $('#username').val('');
        e.preventDefault();
    });

    socket.on('get users', function (data) {
        var html = '';
        for (var i = 0; i < data.length; i++) {
            html += '<li class="list-group-item">' + data[i] + '</li>';
        }
        $('#users').html(html);
    })

});