
/*
 * different types of available items.
 */
var types = {
    "book" : {
        name : "Buch",
        divSelector : "bookDetails",
        formSelector : "bookDetailsForm",
        fields : [ "title", "authors", "publisher", "year", "tags" ],
        fieldNames : {
            "title" : "Titel",
            "authors" : "Autor",
            "publisher" : "Verlag",
            "year" : "Jahr",
            "tags" : "Schlagwörter"
        },
        template : { type : "book" },
    }
};

var empyDivMustache = "<div id=\"{{divid}}\"></div>";

/* Begin:
 *
 * Methods for preserving the correct history.
 *
 */
function initHistory() {
    $.historyInit( historyPreservingClick, "index.html" );

    $("a[rel='history']").live( 'click', function() {
        var url = $(this).attr('href');
        $.historyLoad( url );
        return false;
    });
}

function historyPreservingClick( post_url ) {
    $('body').css('cursor','wait');

    if( $.browser.msie) {
        post_url = encodeURIComponent(post_url);
    }

    if( post_url ) {
        if( post_url.indexOf( '#newest' ) > -1 ) {
            showNewestItems();
        } else if( post_url.indexOf( '#new/' ) > -1 ) {
            $("#content").empty();
            renderAndBindDocToForm( { type : post_url.replace( /^.*#new\//, '' ), _id : null } );
        } else if( post_url.indexOf( '#docId' ) > -1 ) {
            var docId = post_url.replace(/^.*#docId/, '');
            showItemDetails( docId );
        } else if( post_url.indexOf( '#tagcloud' ) > -1 ) {
            showTagCloud();
        } else if( post_url.indexOf( '#tag/' ) > -1 ) {
            var tag = post_url.replace(/^.*#tag\//, '');
            showItemsByTag( tag );
        }
    }

    $('body').css('cursor','default');
}

var newDocTypeListMustache = [ "{{#typedesc}}",
    "<li><a href=\"#new/{{{id}}}\" rel=\"history\">{{name}}</a></li>",
    "{{/typedesc}}"].join('\n');

function initDocTypes() {
    var typedesc = new Array();
    for( var idx in types ) {
        typedesc.push( { id : idx, name : types[idx]['name'] } );
    }
    $("#newDocTypeList").append( $.mustache( newDocTypeListMustache, { typedesc : typedesc } ) );
}

/* End:
 *
 * Methods for preserving the correct history.
 *
 */

/* Begin:
 *
 * Methods and variables regarding item details.
 *
 */
var itemDetailsMustacheHead = [ "<div id=\"{{divId}}\">",
    "<form id=\"{{formId}}\" method=\"post\">",
    "<table border=\"0\">"].join('\n');

var itemDetailsMustasheRows = [ "{{#fields}}",
    "    <tr>",
    "        <td>{{name}}</td>",
    "        <td><input type=\"text\" size=\"50\" name=\"{{id}}\" value=\"\" /></td>",
    "    </tr>",
    "{{/fields}}"].join('\n');

var itemDetailsMustasheFoot = [ "</table>",
    "<input type=\"submit\" value=\"Speichern\" />",
    "</form>",
    "</div>"].join('\n');

function renderAndBindDocToForm( doc ) {
    var type = types[ doc.type ];

    var fields = [];
    for( var idx in type.fields ) {
        if( idx ) {
            fields[ idx ] = { id : type.fields[idx], name : type.fieldNames[ type.fields[idx] ] };
        }
    }

    var html = $.mustache( itemDetailsMustacheHead, { divId : type.divSelector, formId : type.formSelector } );
    html += $.mustache( itemDetailsMustasheRows, { fields : fields } );
    html += itemDetailsMustasheFoot;
    $("#content").append( html  );

    var couchDbDetails = {
        id : doc._id,
        fields : type["fields"],
        template : type["template"],
        onLoad : function(doc) {
            if( doc.tags ) {
                doc.tags = doc.tags.join(" ");
            }
            if( doc.authors ) {
                doc.authors = doc.authors.join(";");
            }
        },
        beforeSave : function(doc) {
            if(!doc.created_at) {
                doc.created_at = new Date();
            }
            if(doc.tags) {
                doc.tags = $.trim(doc.tags);
                doc.tags = doc.tags.split(" ");
                for(var idx in doc.tags) {
                    doc.tags[idx] = $.trim(doc.tags[idx]);
                }
            }
            if(doc.authors) {
                doc.authors = doc.authors.split(";");
                for(var idx in doc.authors) {
                    doc.authors[idx] = $.trim(doc.authors[idx]);
                }
            }
        }
    };

    $.CouchApp( function(app) {
        var postForm = app.docForm( "#"+type["formSelector"], couchDbDetails );
    });

    $( "#"+type["divSelector"] ).show();
}

// function to show the item's details
function showItemDetails( docid ) {

    $("#content").empty();

    $.CouchApp( function( app ) {
        app.db.openDoc( docid, { 
            success : function(doc) {
                renderAndBindDocToForm( doc );
            }
        });
    });
}

/* End:
 *
 * Methods and variables regarding item details.
 *
 */



/* Begin:
 *
 * Methods and variables regarding the list of newest items.
 *
 */

var newestItemsMustache = "<p><a class=\"link\" rel=\"history\" href=\"#docId{{docid}}\">{{title}}, {{author}}</a></p>";

// function to list the newest items
function showNewestItems() {
    $("#content").empty();
    $("#content").append( $.mustache( empyDivMustache, { divid : "listResult" } ) );

    $.CouchApp( function( app ) {
        var options = {};
        options.limit = 10;
        options.descending = true;
        options.success = function( data ) {
            data.rows.map( function( row ) {
                var view = {
                    docid : row.id,
                    title : row.value[0],
                    author : row.value[1].join(";")
                }
                $("#listResult").append( $.mustache(newestItemsMustache, view) );
            });
        };
        app.view( "itemsByDate", options );
    });
}
/* End:
 *
 * Methods and variables regarding the list of newest items.
 *
 */

/* Begin:
 *
 * Methods and variables regarding the tag cloud.
 *
 */

var tagsMustache = ["{{#tags}}",
    "<a style=\"font-size:{{{count}}}px\" href=\"#tag/{{{tag_uri}}}\" rel=\"history\">{{tag}}</a>",
    "{{/tags}}"].join('\n');

function showTagCloud() {
    $("#content").empty();
    $("#content").append( $.mustache( empyDivMustache, { divid : "tagcloud" } ) );

    $.CouchApp( function( app ) {
        var options = {};
        options.group = true;
        options.success = function( data ) {
            var tags = data.rows.map( function( row ) {
                return {
                    tag : row.key,
                    tag_uri : encodeURIComponent( row.key ),
                    count : row.value * 10
                };
            });
            $("#tagcloud").append( $.mustache( tagsMustache, { tags : tags } ) );
        };
        app.view( "tagcloud", options );
    });
}

/* End:
 *
 * Methods and variables regarding the tag cloud.
 *
 */

/*
 * Begin:
 *
 * Methods and variables regarding the tag filtering.
 *
 */

var tagListResultMustache = [ "{{#docs}}",
    "<p><a href=\"#docId{{{id}}}\" rel=\"history\">{{title}}, {{authors}}</a></p>",
    "{{/docs}}"].join('\n');

var tagListPagingLinksMustache = [ "<p>",
    "<a href=\"#tag/{{{tag}}}/previous/{{{previousId}}}\" rel=\"history\"><img src=\"img/go-previous.png\" /></a>&nbsp;&nbsp;&nbsp;",
    "<a href=\"#tag/{{{tag}}}/next/{{{nextId}}}\" rel=\"history\"><img src=\"img/go-next.png\" /></a>",
    "</p>"].join('\n');

function showItemsByTag( tag ) {
    $("#content").empty();
    $("#content").append( $.mustache ( empyDivMustache, { divid : "listResult" } ) );

    var limit = 10;
    var skip = 0;
    var startkey_docid = null;
    var endkey_docid = null;
    if( tag.indexOf('/next/') > -1 ) {
        // show the next page
        startkey_docid = tag;
        startkey_docid = startkey_docid.replace(/^.*\/next\//, '');
        tag = tag.replace( /\/next\/.*$/, '' );
        limit = 10;
        skip = 1;
    } else if( tag.indexOf( '/previous/' ) > -1 ) {
        // show the previous page
        endkey_docid = tag;
        endkey_docid = endkey_docid.replace(/^.*\/previous\//, '');
        tag = tag.replace( /\/previous\/.*$/, '' );
        limit = 10;
        skip = 1;
    }

    $.CouchApp( function( app ) {
        var options = {};
        options.reduce = false;
        options.key = tag;
        options.limit = limit;
        if( skip != 0 ) options.skip = skip;
        if( startkey_docid ) options.startkey_docid = startkey_docid;
        if( endkey_docid ) options.endkey_docid = endkey_docid;
        options.include_docs = true;
        options.success = function( data ) {
            if( data.rows.length > 0 ) {
                var docs = data.rows.map( function( row ) {
                    return {
                        id : row.id,
                        title : row.doc.title,
                        authors : row.doc.authors.join(';')
                    };
                });
                $("#listResult").append( $.mustache( tagListResultMustache, { docs : docs } ) );
                $("#listResult").append( $.mustache( tagListPagingLinksMustache, { tag : tag, previousId : data.rows[0].id, nextId : data.rows[ data.rows.length-1 ].id } ) );
            } else {
                $("#listResult").append( "<h2>keine weiteren Einträge</h2>" );
            }
        };
        app.view( "tagcloud", options );
    });
}
/*
 * Begin:
 *
 * Methods and variables regarding the tag filtering.
 *
 */
