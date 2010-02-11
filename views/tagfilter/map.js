function(doc) {
    
    // http://snippets.dzone.com/posts/show/3545
    var permute = function(a) {
        var fn = function(n, src, got, all) {
            if (n == 0) {
                if (got.length > 0) {
                    all[all.length] = got;
                }
                return;
            }
            for (var j = 0; j < src.length; j++) {
                fn(n - 1, src.slice(j + 1), got.concat([src[j]]), all);
            }
            return;
        }
        var all = [];
        for (var i=0; i < a.length; i++) {
            fn(i, a, [], all);
        }
        all.push(a);
        return all;
    }

    if(doc.tags && typeof(doc.tags) === 'object' ) {
        var tags = doc.tags;
        for( var idx in tags ) {
            tags[idx] = tags[idx].toLowerCase();
        }

        var permutedTags = permute(tags);
        for(var idx in permutedTags) {
            emit( permutedTags[idx], null );
        }
    }
}
