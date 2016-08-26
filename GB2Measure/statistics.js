// Summerize the match statistics for a fixed list of providers

const fs = require('fs');
var csv = require('fast-csv');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var prob = require('./prob.js');

var url = 'mongodb://localhost:27017/gb2data';
var regions = ['B', 'D', 'E', 'F', 'G', 'I', 'N', 'P', 'SC', 'SP', 'T'];
var book_keepers = ['B365', 'BS', 'BW', 'GB', 'IW', 'LB', 'PS', 'SO', 'SB', 'SJ', 'SY', 'VC', 'WH', 'QC365', 'QL365-1_0', 'QL730-1_0', 'QE365-1_0-1_5', 'QE730-1_0-1_5', 'QC730', 'QC1460', 'QL1460-1_0', 'QL1460-0_5', 'QE1460-1_0-0_5', 'QE1460-1_0--0_5'];
var id_hash = {};

var summarize_book_keeper = function(doc, book_keeper, result) {
    if (doc.hasOwnProperty(book_keeper + 'H')) {
      var h = doc[book_keeper + 'H'];
      var d = doc[book_keeper + 'D'];
      var a = doc[book_keeper + 'A'];
      var stdev = prob.getDev(h, d, a, result);
      return stdev;
    }
    else {
      return -1;
    }
}

var findStatistics = function(db, collectionName, callback) {
   var summary = [];
   var cursor =db.collection(collectionName).find().sort({Date: -1});
   cursor.each(function(err, doc) {
      assert.equal(err, null);
      if (doc != null) {
        if (doc.hasOwnProperty('FTR')) {
          //var id = doc['HomeTeam'] + '_' + doc['AwayTeam'] + '_' + doc['Date'].getFullYear() + '_' + doc['Date'].getMonth();
          var home = doc['HomeTeam'];
          var away = doc['AwayTeam'];
          var result = 0;
          if (doc['FTR'] == 'H') {
            result = 1;
          }
          else if (doc['FTR'] == 'D') {
            result = 0.5;
          }

          book_keepers.forEach(book_keeper => {
            var dev = summarize_book_keeper(doc, book_keeper, result);
            if (dev != -1) {
              var year = doc['Date'].getFullYear();
              var month = doc['Date'].getMonth();
              var id = home + '_' + away + '_' + year + '_' + month;
              var record = {
                'Home': home,
                'Away': away,
                'Region': collectionName,
                'Div': doc['Div'],
                'Year': year
              };
              record['Provider'] = book_keeper;
              record['Result'] = doc['FTR'];
              record['Deviation'] = dev;
              record['Variance'] = Math.pow(dev, 2);
              if (id_hash.hasOwnProperty(id)) {
                record['Count'] = 0;
              }
              else {
                record['Count'] = 1;
                id_hash[id] = 1;
              }

              summary.push(record);
            }
            else {
              //record[book_keeper] = null;
            }
          });
        }
      }
      else {
         callback(summary);
      }
   });
};

MongoClient.connect(url, function(err, db) {
  if(!err) {
    regions.forEach(region => {
      findStatistics(db, region, summary  => {
        var filename = region + '.csv';
        var ws = fs.createWriteStream(filename, {'flags': 'w'});
        csv
          .write(summary, {headers: false})
          .pipe(ws)
          .on('finish', () => {
            fs.appendFile(filename, '\n', err => {
              if (!err) {
                console.log('Summary completes for ' + region);
              }
              else {
                console.log('Error: ' + err);
              }
            });
          });
      });
    });
  }
  else {
    console.log(err);
  }
});
