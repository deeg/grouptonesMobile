if(typeof Profile == 'undefined'){
    var Profile = {};
}

Profile = {
    toggleEditMode:function(editModeOn){
        if(editModeOn === "false"){
            $('.profileData').addClass('hidden');
            $('.editMode').removeClass('hidden');
            $('#submitButton').button('enable');
            $('#editButton')[0].value = "ture";
        }else{
            $('.profileData').removeClass('hidden');
            $('.editMode').addClass('hidden');
            $('#submitButton').button('disable');
            $('#editButton')[0].value = "false";
        }
    },

    saveProfile:function(id){
        var profileToSave = {}
        $('.profileFormElement').each(function(i,e){
            var elementName = e.name;
            if(e.value){
                profileToSave[elementName] = e.value;
            }

        });

        console.log(profileToSave);

        $.ajax({
            url: 'profile/' + id,
            type: "post",
            dataType:'JSON',
            data:profileToSave,
            success: function(response){
                window.location = '/profile'

            },
            error:function(){
                //TODO: Handle error here
               console.log('there was an error')
            }
        });
    }
};