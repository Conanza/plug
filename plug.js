var plug = {
  task: onTask
};

module.exports = plug;

var tasks = {};

function onTask (name, callback) {
  // register tasks
  tasks[name] = callback;
}
