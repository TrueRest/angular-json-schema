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
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      dist: {
        src: ['<%= yeoman.src %>/*.js', '<%= yeoman.src %>/**/*.js'],
        dest: '<%= yeoman.dist %>/angular-json-schema.js',
      },
    },
    yuidoc: {
      compile: {
        name: '<%= pkg.name %>',
        description: '<%= pkg.description %>',
        version: '<%= pkg.version %>',
        url: '<%= pkg.homepage %>',
        options: {
          paths: '<%= yeoman.src %>',
          themedir : "node_modules/yuidoc-bootstrap-theme",
          helpers : ["node_modules/yuidoc-bootstrap-theme/helpers/helpers.js"],
          outdir: 'docs/'
        }
      }
    }
  }, grunt.registerTask('doc', ['yuidoc']), grunt.registerTask('default', ['doc', 'concat']));
};
