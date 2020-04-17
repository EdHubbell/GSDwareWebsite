'use strict';
 
// thank you, https://gist.github.com/adion/7580522 
// april 2020 moved away from using server side includes because they are 
// difficult to deal with locally. So now we use bake to jam in html from where
// it needs to go. This took waaaay too long to accomplish. Like, 4 or 5 hours. It's 4AM. Fuuuck....

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
  grunt.loadNpmTasks('grunt-bake');

  grunt.initConfig({
    bake: {
      build: {
        files: {
            "404.html": "bake_html/404.html",
            "about.html": "bake_html/about.html",
            "burst.html": "bake_html/burst.html",
            "capitalize.html": "bake_html/capitalize.html",
            "cloud.html": "bake_html/cloud.html",
            "contact.html": "bake_html/contact.html",
            "contractDevelopment.html": "bake_html/contractDevelopment.html",
            "dataVisibility.html": "bake_html/dataVisibility.html",
            "faq.html": "bake_html/faq.html",
            "index.html": "bake_html/index.html",
            "iotTracking.html": "bake_html/iotTracking.html",
            "mobileDevices.html": "bake_html/mobileDevices.html",
            "productDevelopment.html": "bake_html/productDevelopment.html",
            "projectManagement.html": "bake_html/projectManagement.html",
            "relay.html": "bake_html/relay.html",
            "siteInfo.html": "bake_html/siteInfo.html",
            "team.html": "bake_html/team.html",
            "technology.html": "bake_html/technology.html",
            "windowsApps.html": "bake_html/windowsApps.html",
        }
      },
    },
    watch: {
      // can't get the livereload working. Fuck it. Hit refresh.
      options: {
        livereload: true
      },
      bake: {
        files: [ "bake_html/**" ],
        tasks: "bake:build"
      },
      html: {
        files: ['*.html']
      }
    },
    connect: {
      all: {
        options: {
          port: 9000,
          base: '.',
          hostname: '0.0.0.0',
          protocol: 'http',
          keepalive: true,
          livereload: true,
          open: true,          
        },       
      },     
    },
  });
 
  grunt.registerTask('server', ['bake:build', 'connect', 'watch' ]);
 
  grunt.registerTask('default', [ 'server' ]);
};
