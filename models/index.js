const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const uri = process.env.ATLAS_URI;
let client;

const db = {};
let connect = () => {
    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect((err) => {
    db.users = client.db("aloe").collection("user");
    console.log("connected");
    // perform actions on the collection object
    // client.close();



    // users.insert({ title:'스타워즈7', director:'JJ 에이브럼스', year:2015}).then(function(results) {
    //     // console.log('== Resolved\n', results);
    //     console.log('Promise Based Insert Result : ', results);
    //  }, function(err) {
    //     console.log('== Rejected\n', err);
    //  });

    });
};

module.exports = {connect, client, db};