
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
        if( post_url.indexOf( '/newest' ) > -1 ) {
            showNewestItems();
        } else if( post_url.indexOf( '/new/' ) > -1 ) {
            var docType = post_url.replace( /^.*\/new\//, '' );
            showItemDetails( docType );
        } else if( post_url.indexOf( '/doc/' ) > -1 ) {
            var docId = post_url.replace(/^.*\/doc\//, '');
            showItemDetails( docId );
        } else if( post_url.indexOf( '/tagcloud' ) > -1 ) {
            showTagCloud();
        } else if( post_url.indexOf( '/tag/' ) > -1 ) {
            var tag = post_url.replace(/^.*\/tag\//, '');
            showItemsByTag( tag );
        } else if( post_url.indexOf( '/search/' ) > -1 ) {
            var searchLine = post_url.replace( /^.*\/search\//, '' );
            search( searchLine );
        } else if( post_url.indexOf( '/search' ) > -1 ) {
            searchIndex();
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
        appendAjaxResp( app.listPath("newest-items", "itemsByDate") + "?descending=true&limit=20", "#content" );
    });
}

// function to show the item's details
function showItemDetails( docid ) {
    $("#content").empty();

    $.CouchApp( function( app ) {
        appendAjaxResp( app.showPath("document", docid), "#content" );
    });

}

// function to delete a document
function deleteDocument( id, rev ) {
    $.CouchApp( function( app ) {
        if( confirm( "Eintrag wirklich löschen?" ) ) {
            app.db.removeDoc( { _id : id, _rev : rev } );
        }
    });
    showNewestItems();
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
function searchIndex() {
    $( "#content" ).empty();
    $( "#content" ).append( searchIndexMustache );

    $( "form#search_form" ).submit( function(e) {
        e.preventDefault();
        var title = $( "form#search_form_mock [name=title]" ).val();
        var author = $( "form#search_form_mock [name=author]" ).val();
        var tags = $( "form#search_form_mock [name=tags]" ).val();
        var query = "#/search/";
        if(title.length>0) {
            query += "title="+title+"&";
        }
        if(author.length>0) {
            query += "author="+author+"&";
        }
        if(tags.length>0) {
            query += "tags="+tags+"&";
        }
        $.historyLoad( query );
    });

}

// show the search results
function search( searchLine ) {

    searchIndex();

    var queryVars = searchLine.split( '&' );
    var queryWithoutPage = [];
    var q = "";
    var page = 0;
    for( var i=0; i<queryVars.length; i++ ) {
        var query = queryVars[i].split( '=' );
        if(query.length == 2) {
            var value = "";
            if( query[0] == "tags" && query[1].length > 0 ) {
                $( "form#search_form_mock [name=tags]" ).val( query[1] );
                value = query[1].split(' ').map( function( v ) {
                    return "+"+v;
                }).join(' ');
                q += query[0] + ":(" + value + ") ";
                queryWithoutPage.push( query[0]+"="+query[1] );
            } else if( query[0] == "page" ) {
                page = query[1];
            } else if( query[1].length > 0 ) {
                $( "form#search_form_mock [name="+query[0]+"]" ).val(query[1]);
                value = query[1];
                q += query[0] + ":(" + value + ") ";
                queryWithoutPage.push( query[0]+"="+query[1] );
            }
        }
    }
    $( "form#search_form [name=q]" ).val( q );
    var nextSkip = page * $( "form#search_form [name=limit]" ).val();
    $( "form#search_form [name=skip]" ).val( nextSkip );

    var dbname = document.location.href.split('/')[3]
    var newQuery = "#/search/"+queryWithoutPage.join('&');

    $( "form#search_form" ).ajaxSubmit( {
        url : "/" + dbname + "/_fti/couch-shelf/shelf",
        dataType : "json",
        success : function( resp ) {
            var results = [];
            var idx = 0;
            resp.rows.map( function( result ) {
                if( typeof( result.fields.author ) === "object" ) {
                    results[idx] = { id : result.id, title : result.fields.title, author : result.fields.author.join( '; ' ) };
                }else {
                    results[idx] = { id : result.id, title : result.fields.title, author : result.fields.author };
                }
                idx++;
            });
            if( results.length == 0 ) {
                $( "#search_results" ).append( "<h2>keine Einträge gefunden</h2>" );
            } else {
                $( "#search_results" ).append( $.mustache( searchResultMustache, { results : results } ) );

                // previous
                var previous = undefined;
                if( page > 0 ) {
                    previous = newQuery+"&page="+( page - 1 );
                }
                // next
                var next = undefined;
                if( results.length == 10 ) {
                    next = newQuery+"&page="+( page + 1);
                }
                $( "#search_paging" ).append( $.mustache( searchPagingMustache, { previous : previous, next : next } ) );
            }
        }
    });
}
