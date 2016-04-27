const fs = require('fs');
const stream = require('stream');
const vfs = require('vinyl-fs');

const plug = {
  dest: onDest,
  src: onSrc,
  task: onTask,
  watch: onWatch
};

module.exports = plug;

var tasks = {};

function onDest (path) {
  // var writer = new stream.Writable({
  //   write: (chunk, encoding, next) => {
  //     if (!fs.existsSync(path)) fs.mkdirSync(path);
  //
  //     fs.writeFile(path + '/' + chunk.name + chunk.buffer, e => {
  //       next();
  //     });
  //   },
  //   objectMode: true
  // });
  //
  // return writer;

  // using vinyl-fs
  return vfs.dest(path);
}

function onSrc (filename) {
  // var src = new stream.Readable({
  //   read: chunk => {},
  //   objectMode: true
  // });
  //
  // fs.readFile(filename, 'utf8', (err, data) => {
  //   src.push({
  //     name: filename,
  //     buffer: data
  //   });
  //
  //   src.push(null);
  // });
  //
  // return src;

  // using vinyl-fs
  return vfs.src(filename);
}

function onTask (name) {
  // register tasks and subtasks
  if (Array.isArray(arguments[1]) && typeof arguments[2] === 'function') {
    tasks[name] = {
      subTasks: arguments[1],
      callback: arguments[2]
    };
  } else if (typeof arguments[1] === 'function') {
    tasks[name] = {
      subTasks: [],
      callback: arguments[1]
    };
  } else {
    console.log('Invalid task registration');
  }
}

function onWatch (fileName, taskName) {
  fs.watchFile(fileName, (event, filename) => {
    if (filename) {
      tasks[taskName]();
    }
  });
}

function runTask (name) {
  if (tasks[name].subTasks) {
    tasks[name].subTasks.forEach(subTaskName => {
      runTask(subTaskName);
    });
  }

  if (tasks[name].callback) {
    tasks[name].callback();
  }
}

process.nextTick(() => {
  var taskName = process.argv[2];

  if (taskName && tasks[taskName]) {
    runTask(taskName);
  } else {
    console.log('Unknown task', taskName);
  }
});
