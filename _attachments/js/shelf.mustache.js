
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

var itemDetailsMustache = [ 
    "<ul class=\"tabs\">",
    "    <li><a href=\"#tab_properties\">Eigenschaften</a></li>",
    "    <li><a href=\"#tab_notes\">Notizen</a></li>",
    "    <li><a href=\"#tab_attachments\">Anhänge</a></li>",
    "</ul>",
    "",
    "<div id=\"itemDetails\" class=\"tab_container\">",
    "",
    "<form id=\"{{formId}}\" method=\"post\">",
    "",
    "<div id=\"tab_properties\" class=\"tab_content\" >",
    "<table border=\"0\">",
    "{{#fields}}",
    "    <tr>",
    "        <td>{{name}}</td>",
    "        <td><input type=\"text\" size=\"50\" name=\"{{id}}\" value=\"\" /></td>",
    "    </tr>",
    "{{/fields}}",
    "</table>",
    "",
    "<input type=\"submit\" value=\"Speichern\" />",
    "</div>",
    "",
    "<div id=\"tab_notes\" class=\"tab_content\" >",
    "    <textarea name=\"notes\" cols=\"80\" rows=\"30\"/><br/>",
    "    <input type=\"submit\" value=\"Speichern\" />",
    "</div>",
    "",
    "</form>",
    "",
    "<div id=\"tab_attachments\" class=\"tab_content\" >",
    "    <div id=\"existing_attachments\"></div><hr/>",
    "    <p>Neuer Anhang: ",
    "    <form method=\"POST\" id=\"upload_attachment\">",
    "        <input type=\"hidden\" name=\"_rev\" value=\"{{docrev}}\">",
    "        <input name=\"_attachments\" type=\"file\"/>",
    "        <input type=\"submit\" value=\"Hinzufügen\"/>",
    "    </form>",
    "    </p>",
    "</div>",
    "",
    "</div>" // divId
    ].join('\n');

var itemAttachmentsMustache = [
    "{{#attachments}}",
    "    <p><form>",
    "        <a href=\"{{{url}}}\">{{name}}</a>&nbsp;",
    "        <input type=\"button\" onClick=\"deleteAttachment( '{{deleteurl}}' );\" name=\"{{name}}\" value=\"löschen\" />",
    "    </form></p>",
    "{{/attachments}}"].join('\n');

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


var searchIndexMustache = [ "<p>",
    "<div id=\"search\">",
    "<form id=\"search_form_mock\">",
    "<table border=\"0\">",
    "<tr>",
    "    <td>Titel</td>",
    "    <td><input type=\"text\" size=\"50\" name=\"title\" value=\"\" /></td>",
    "</tr>",
    "<tr>",
    "    <td>Autor</td>",
    "    <td><input type=\"text\" size=\"50\" name=\"author\" value=\"\" /></td>",
    "</tr>",
    "<tr>",
    "    <td>Schlagwörter</td>",
    "    <td><input type=\"text\" size=\"50\" name=\"tags\" value=\"\" /></td>",
    "</tr>",
    "</table>",
    "</form>",
    "<table border=\"0\">",
    "<tr><td>",
    "<form id=\"search_form\">",
    "<input type=\"hidden\" name=\"q\" value=\"\"/>",
    "<input type=\"submit\" value=\"finden\"/>",
    "</form>",
    "</td></tr>",
    "</table>",
    "<hr/>",
    "<div id=\"search_results\"></div>",
    "</div>",
    "<form id=",
    "</p>"].join('\n');

var searchResultMustache = [ "{{#results}}",
    "<p><a href=\"#docId{{id}}\" rel=\"history\">{{title}}, {{author}}</a></p>",
    "{{/results}}"].join('\n');

