const async = require('async');
const fs = require('fs');
const stream = require('stream');
const vfs = require('vinyl-fs');

const plug = {
  dest: onDest,
  parallel: onParallel,
  series: onSeries,
  src: onSrc,
  task: onTask,
  watch: onWatch
};

module.exports = plug;

var tasks = {};

function _processTask (taskName, callback) {
  var taskInfo = tasks[taskName];
  console.log('task ' + taskName + ' is started');

  var subTaskNames = taskInfo.series || taskInfo.parallel || [];
  var subTasks = subTaskNames.map(subTask => {
    return cb => {
      _processTask(subTask, cb);
    };
  });

  if (subTasks.length > 0) {
    if (taskInfo.series) {
      async.series(subTasks, taskInfo.callback);
    } else {
      async.parallel(subTasks, taskInfo.callback);
    }
  } else {
    var stream = taskInfo.callback();

    if (stream) {
      stream.on('end', () => {
        console.log('stream ' + taskName + ' is ended');
        callback();
      });
    } else {
      console.log('task ' + taskName + ' is completed');
      callback();
    }
  }
}

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

function onParallel (tasks) {
  return {
    parallel: tasks
  };
}

function onSeries (tasks) {
  return {
    series: tasks
  };
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

function onTask (name, subTasks, callback) {
  // register tasks and subtasks
  if (arguments.length < 2) {
    console.error('Invalid task registration', arguments);
    return;
  }

  if (arguments.length === 2) {
    if (typeof arguments[1] === 'function') {
      callback = subTasks;
      subTasks = { series: [] };
    }
  }

  tasks[name] = subTasks;
  tasks[name].callback = () => {
    if (callback) return callback();
  }
}

function onWatch (fileName, taskName) {
  fs.watchFile(fileName, (event, filename) => {
    if (filename) {
      runTask(taskName);
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
    _processTask(taskName);
  } else {
    console.log('Unknown task', taskName);
  }
});
