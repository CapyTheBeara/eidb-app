module.exports = {
  main: {
    files: ['app/**/*', 'public/**/*', 'vendor/**/*', 'tests/**/*'],
    tasks: ['build:debug'],
    options: {
      livereload: true
    }
  },
  test: {
    files: ['app/**/*', 'public/**/*', 'vendor/**/*', 'tests/**/*'],
    tasks: ['build:debug', 'karma:server:run']
  },
  options: {
    debounceDelay: 200
  }
};
