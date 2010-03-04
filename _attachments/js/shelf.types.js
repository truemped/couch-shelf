
var fieldNames = {
    "authors" : "Autor",
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
    "journal" : "Zeitschrift",
    "notes" : "Notizen",
    "tags" : "Schlagwörter",
};


var types = {
    "article" : {
            "name" : "Artikel",
            "fields" : [ "authors",
                "title",
                "journal",
                "month",
                "year",
                "volume",
                "number",
                "pages",
                "tags",
                "notes" ],
            "template" : { "type" : "article" }
        },
    "book" : {
            "name" : "Buch",
            "fields" : [
                "authors",
                "title",
                "publisher",
                "month",
                "year",
                "editor",
                "volume",
                "number",
                "series",
                "address",
                "edition",
                "tags",
                "notes",
            ],
            "template" : { "type" : "book" }
        },
        "booklet" : {
            "name" : "Booklet",
            "fields" : [
                "authors",
                "title",
                "howpublished",
                "month",
                "year",
                "address",
                "tags",
                "notes",
            ],
            "template" : { "type" : "booklet" }
        },
        "inbook" : {
            "name" : "Buchkapitel",
            "fields" : [
                "authors",
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
                "address",
                "tags",
                "notes",
            ],
            "template" : { "type" : "inbook" }
        },
        "incollection" : {
            "name" : "Beitrag im Sammelband",
            "fields" : [
                "authors",
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
                "address",
                "tags",
                "notes",
            ],
            "template" : { "type" : "inbook" }
        }
}
