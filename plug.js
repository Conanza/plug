var plug = {
  task: onTask
};

module.exports = plug;

var tasks = {};

function onTask (name, callback) {
  // register tasks
  tasks[name] = callback;
}

process.nextTick(() => {
  var taskName = process.argv[2];
  
  if (taskName && tasks[taskName]) {
    tasks[taskName]();
  } else {
    console.log('Unknown task', taskName);
  }
});
