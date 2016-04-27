var plug = require('./plug');
var rename = require('gulp-rename');

plug.task('subTask1', () => {
  console.log('from sub task 1');
  return plug
    .src('test1.txt')
    .pipe(plug.dest('tmp'));
});

plug.task('subTask2', () => {
  console.log('from sub task 2');
  return plug
    .src('test2.txt')
    .pipe(plug.dest('tmp'));
});

plug.task('test', ['subTask1', 'subTask2'], () => {
  console.log('hello plug');
});

plug.task('readwrite', () => {
  console.log('writing to tmp!');

  return plug
    .src('test.txt')
    .pipe(rename('renamed.txt'))
    .pipe(plug.dest('tmp'));
});

plug.task(
  'test-parallel',
  plug.parallel(['subTask1', 'subTask2']),
  () => {
    console.log('done');
  }
);

plug.task(
  'test-series',
  plug.series(['subTask1', 'subTask2']),
  () => {
    console.log('done');
  }
);

plug.watch('test.txt', 'readwrite');
