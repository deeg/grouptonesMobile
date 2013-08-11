$(document).ready(function() {
    $('#sendMessage').on('click', function(e) {
        var payload = {
            toId : $('#toId').val(),
            Subject : $('#Subject').val(),
            MessageBody : $('#MessageBody').val()
        };
        e.preventDefault();
        $.ajax({
            url: "/Message",
            type: "post",
            data: payload,
            success: function(response){
                console.log(response);
                window.location.reload();
            },
            error:function(){
                console.log('error');
            }
        });
    });
});