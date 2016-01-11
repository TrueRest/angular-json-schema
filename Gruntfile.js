'use strict';
var mountFolder;



mountFolder = function(connect, dir) {
  return connect["static"](require('path').resolve(dir));
};

module.exports = function(grunt) {
  var yeomanConfig;
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  
  yeomanConfig = {
    src: 'src',
    dist: 'dist'
  };
  return grunt.initConfig({
    yeoman: yeomanConfig,
    copy: {
      main: {
        src: '<%= yeoman.src %>/angular-rest.js',
        dest: '<%= yeoman.dist %>/angular-rest.js',
      },
    }
  }, grunt.registerTask('default', ['copy']));
};
