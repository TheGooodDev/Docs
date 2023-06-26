const fs = require("fs");
const { parse } = require("csv-parse");


fs.createReadStream("./contacts.csv")
  .pipe(parse({ delimiter: ",", to:2}))
  .on("data", function (row) {
    console.log(row);
  })