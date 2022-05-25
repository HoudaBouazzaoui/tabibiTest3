let NodeCache = require('node-cache')
let cache = null;

exports.start = function (done) {
    console.log('******* CACHE **** start');
    //if (cache) return done()
    if (cache) {
        if (done) {
            //var bibi = null;
            //bibi.titi;
            done();
        }
        //done();
        console.log('******* KIIIIIIIIIIIIIIIIIIIIIIII **** start');
        return;
    }
    cache = new NodeCache();
}

/*
exports.start = function () {
    console.log('******* CACHE **** start');
    //if (cache) return done()
    if (cache) {
        return;
    }
    cache = new NodeCache();
}
*/
exports.instance = function () {
    //console.log('******* CACHE **** instance = ' + cache);
    return cache;
}
