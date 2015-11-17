var _ = require('lodash');
var path = require('path');

module.exports = function(grunt) {
  'use strict';
  var recipeTemplate = grunt.file.read('./templates/blog/blog.hbs');

  var pages = _.flatten(_.map(grunt.file.expand('./content/*.json'), function(filepath) {
    var data = grunt.file.readJSON(filepath);
    return {
      filename: path.basename(filepath, path.extname(filepath)),
      data: data,
      content: recipeTemplate
    };
  }));

  grunt.initConfig({
    clean: ['dest/'],
    assemble: {
      options: {
        plugins: ['sitemap'],
        flatten: true,
        partials: ['templates/includes/*.hbs'],
        layoutdir: 'templates/layouts',
        data: 'content/blog/blogs.json',
        layout: 'default.hbs'
      },
      site: {
        files: {'dest/': ['templates/*.hbs']}
      },
      blogs: {
        options: {
          flatten: true,
          layoutdir: 'templates/layouts',
          data: 'content/*.json',
          partials: ['templates/includes/*.hbs'],
          pages: pages
        },
        files: [
          { dest: './dest/blog/', src: '!*' }
        ]
      }
    },
    copy: {
      assets: {
        files: [
          {expand: true, src: ['css/**'], dest: 'dest/'},
          {expand: true, src: ['js/**'], dest: 'dest/'}
        ]
      }
    },
    connect: {
      server: {
        options: {
          port: 9001,
          base: 'dest'
        }
      }
    },

    watch: {
      site: {
        files: ['Gruntfile.js', 'templates/**/*.hbs', 'js/**/*.js', 'css/**/*.js'],
        tasks: ['clean', 'assemble', 'copy']
      }
    }
  });

  grunt.loadNpmTasks('assemble');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.registerTask('dev', ['default', 'connect:server', 'watch:site']);
  grunt.registerTask('default', ['clean', 'assemble', 'copy']);
};
