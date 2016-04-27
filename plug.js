var plug = {
  task: onTask
};

module.exports = plug;

var tasks = {};

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

process.nextTick(() => {
  var taskName = process.argv[2];

  if (taskName && tasks[taskName]) {
    tasks[taskName]();
  } else {
    console.log('Unknown task', taskName);
  }
});
