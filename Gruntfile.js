'use strict';

module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      options: {
        jshintrc: '.jshintrc',
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib: {
        src: ['lib/**/*.js']
      },
      test: {
        src: ['test/spec/**/*.js']
      }
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      lib: {
        files: '<%= jshint.lib.src %>',
        tasks: ['jshint:lib', 'jasmine-node']
      },
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['jshint:test', 'jasmine-node']
      }
    },
    "jasmine-node": {
      run: {
        spec: "test/spec"
      },
      options: {
         growl: true
      },
      travis: {
        options: {
          growl: false
        }
      }
    },
    jsdoc: {
      dist: {
        src: ['lib/*.js', 'test/spec/*.js'],
        options: {
          destination: 'doc'
        }
      }
    }
});

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jasmine-node');
  grunt.loadNpmTasks('grunt-jsdoc');

  // Default task.
  //grunt.registerTask('default', ['jshint', 'nodeunit']);
  grunt.registerTask('default', ['jshint', 'jasmine-node', 'jsdoc:dist']);
  grunt.registerTask('travis', ['jshint', 'jasmine-node:travis']);
  grunt.registerTask('docs', ['jsdoc:dist']);

};
