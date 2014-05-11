if(typeof ResetPassword == 'undefined'){
    var ResetPassword = {};
}

ResetPassword = {
    resetPassword: function(){
        $('#emailErrorMessage').addClass('hidden');
        $('#passwordSuccessMessage').addClass('hidden');

        var email = $('#resetPasswordEmail').val();

        $.ajax({
            type: "POST",
            url: '/resetPassword?email=' + encodeURIComponent(email),
            success: ResetPassword.resetSuccess,
            error: ResetPassword.resetError
        });
    },

    resetSuccess: function(data){
        $('#resetPasswordEmail').val('');
        $('#emailErrorMessage').addClass('hidden');
        $('#emailSuccessMessage').html(data).removeClass('hidden');
    },

    resetError: function(xhr, ajaxOptions, err){
        $('#emailSuccessMessage').addClass('hidden');
        $('#emailErrorMessage').html(xhr.responseText).removeClass('hidden');
    },

    setNewPassword: function(){
        $('#passwordErrorMessage').addClass('hidden');
        $('#passwordSuccessMessage').addClass('hidden');

        function getURLParameter(name) {
            return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
        }

        var email = $('#resetPasswordEmail').val();
        var newPassword = $('#newPassword').val();
        var confirmNewPassword = $('#confirmNewPassword').val();
        var resetId = getURLParameter('fp');

        if(newPassword === confirmNewPassword){
            $.ajax({
                type: "POST",
                url: '/resetPassword/' + resetId + '/?email=' + encodeURIComponent(email) + '&password=' + newPassword,
                success: ResetPassword.setNewSuccess,
                error: ResetPassword.setNewError
            });
        }else{
            $('#passwordErrorMessage').html('Passwords do not match').removeClass('hidden');
        }
    },

    setNewSuccess: function(data){
        $('#resetPasswordEmail').val('');
        $('#newPassword').val('');
        $('#confirmNewPassword').val('');
        $('#passwordErrorMessage').addClass('hidden');
        $('#passwordSuccessMessage').removeClass('hidden');
    },

    setNewError: function(xhr, ajaxOptions, err){
        $('#passwordSuccessMessage').addClass('hidden');
        $('#passwordErrorMessage').html(xhr.responseText).removeClass('hidden');
    }
};