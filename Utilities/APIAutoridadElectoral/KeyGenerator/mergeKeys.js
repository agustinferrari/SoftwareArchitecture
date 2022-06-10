const fs = require("fs");

let finalFile = "../private-public-keysPM2.txt";

function readFiles(dirname) {
  fs.readdir(dirname, function (err, filenames) {
    if (err) {
      console.log(err);
      return;
    }
    filenames.forEach(function (filename) {
      let data = fs.readFileSync(dirname + filename);
      fs.appendFileSync(finalFile, data);
    });
  });
}
readFiles("../Keys");
