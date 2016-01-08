import fs from 'fs'
import path from 'path'

function noop() {}

function dequeue(queue) {
  return { current: queue[0], remaining: queue.slice(1) };
}

/**
 * @desc series() applies an iterator to a series of items in an array.
 *
 * @param {Array} [queue=[]] - the array items to process
 * @param {Function} iterator - the iterator to apply to each item
 * @param {Function} done - callback to execute when series complete
 */
export function series(queue = [], iterator = noop, done = noop) {

  function iterate(queue, iterator, done, ...args) {
    const { current, remaining } = dequeue(queue);
    const next = iterate.bind(null, remaining, iterator, done);

    return current ? iterator(current, next, ...args) : done(...args);
  }

  return iterate(queue, iterator, done);
}

function loadFiles(paths = [], callback) {
  const filepaths = typeof paths === 'string' ? [paths] : paths
  const cwd = process.cwd()

  series(filepaths, (filepath, next, files = []) => {
    fs.readFile(path.resolve(cwd, filepath), 'utf8', (err, data) => {
      if (err) return console.log(err)
      next(files.concat({ ext: path.extname(filepath), contents: data }))
    })
  }, function done(files) {
    callback(files)
  })
}

export default loadFiles
