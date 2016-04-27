const fs = require('fs');
const stream = require('stream');

const plug = {
  dest: onDest,
  src: onSrc,
  task: onTask
};

module.exports = plug;

var tasks = {};

function onDest (path) {
  var writer = new stream.Writable({
    write: (chunk, encoding, next) => {
      if (!fs.existsSync(path)) fs.mkdirSync(path);

      fs.writeFile(path + '/' + chunk.name + chunk.buffer, e => {
        next();
      });
    },
    objectMode: true
  });

  return writer;
}

function onSrc (path) {
  var src = new stream.Readable({
    read: chunk => {},
    objectMode: true
  });

  fs.readFile(path, 'utf8', (err, data) => {
    src.push({
      name: path,
      buffer: data
    });

    src.push(null);
  });

  return src;
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
