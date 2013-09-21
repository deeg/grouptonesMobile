(function(){
    //Start index at 20 to avoid repeat of first set of records
    var index = 20;

    $(document).ready(function(){
       $('#GetMoreRecords').click(function(){
          console.log('clicked');
           $.ajax({
               url: document.location.pathname.substr(1) + '/paginate/' + index + window.location.search,
               dataType: 'json'
           })
               .done(function(results) {
                   index += 20;
                   console.log( "success" );
                   var paginationString = '';
                   results.forEach(function(obj, idx, arr){
                       dust.render(document.location.pathname.substr(1) + 'Item', obj, function(err, out){
                           console.log(out);
                           paginationString += out;
                       });
                   });

                   console.log('is async?');
                   $('#ListView').append(paginationString).listview('refresh');
               })
               .fail(function() {
                   index += 20;
                   console.log('fail')
               });
       });
    });
}());