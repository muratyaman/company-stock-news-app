var MongoClient = require('mongodb').MongoClient
    , format = require('util').format;

MongoClient.connect('mongodb://mm_recruitment_user_readonly:rebelMutualWhistle@ds037551.mongolab.com:37551/mm-recruitment', function(err, db) {
    if(err) throw err;

    var collection = db.collection('company');

    // Locate all the entries using find
    collection.find().toArray(function(err, results) {
        console.dir(results);
        // Let's close the db
        db.close();
    });
});

