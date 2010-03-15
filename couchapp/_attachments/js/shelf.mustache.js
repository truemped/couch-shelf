
var tagListResultMustache = [ "{{#docs}}",
    "<p><a href=\"#/doc/{{{id}}}\" rel=\"history\">{{title}}, {{authors}}</a></p>",
    "{{/docs}}"].join('\n');

var tagListPagingLinksMustache = [ "<p>",
    "<a href=\"#/tag/{{{tag}}}/previous/{{{previousId}}}\" rel=\"history\"><img src=\"img/go-previous.png\" /></a>&nbsp;&nbsp;&nbsp;",
    "<a href=\"#/tag/{{{tag}}}/next/{{{nextId}}}\" rel=\"history\"><img src=\"img/go-next.png\" /></a>",
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
    "<p><a href=\"#/doc/{{id}}\" rel=\"history\">{{title}}, {{author}}</a></p>",
    "{{/results}}"].join('\n');

