
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
        if( post_url.indexOf( '#/newest' ) > -1 ) {
            showNewestItems();
        } else if( post_url.indexOf( '#/new/' ) > -1 ) {
            var docType = post_url.replace( /^.*#\/new\//, '' );
            showItemDetails( docType );
        } else if( post_url.indexOf( '#/doc/' ) > -1 ) {
            var docId = post_url.replace(/^.*#\/doc\//, '');
            showItemDetails( docId );
        } else if( post_url.indexOf( '#/tagcloud' ) > -1 ) {
            showTagCloud();
        } else if( post_url.indexOf( '#/tag/' ) > -1 ) {
            var tag = post_url.replace(/^.*#\/tag\//, '');
            showItemsByTag( tag );
        } else if( post_url.indexOf( '#/search' ) > -1 ) {
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

// append an ajax get request to the selector
function appendAjaxResp( url, selector ) {
    $.ajax( {
        type : "GET",
        dataType : "html",
        url : url,
        success : function(resp) {
            $(selector).append(resp);
        }
    });
}

// initialize the new item menu
function initDocTypes() {
    $.CouchApp( function(app) {
        appendAjaxResp( app.showPath( "newDocTypeMenu", "anything" ), "#newDocTypeList" );
    });
}

// function to show the newest items
function showNewestItems() {
    $("#content").empty();

    $.CouchApp( function( app ) {
        appendAjaxResp( app.listPath("newest-items", "itemsByDate") + "?descending=true", "#content" );
    });
}

// function to show the item's details
function showItemDetails( docid ) {
    $("#content").empty();

    $.CouchApp( function( app ) {
        appendAjaxResp( app.showPath("document", docid), "#content" );
    });

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

// show the tag cloud
function showTagCloud() {
    $("#content").empty();

    $.CouchApp( function( app ) {
        appendAjaxResp( app.listPath( "tag-cloud", "tagcloud" ) + "?group=true", "#content" );
    });
}

/*
 * Begin:
 *
 * Methods and variables regarding the tag filtering.
 *
 */
function showItemsByTag( tag ) {
    $("#content").empty();

    var limit = 10;
    var skip = 0;
    var startkey_docid = null;
    var endkey_docid = null;
    if( tag.indexOf('/next/') > -1 ) {
        // show the next page
        startkey_docid = tag.replace(/^.*\/next\//, '');
        tag = tag.replace( /\/next\/.*$/, '' );
        limit = 10;
        skip = 1;
    } else if( tag.indexOf( '/previous/' ) > -1 ) {
        // show the previous page
        endkey_docid = tag.replace(/^.*\/previous\//, '');
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
                        author : row.doc.author.join(';')
                    };
                });
                $("#content").append( $.mustache( tagListResultMustache, { docs : docs } ) );
                $("#content").append( $.mustache( tagListPagingLinksMustache, { tag : tag, previousId : data.rows[0].id, nextId : data.rows[ data.rows.length-1 ].id } ) );
            } else {
                $("#content").append( "<h2>keine weiteren Einträge</h2>" );
            }
        };
        app.view( "tagcloud", options );
    });
}

// show and prepare the search divs
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
