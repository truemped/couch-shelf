
var emptyDivMustache = "<div id=\"{{divid}}\"></div>";

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

var itemDetailsMustache = [ "<div id=\"{{divId}}\">",
    "<form id=\"{{formId}}\" method=\"post\">",
    "<table border=\"0\">",
    "{{#fields}}",
    "    <tr>",
    "        <td>{{name}}</td>",
    "        <td><input type=\"text\" size=\"50\" name=\"{{id}}\" value=\"\" /></td>",
    "    </tr>",
    "{{/fields}}",
    "</table>",
    "<input type=\"submit\" value=\"Speichern\" />",
    "</form>",
    "</div>"].join('\n');

var newestItemsMustache = "<p><a class=\"link\" rel=\"history\" href=\"#docId{{docid}}\">{{title}}, {{author}}</a></p>";

var tagsMustache = ["{{#tags}}",
    "<a style=\"font-size:{{{count}}}px\" href=\"#tag/{{{tag_uri}}}\" rel=\"history\">{{tag}}</a>",
    "{{/tags}}"].join('\n');

var tagListResultMustache = [ "{{#docs}}",
    "<p><a href=\"#docId{{{id}}}\" rel=\"history\">{{title}}, {{authors}}</a></p>",
    "{{/docs}}"].join('\n');

var tagListPagingLinksMustache = [ "<p>",
    "<a href=\"#tag/{{{tag}}}/previous/{{{previousId}}}\" rel=\"history\"><img src=\"img/go-previous.png\" /></a>&nbsp;&nbsp;&nbsp;",
    "<a href=\"#tag/{{{tag}}}/next/{{{nextId}}}\" rel=\"history\"><img src=\"img/go-next.png\" /></a>",
    "</p>"].join('\n');


