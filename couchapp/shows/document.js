function(doc, req) {  
    // !code vendor/mustache/mustache.js
    // !json templates
    // !json types
    // !json fieldnames

    var prepareFields = function( doc, commonFields ) {
        doc.allfields = commonFields;
        doc.allfields.splice( 0,0,"cite-key" );
        doc.allfields.push("tags");
        doc.fields = [];
        for( var idx in doc.allfields ) {
            if( commonFields[idx].indexOf( "note" ) == -1 ) {
                doc.fields[ idx ] = { id : commonFields[idx], name : fieldnames[ commonFields[idx] ] };
            }
        }
        return doc;
    }

    if( doc ) {
        // regular display
        doc.regular = true;

        // general data to be displayed
        var type = types[ doc.type ];
        doc = prepareFields( doc, type.fields );

        // add all the attachments
        doc.attachments = "";
        for( var name in doc._attachments ) {
            var view = doc._attachments[name];
            view.name = name;
            view._id = doc._id;
            view._rev = doc._rev;
            doc.attachments += Mustache.to_html( templates.attachment, view );
            doc.has_attachments = true;
        }

        return {
            body : Mustache.to_html( templates.itemdetails, doc ),
            headers : {
                "Content-Type" : "text/html",
                "Vary" : "Accept"
            }
        }
    } else {
        if( req.id ) {
            // new document
            if( types[ req.id ] ) {
                var doc = { newdoc : true };
                var type = types[ req.id ];
                doc = prepareFields( doc, type.fields );

                return {
                    body : Mustache.to_html( templates.itemdetails, doc ),
                    headers : {
                        "Content-Type" : "text/html",
                        "Vary" : "Accept"
                    }
                }
            }
        } else {
            // error
            return { "code" : 409, body : "Bad request" }
        }
    }

}
