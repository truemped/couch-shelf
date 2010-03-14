function(head, req) {
    // !code vendor/mustache/mustache.js
    // !json templates.newestItems

    var row;
    while( row = getRow() ) {
        send( Mustache.to_html( templates.newestItems, {
            docid : row.id,
            title : row.value[0],
            author : row.value[1].join('; ')
        }));
    }
}
