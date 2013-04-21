if(typeof Register == 'undefined'){
    var Register = {};
}

Register = {
    ARTIST:{},

    submit: function(){
        Register.ARTIST.name = $('#name').val();

        $.ajax({
            url: "/registerArtist",
            type: "post",
            data: Register.ARTIST,
            success: function(response){
                window.location = "/";
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

        Register.ARTIST.email = $('#email').val();
        var $emailHelpBlock = $('.help-block[for=email]');

        if(Register.ARTIST.email){
            //Validate email not already used in DB
            $.ajax({
                url: "/verifyEmailFree?email=" + Register.ARTIST.email,
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

        Register.ARTIST.password = $('#password').val();
        var confirmPassword = $('#confirmPassword').val();

        //Verify that passwords match
        if(Register.ARTIST.password != confirmPassword){
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
            Register.getGeoLocation();
        }else{
            $('#submitButton').removeAttr('disabled');
        }
    },

    getGeoLocation:function(){
        Register.ARTIST.streetAddress = $('#streetAddress').val();
        Register.ARTIST.country = $('#country').val();
        Register.ARTIST.city = $('#city').val();
        Register.ARTIST.state = '';
        if($('#state:visible').size() > 0){
            Register.ARTIST.state = $('#state').val();
        }

        var url = 'http://maps.googleapis.com/maps/api/geocode/json?address=' + encodeURI(Register.ARTIST.streetAddress)
                                                                              + ' ' + encodeURI(Register.ARTIST.city)
                                                                              + ' ' + encodeURI(Register.ARTIST.state)
                                                                              + ' ' + encodeURI(Register.ARTIST.country)
                                                                              +'&sensor=false';

        $.ajax({
            url: url,
            type: "get",
            success: function(response){
                if(response.results && response.results[0]){
                    //Check for zip code
                    var addressComponents = response.results[0].address_components;

                    $.each(addressComponents, function(i, e){
                        if(e.types[0] === 'postal_code'){
                            Register.ARTIST.zip = e['short_name'];
                        }
                    })

                    //Set Lat / Lng
                    Register.ARTIST.lat = response.results[0].geometry.location.lat;
                    Register.ARTIST.lng = response.results[0].geometry.location.lng;
                }
                Register.submit();

            },
            error:function(){
                Register.submit();
            }
        });
    },

    clearErrors:function(){
        var $helpBlock = $('.help-block');

        $helpBlock.html();
        $helpBlock.parent().removeClass('error');
        $helpBlock.addClass('hidden');
    },

    changeCountryHandler:function(){
        var $state = $('#state');
        if($('#country').val() === 'United States'){
            $state.parents('.control-group').removeClass('hidden');
        }else{
            $state.parents('.control-group').addClass('hidden');
        }
    }
}