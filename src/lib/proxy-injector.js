import harmon from 'harmon';
import loadFiles from './load-files';

function tagify(tag, contents) {
  return `<${ tag }>${ contents }</${ tag }>`;
}

// Generate harmon select to append contents to a query stream
function generateHarmonSelect(selector, contents) {
  const select = { query: selector };

  select.func = (node) => {
    const stream = node.createStream({ 'outer' : true });

    let innerHtml = '';

    stream.on('data', (data) => {
      innerHtml += data
    });

    stream.on('end', () => {
      stream.end(innerHtml + contents);
    });
  };

  return select;
}

function appendFiles(files, tag, selector) {
  const contents = files.map((file) => tagify(tag, file.contents)).join('');

  return generateHarmonSelect(selector, contents);
}

function filterFilesByExt(files, ext) {
  return files.filter(file => file.ext === ext);
}

function proxyInjector(filepaths) {
  return (req, res, next) => {
    loadFiles(filepaths, (files) => {
      const styles = filterFilesByExt(files, '.css');
      const scripts = filterFilesByExt(files, '.js');

      const selects = [];

      if (styles) selects.push(appendFiles(styles, 'style', 'head'));
      if (scripts) selects.push(appendFiles(scripts, 'script', 'body'));

      harmon([], selects)(req, res, next);
    });
  }
}

export default proxyInjector;
