




$(document).ready(function () {
	console.log ('document ready')
	$('#app').append ('<p>Giphy</p>')

    // diplay trnding

	function displayTrendingGiphy () {
	    $.ajax({
	            url: 'http://api.giphy.com/v1/gifs/trending?api_key=dc6zaTOxFJmzC',
	            type: 'GET',
	           
	            success: function(results) {
	            	$('#trending').empty ('')
	            	for (var i = 0; i < results.data.length; i +=5) {
	            		var giphy = results.data [i];
      					var row = $('#trending').append (
		            		'<tr>' + 
	      					'</tr>'
      					)
      					for (var j = 0; j < 5 && (i + j) < results.data.length ; j ++) {
      						var giphy = results.data [i + j];
	      					row.append (
									'<td>' +
		          					'<img src=' +  giphy.images.fixed_height_small_still.url + '>' +
		        					'</td>' 

	      						)
      					}

	            		
	            		//$('#trending').append('<p>' + giphy.images.fixed_height_small.url + ' ' + giphy.slug + '</p>')
	            	}

	                console.log("Success:" )
	            },
	            error: function(error) {
	                console.error('error: ' + JSON.stringify(error));
	            }
	        }); 
	}
	function generateGiphy (giphytext, cb) {

 		$.ajax({
    			url: 'http://api.giphy.com/v1/stickers/translate?s=' + giphytext + '&api_key=dc6zaTOxFJmzC',
    			type: 'GET',
    			//contentType: 'application/x-www-form-urlencoded',
    			// data: options,
    			success: function(results) {
    				var giphy = results.data;
        			console.log('giphy generaed',results);
        			$('#image').empty ();
        			$('#image').append ('<img src=' +  giphy.images.fixed_height_small_still.url + '>');
        			cb (null, giphy)
                  
    			},
    			error: function(error) {
        			console.error('error: ' + JSON.stringify(error));
        		    cb (error, error)
    			}
  			});

	}

	

	displayTrendingGiphy ()

	var form = $('#generate');
	form.submit (function (e) {
		
	    event.preventDefault();
	    var giphytext = $('#textid').val ();
	    generateGiphy (giphytext, function (err, res){

	    })

	 
	})


	var gensave = $('#gensave');
	gensave.click (function () {
	    var giphytext = $('#textid').val ();
	    generateGiphy (giphytext, function (err, giphy){

	    	$.ajax({
    			url: '/giphy',
    			type: 'POST',
    			headers: {"Content-Type" : "application/json"},
    			data: JSON.stringify(giphy),
    			//contentType: 'application/x-www-form-urlencoded',
    			// data: options,
    			success: function(results) {
        			console.error('success: ');
    				
                  
    			},
    			error: function(error) {
        			console.error('error: ' + JSON.stringify(error));
        		  
    			}
  			});

	    	
	    })

	


	})
})










