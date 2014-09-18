'use strict';
 
// thank you, https://gist.github.com/adion/7580522 

var
  LIVERELOAD_PORT = 35729,
  lrSnippet = require('connect-livereload')({ port: LIVERELOAD_PORT }),
  mountFolder = function( connect, dir ) {
    return connect.static(require('path').resolve(dir));
  };
 
module.exports = function( grunt ) {
 
  // load all grunt tasks
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-open');
 
  grunt.initConfig({
    watch: {
      livereload: {
        files: [
          '{,*/}*.*html',
          'static/{,*/}*.{css,js,png,jpg,gif,svg}'
        ],
        tasks: ['jshint'],
        options: {
          livereload: LIVERELOAD_PORT
        }
      }
    },
    connect: {
      options: {
        port: 9000,
        hostname: '0.0.0.0'
      },
      livereload: {
        options: {
          middleware: function( connect ) {
            return [
              lrSnippet,
              mountFolder(connect, './')
            ];
          }
        }
      }
    },
    open: {
      server: {
        url: 'http://localhost:<%= connect.options.port %>'
      }
    }
  });
 
  grunt.registerTask('server', function() {
    grunt.task.run([
      'connect:livereload',
      'open',
      'watch'
    ]);
  });
 
  grunt.registerTask('default', [ 'server' ]);
};