if(typeof Register == 'undefined'){
    var Register = {};
}

Register = {
    submit: function(){
        var error = false;

        var password = $('#password').val();
        var confirmPassword = $('#confirmPassword').val();

        if(password != confirmPassword){
            error = true;
            $('.help-block[for=confirmPassword]').html('Passwords do not match');
            $('.help-block[for=confirmPassword]').parent().addClass('error');
            $('.help-block[for=confirmPassword]').removeClass('hidden');
        }




    },

    validateFields:function (){

    }
}