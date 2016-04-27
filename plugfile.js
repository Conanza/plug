var plug = require('./plug');
var rename = require('gulp-rename');

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
  return plug
    .src('test.txt')
    .pipe(rename('renamed.txt'))
    .pipe(plug.dest('tmp'));
});

plug.watch('test.txt', 'readwrite');
