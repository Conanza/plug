var plug = require('./plug');

plug.task('subTask1', () => {
  console.log('from sub task 1');
});

plug.task('subTask2', () => {
  console.log('from sub task 2');
});

plug.task('test', ['subTask1', 'subTask2'], () => {
  console.log('hello plug');
});

plug.task('readwrite', () => {
  plug.src('test.txt').pipe(plug.dest('tmp'));
});
