if(typeof Register == 'undefined'){
    var Register = {};
}

Register = {
    submit: function(){
        var artist = {}

        artist.email = $('#email').val();
        artist.name = $('#name').val();
        artist.password = $('#password').val();
        artist.location = $('#location').val();

        $.ajax({
            url: "/registerArtist",
            type: "post",
            data: artist,
            success: function(response){
                console.log(response);
            },
            error:function(){
                $('.statusMessage').addClass('error');
                $('.statusMessage').html('There was an error with registration. Please try again, or contact the administrator.');
            }
        });



    },

    validateEmailFree:function (){
        $('#submitButton').attr('disabled');
        //Clear errors
        Register.clearErrors();

        var email = $('#email').val();
        var $emailHelpBlock = $('.help-block[for=email]');

        if(email){
            //Validate email not already used in DB
            $.ajax({
                url: "/verifyEmailFree?email=" + email,
                type: "get",
                success: function(response){
                    if(response.emailFree){
                        Register.validateFields();
                    }else{
                        $emailHelpBlock.html('Email already registered. Please chose a different email address.');
                        $emailHelpBlock.parent().addClass('error');
                        $emailHelpBlock.removeClass('hidden');
                        $('#submitButton').removeAttr('disabled');
                    }
                },
                error:function(){
                    $('.statusMessage').addClass('error');
                    $('.statusMessage').html('There was an error with registration. Please try again, or contact the administrator.');
                }
            });
        }else{
            $emailHelpBlock.html('You must enter a valid email address');
            $emailHelpBlock.parent().addClass('error');
            $emailHelpBlock.removeClass('hidden')
        }


    },

    validateFields:function(){
        var error = false;

        var password = $('#password').val();
        var confirmPassword = $('#confirmPassword').val();

        //Verify that passwords match
        if(password != confirmPassword){
            error = true;
            var $passwordHelpBlock = $('.help-block[for=confirmPassword]');
            $passwordHelpBlock.html('Passwords do not match');
            $passwordHelpBlock.parent().addClass('error');
            $passwordHelpBlock.removeClass('hidden');
        }

        var $accept = $('#privacyPolicy');

        if(!$accept.is(':checked')){
            error = true;
            var $acceptHelpBlock = $('.help-block[for=privacyPolicy]');
            $acceptHelpBlock.html('You must accept the privacy policy in order to register');
            $acceptHelpBlock.parent().addClass('error');
            $acceptHelpBlock.removeClass('hidden');
        }

        if(!error){
            Register.submit();
        }else{
            $('#submitButton').removeAttr('disabled');
        }
    },

    clearErrors:function(){
        var $helpBlock = $('.help-block');

        $helpBlock.html();
        $helpBlock.parent().removeClass('error');
        $helpBlock.addClass('hidden');
    }
}