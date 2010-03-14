function(doc, req) {  
    // !code vendor/mustache/mustache.js
    // !json templates.newDocTypeList
    // !json types
    // !json fieldnames

    // this show is kind of a hack: do not care about any documents, simply
    // render the list of new item links

    var typedesc = [];
    for( var idx in types ) {
        typedesc.push( { id : idx, name : types[idx]['name'] } );
    }
    
    return {
        body : Mustache.to_html( templates.newDocTypeList, { typedesc : typedesc } )
    }
}
