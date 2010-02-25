
var fieldNames = {
    "author" : "Autor",
    "title" : "Titel",
    "publisher" : "Verlag",
    "month" : "Monat",
    "year" : "Jahr",
    "editor" : "Herausgeber",
    "volume" : "Band",
    "number" : "Ausgabe",
    "series" : "Serie",
    "address" : "Adresse",
    "edition" : "Edition",
    "pages" : "Seiten",
    "chapter" : "Kapitel",
    "booktitle" : "Buchtitel",
    "journal" : "Zeitschrift"
};


var types = {
    "article" : {
            "name" : "Artikel",
            "divSelector" : "articleDetails",
            "formSelector" : "articleDetailsForm",
            "fields" : [ "author",
                "title",
                "journal",
                "month",
                "year",
                "volume",
                "number",
                "pages" ],
            "template" : { "type" : "article" }
        },
    "book" : {
            "name" : "Buch",
            "divSelector" : "bookDetails",
            "formSelector" : "bookDetailsForm",
            "fields" : [
                "author",
                "title",
                "publisher",
                "month",
                "year",
                "editor",
                "volume",
                "number",
                "series",
                "address",
                "edition"
            ],
            "template" : { "type" : "book" }
        },
        "booklet" : {
            "name" : "Booklet",
            "divSelector" : "bookletDetails",
            "formSelector" : "bookletDetailsForm",
            "fields" : [
                "author",
                "title",
                "howpublished",
                "month",
                "year",
                "address"
            ],
            "template" : { "type" : "booklet" }
        },
        "inbook" : {
            "name" : "Buchkapitel",
            "divSelector" : "inbookDetails",
            "formSelector" : "inbookDetailsForm",
            "fields" : [
                "author",
                "title",
                "publisher",
                "editor",
                "month",
                "year",
                "chapter",
                "volume",
                "number",
                "series",
                "edition",
                "pages",
                "address"
            ],
            "template" : { "type" : "inbook" }
        },
        "incollection" : {
            "name" : "Beitrag im Sammelband",
            "divSelector" : "incollectionDetails",
            "formSelector" : "incollectionDetailsForm",
            "fields" : [
                "author",
                "title",
                "booktitle",
                "publisher",
                "editor",
                "month",
                "year",
                "chapter",
                "volume",
                "number",
                "series",
                "edition",
                "pages",
                "address"
            ],
            "template" : { "type" : "inbook" }
        }
}
