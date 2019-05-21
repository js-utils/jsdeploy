const archiver = require('archiver')
const fs = require('fs')
module.exports = function (paths, outputPath) {
  return new Promise((resolve, reject) => {
    let output = fs.createWriteStream(outputPath);
    let archive = archiver('zip', {
      zlib: { level: 9 } // Sets the compression level.
    });
    output.on('close', function() {
      console.log(archive.pointer() + ' total bytes');
      console.log('archiver has been finalized and the output file descriptor has closed.');
      resolve()
    })
    // good practice to catch this error explicitly
    archive.on('error', function(err) {
      console.log(err)
      reject(err)
    });
    // pipe archive data to the file
    archive.pipe(output);

    for (let path of paths) {
      console.log(path)
      archive.glob(path);
    }
    archive.finalize()
  })
}
