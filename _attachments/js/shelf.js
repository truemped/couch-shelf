
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
        } else if( post_url.indexOf( '#search' ) > -1 ) {
            search();
        }
    }

    $('body').css('cursor','default');
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
function renderAndBindDocToForm( doc, dbname ) {
    var type = types[ doc.type ];

    var fields = [ "tags" ];
    for( var idx in type.fields ) {
        if( type.fields[idx].indexOf( "note" ) == -1 ) {
            fields[ idx ] = { id : type.fields[idx], name : fieldNames[ type.fields[idx] ] };
        }
    }

    var html = $.mustache( itemDetailsMustache, { fields : fields, docrev : doc._rev } );
    $("#content").append( html  );

    var couchDbDetails = {
        id : doc._id,
        fields : type["fields"],
        template : { type : type },
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
        var postForm = app.docForm( "form#item_details", couchDbDetails );
    });

    $("#nice_editor").wymeditor({
    html : doc.notes,
    toolsItems: [
        {'name': 'Bold', 'title': 'Strong', 'css': 'wym_tools_strong'}, 
        {'name': 'Italic', 'title': 'Emphasis', 'css': 'wym_tools_emphasis'},
        {'name': 'Superscript', 'title': 'Superscript', 'css': 'wym_tools_superscript'},
        {'name': 'Subscript', 'title': 'Subscript', 'css': 'wym_tools_subscript'},
        {'name': 'InsertOrderedList', 'title': 'Ordered_List', 'css': 'wym_tools_ordered_list'},
        {'name': 'InsertUnorderedList', 'title': 'Unordered_List', 'css': 'wym_tools_unordered_list'},
        {'name': 'Indent', 'title': 'Indent', 'css': 'wym_tools_indent'},
        {'name': 'Outdent', 'title': 'Outdent', 'css': 'wym_tools_outdent'},
        {'name': 'Undo', 'title': 'Undo', 'css': 'wym_tools_undo'},
        {'name': 'Redo', 'title': 'Redo', 'css': 'wym_tools_redo'},
    ]
    });

    // add all the attachments to the div
    var attachments = [], idx = 0;
    for( var name in doc._attachments ) {
        attachments[idx] = { name : name, url : "/"+[dbname, doc._id,  name].join('/'), deleteurl : "/"+[dbname, doc._id, name].join('/')+"?rev="+doc._rev };
        idx++;
    }
    $( "#existing_attachments" ).append( $.mustache( itemAttachmentsMustache, { attachments : attachments } ) );

    // add the attachment uploading
    $("form#upload_attachment").submit( function(e) {
        e.preventDefault();

        var name, value;

        var data = {};
        $.each($("form#upload_attachment :input").serializeArray(), function(i, field) {
            data[field.name] = field.value;
            });
        $("form#upload_attachment :file").each(function() {
            data[this.name] = this.value; // file inputs need special handling
            name = this.name;
            value = this.value;
        });

        if (!data._attachments || data._attachments.length == 0) {
            alert("Please select a file to upload.");
            return;
        }

        $(this).ajaxSubmit({
            url:  "/"+[dbname, doc._id].join('/'),
            success: function(resp) {
                alert('Anhang hinzugefügt!');
                window.location.reload();
            }
        });
    });

    // add all the tabbing behaviour
    //When page loads...
    $(".tab_content").hide(); //Hide all content
    $("ul.tabs li:first").addClass("active").show(); //Activate first tab
    $(".tab_content:first").show(); //Show first tab content

    //On Click Event
    $("ul.tabs li").click(function() {
        $("ul.tabs li").removeClass("active"); //Remove any "active" class
        $(this).addClass("active"); //Add "active" class to selected tab
        $(".tab_content").hide(); //Hide all tab content

        var activeTab = $(this).find("a").attr("href"); //Find the href attribute value to identify the active tab + content
        $(activeTab).fadeIn(); //Fade in the active ID content
        return false;
    });


    $( "#itemDetails" ).show();
}

// function called when an attachment should be deleted
function deleteAttachment( url ) {
    if( confirm("Wirklich löschen?") ) {
        $.ajax( {
            type : "DELETE",
            url : url,
            success: function() {
                alert('Wurde gelöscht');
                window.location.reload();
            }
        });
    }
}

// function to show the item's details
function showItemDetails( docid ) {

    $("#content").empty();

    $.CouchApp( function( app ) {
        var dbname = document.location.href.split('/')[3]
        app.db.openDoc( docid, { 
            success : function(doc) {
                renderAndBindDocToForm( doc, dbname );
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
// function to list the newest items
function showNewestItems() {
    $("#content").empty();
    $("#content").append( $.mustache( emptyDivMustache, { divid : "listResult" } ) );

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
function showTagCloud() {
    $("#content").empty();
    $("#content").append( $.mustache( emptyDivMustache, { divid : "tagcloud" } ) );

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
function showItemsByTag( tag ) {
    $("#content").empty();
    $("#content").append( $.mustache ( emptyDivMustache, { divid : "listResult" } ) );

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
 * Methods and variables regarding the search.
 *
 */
function search() {
    $( "#content" ).empty();
    $( "#content" ).append( searchIndexMustache );

    var dbname = document.location.href.split('/')[3]

    $( "form#search_form" ).submit( function(e) {
        e.preventDefault();
        $( "#search_results" ).empty();
        var q = "";
        $.each( $("form#search_form_mock :input").serializeArray(), function( i, field) {
            var value = "";
            if( field.name == "tags" ) {
                value = field.value.split(' ').map( function( v ) {
                    return "+"+v;
                }).join(' ');
            } else {
                value = field.value;
            }
            if( field.value ) {
                q += field.name + ":(" + value + ") ";
            }
        });

        $( "form#search_form [name=q]" ).val( q );

        $(this).ajaxSubmit( {
            url : "/" + dbname + "/_fti/couch-shelf/shelf",
            dataType : "json",
            success : function( resp ) {
                var results = [];
                var idx = 0;
                resp.rows.map( function( result ) {
                    results[idx] = { id : result.id, title : result.fields.title, author : result.fields.author };
                    idx++;
                });
                $( "#search_results" ).append( $.mustache( searchResultMustache, { results : results } ) );
            }
        });
    });
}
/*
 * End:
 *
 * Methods and variables regarding the search.
 *
 */

