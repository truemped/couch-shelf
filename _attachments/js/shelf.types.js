
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

