
var year_raw = process.argv[2];
                        var year = year_raw.replace(/\/(9\d)$/, "/19$1")
                                             .replace(/\/(8\d)$/, "/19$1")
                                             .replace(/\/(7\d)$/, "/19$1")
                                             .replace(/\/(6\d)$/, "/19$1")
                                             .replace(/\/(0\d)$/, "/20$1")
                                             .replace(/\/(1\d)$/, "/20$1")
                                             .replace(/\/(2\d)$/, "/20$1")
                                             .replace(/\/(3\d)$/, "/20$1");

console.log(year)
