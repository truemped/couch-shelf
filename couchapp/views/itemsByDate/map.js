function(doc) {

    if( doc.created_at && doc.title && doc.authors ) {
        emit( doc.created_at, [doc.title, doc.authors] );
    }

}
