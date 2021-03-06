$(function() {
    var cache = {};
    $( "input#search" ).autocomplete({
      minLength: 2,
      source: function( request, response ) {
        var term = request["term"];
        console.log(request) 
        if ( term in cache ) {
          response( cache[ term ] );
          return;
        }
        $.getJSON("/search/"+request.term, function( data, status, xhr ) {
            console.log(data)
            if(data.Terms === null){ 
                return
            }
            var genes  = data.Terms; 
            for(var i = 0; i < genes.length; i++){
                gene = genes[i]
                cache[gene] = gene;
            }
            response(genes);
            return
            }
        );
      }
    });

    $('input#search').bind("enterKey", function(e){
        searchterm = $('input#search').val()
        loadStart(); 
        window.location = window.location.origin+"/search/results/"+searchterm
    });

    $('input#search').keyup(function(e){
        if(e.keyCode == 13) {
            $(this).trigger("enterKey");
        }
    }) 
    
    $("input#search").on( "autocompleteselect", function( event, ui ) {
        searchterm = $('input#search').val()
        loadStart(); 
        window.location = window.location.origin+"/search/results/"+searchterm
    } );

});
