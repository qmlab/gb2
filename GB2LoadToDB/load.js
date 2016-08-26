const fs = require('fs');
var csv = require('fast-csv');
var input_root = process.argv[2];
var collection = process.argv[3];
var input_folder = input_root + '\\' + collection;
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/gb2data';

if (typeof collection === 'undefined') {
  console.log("Usage: node Load.js <path> <collection>");
  process.exit(1);
}

MongoClient.connect(url, function(err, db) {

  fs.readdir(input_folder, (err, files) => {
    processDir(err, input_folder, files);
  });

  var processDir = function(err, root, files) {
    console.log('in processDir')
    if (err) {
      console.log(err);
      return;
    }

    assert.equal(null, err);
    files.forEach(el => {
      var path = root + '\\' + el;
      console.log(path);
      fs.stat(path, (err, stats) => {
        if (!stats.isDirectory()) {
          var header = [];
          csv.fromPath(path)
              .on("data", data => {
                if (header.length == 0) {
                  data.forEach((el, i, arr) => {
                    if (el.length > 0) {
                      header[i] = el;
                    }
                  })
                }
                else {
                  var record = {};
                  data.forEach((el, i, arr) => {
                    if ((typeof header[i] != 'undefined') && header[i].length > 0 && el.length > 0) {
                      if ('Date' == header[i]) {
                        var day = el.split('/')[0];
                        var month = el.split('/')[1] - 1;
                        var year = el.replace(/\/(9\d)$/, "/19$1")
                                             .replace(/\/(8\d)$/, "/19$1")
                                             .replace(/\/(7\d)$/, "/19$1")
                                             .replace(/\/(6\d)$/, "/19$1")
                                             .replace(/\/(0\d)$/, "/20$1")
                                             .replace(/\/(1\d)$/, "/20$1")
                                             .replace(/\/(2\d)$/, "/20$1")
                                             .replace(/\/(3\d)$/, "/20$1")
                                             .split('/')[2];
                        record[header[i].replace('.', '_')] = new Date(year, month, day);
                      }
                      else if ('FTHG' == header[i] || 'FTAG' == header[i] || 'HTHG' == header[i] || 'HTAG' == header[i]) {
                        record[header[i].replace('.', '_')] = parseInt(el);
                      }
                      else if ('Div' == header[i] || 'HomeTeam' == header[i] || 'AwayTeam' == header[i] || 'FTR' == header[i] || 'HTR' == header[i]){
                        record[header[i].replace('.', '_')] = el.trim();
                      }
                      else {
                        record[header[i].replace('.', '_')] = parseFloat(el);
                      }
                    }
                  })
                  if (Object.keys(record).length > 0) {
                    checkAndInsertDocument(db, collection, record, () => {
                      //console.log("Inserted a document into the " + collection + " collection.");
                    })
                  }
                }
              })
              .on("end", () => {
                console.log("END OF CSV");
              });
          }
          else {
            fs.readdir(path, (err, files) => {
              processDir(err, path, files);
            });
          }
        })
      })

    console.log('--db client ends');
  };

  console.log('--readdir ends');
});

var insertDocument = function(db, collectionName, record, callback) {
  db.collection(collectionName).insertOne(record, (err, result) => {
    if (err) {
      console.log(record);
    }
    assert.equal(err, null);
    callback();
  });
}

var checkAndInsertDocument = function(db, collectionName, record, callback) {
  var cursor = db.collection(collectionName).find( {'Div': record['Div'], 'Date': record['Date'], 'HomeTeam': record['HomeTeam'], 'AwayTeam': record['AwayTeam']} );
  cursor.count().then((number) => {
    if (0 == number) {
      insertDocument(db, collectionName, record, callback);
    }
  })
}
