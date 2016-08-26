// Combine the statistics files
const fs = require('fs');
var concat = require('concat-files');
var regions = ['summary_head', /*'B', 'D',*/ 'E', /*'F', 'G', 'I', 'N', 'P', 'SC', 'SP', 'T'*/];

var filenames = regions.map(filename => {
  return filename + '.csv';
})

concat(filenames, 'summary.csv', () => {
  console.log('Statiscs consolidation completes');
});
