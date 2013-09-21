(function(){
    //Start index at 20 to avoid repeat of first set of records
    var index = 20;

    $(document).ready(function(){
       $('#GetMoreRecords').click(function(){
           $.ajax({
               url: document.location.pathname.substr(1) + '/paginate/' + index + window.location.search,
               dataType: 'json'
           })
               .done(function(results) {
                   index += 20;
                   var paginationString = '';
                   results.forEach(function(obj, idx, arr){
                       dust.render(document.location.pathname.substr(1) + 'Item', obj, function(err, out){
                           paginationString += out;
                       });
                   });

                   $('#ListView').append(paginationString).listview('refresh');
               })
               .fail(function(err) {
                    console.log(err);
               });
       });
    });
}());