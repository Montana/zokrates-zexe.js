const fs = require('fs');

/**
Reads the verification key file and extracts the key as a json object
*/
function extractVk(inputFile) {
  return new Promise((resolve, reject) => {
    fs.readFile(inputFile, (err, data) => {
      if (err) reject(err);
      resolve(JSON.parse(data));
    });
  });
}

module.exports = extractVk;
