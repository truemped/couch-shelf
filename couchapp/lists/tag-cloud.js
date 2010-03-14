function(head, req) {
    // !code vendor/mustache/mustache.js
    // !json templates.tagcloud

    var row;
    while( row = getRow() ) {
        send( Mustache.to_html( templates.tagcloud, {
            tag : row.key,
            tag_uri : encodeURIComponent( row.key ),
            count : row.value * 10 } )
        );
    }
}
