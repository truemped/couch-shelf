
var types = {
    "book" : {
        divSelector : "#bookDetails",
        formSelector : "#bookDetailsForm",
        fields : [ "title", "authors", "publisher", "year", "tags" ],
        template : { type : "book" },
    }
};

var newestItemsMustache = "<p><a class=\"link\" rel=\"history\" href=\"#docId{{docid}}\">{{title}}, {{author}}</a></p>";

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
        } else if( post_url.indexOf( '#docId' ) > -1 ) {
            var docId = post_url.replace(/^.*#docId/, '');
            showItemDetails( docId );
        }
    }

    $('body').css('cursor','default');
}

function disableAllDisplays() {
    $("#content").empty();
}

var bookDetailsHTML = [ "<div id=\"bookDetails\" style=\"display:none\">",
    "<form id=\"bookDetailsForm\" method=\"post\">",
    "<table border=\"0\">",
    "    <tr>",
    "        <td>Titel</td>",
    "        <td><input type=\"text\" size=\"50\" name=\"title\" value=\"\" /></td>",
    "    </tr>",
    "    <tr>",
    "        <td>Autoren</td>",
    "        <td><input type=\"text\" size=\"50\" name=\"authors\" value=\"\" /></td>",
    "    </tr>",
    "    <tr>",
    "        <td>Verlag</td>",
    "        <td><input type=\"text\" size=\"50\" name=\"publisher\" value=\"\" /></td>",
    "    </tr>",
    "    <tr>",
    "        <td>Jahr</td>",
    "        <td><input type=\"text\" size=\"50\" name=\"year\" value=\"\" /></td>",
    "    </tr>",
    "    <tr>",
    "        <td>Schlagw&ouml;rter</td>",
    "        <td><input type=\"text\" size=\"50\" name=\"tags\" value=\"\" /></td>",
    "    </tr>",
    "</table>",
    "<input type=\"submit\" value=\"Speichern\" />",
    "</form>",
    "</div>"].join('\n');

// function to show the item's details
function showItemDetails( docid ) {

    disableAllDisplays();
    $("#content").append( bookDetailsHTML );

    $.CouchApp( function( app ) {
        app.db.openDoc( docid, { 
            success : function(doc) {

                var type = types[ doc.type ];

                $.CouchApp( function(app) {
                var postForm = app.docForm( type["formSelector"], {
                    id : doc._id,
                    fields : type["fields"],
                    template : type["template"],
                    onLoad : function(doc) {
                        doc.tags = doc.tags.join(" ");
                        doc.authors = doc.authors.join(";");
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
                    });
                });

                $( type["divSelector"] ).show();
            }
        });
    });
}

var newestListHTML = "<div id=\"listResult\"></div>";

// function to list the newest items
function showNewestItems() {
    disableAllDisplays();
    $("#content").append( newestListHTML );

    $.CouchApp( function( app ) {
        $("#listResult").empty();
        var options = {};
        options.limit = 10;
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
    $("#listResult").show();
}

