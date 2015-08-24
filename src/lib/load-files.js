import fs from 'fs';
import path from 'path';
import { series } from 'clearhead/async';

function loadFiles(paths = [], callback) {
  const filepaths = typeof paths === 'string' ? [paths] : paths;
  const cwd = process.cwd();

  series(filepaths, (filepath, next, files = []) => {
    fs.readFile(path.resolve(cwd, filepath), 'utf8', (err, data) => {
      if (err) return console.log(err);
      next(files.concat({ ext: path.extname(filepath), contents: data }));
    });
  }, function done(files) {
    callback(files);
  });
}

export default loadFiles;
