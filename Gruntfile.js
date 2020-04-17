'use strict';
 
// thank you, https://gist.github.com/adion/7580522 

var
//  LIVERELOAD_PORT = 35729,
//  lrSnippet = require('connect-livereload')({ port: LIVERELOAD_PORT }),
  mountFolder = function( connect, dir ) {
    return serveStatic(require('path').resolve(dir));
  };
 
module.exports = function( grunt ) {
 
  // load all grunt tasks
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-open');
  grunt.loadNpmTasks('grunt-ssi');
 
  grunt.initConfig({
// what a pain in the ass redering server side includes was. Just to get these old grunt files working againg took hours.
// Now what happens is that the ssi: command puts a modified .shtml file that should do what we want it to do. 
    ssi: {
      options: {
        cache: 'all',
        baseDir: '.',
      },
      target: {
        files: [{
          expand: true,
          cwd: '.',
          src: ['**/*.html'],
          dest: '.tmp'
        }],
      }
    },
    watch: {
      options: {
        livereload: true,
      },
    },
    connect: {
      server: {
        options: {
          port: 9000,
//          keepAlive: true,  
          base: {
            path: '.',
            options: {
              index: '.tmp\\index.html',
    //         redirect: false,
            },
          },
        }
      },     
    },
    open: {
      file : {
        path : 'http://localhost:<%= connect.server.options.port %>'
      },
    }    
  });
 
  grunt.registerTask('server', function() {
    grunt.task.run([
      'ssi',
      'connect:server',
      'open:file',
      'watch'
    ]);
  });
 
  grunt.registerTask('default', [ 'server' ]);
};
