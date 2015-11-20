var _ = require('lodash');
var path = require('path');

module.exports = function (grunt) {
  'use strict';
  var recipeTemplate = grunt.file.read('./src/templates/blog/blog.hbs');

  var pages = _.flatten(_.map(grunt.file.expand('./content/*.json'), function (filepath) {
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
        partials: ['src/templates/includes/*.hbs'],
        layoutdir: 'src/templates/layouts',
        data: 'content/blog/articles.json',
        layout: 'default.hbs'
      },
      site: {
        files: {'dest/': ['src/templates/*.hbs']}
      },
      blogs: {
        options: {
          flatten: true,
          layoutdir: 'src/templates/layouts',
          data: 'content/*.json',
          partials: ['src/templates/includes/*.hbs'],
          pages: pages
        },
        files: [
          {dest: './dest/blog/', src: '!*'}
        ]
      }
    },
    copy: {
      assets: {
        files: [
          {expand: true, cwd: 'src/', src: ['css/**'], dest: 'dest/'},
          {expand: true, cwd: 'src/', src: ['js/**'], dest: 'dest/'},
          {expand: true, cwd: 'src/', src: ['public/**'], dest: 'dest/'}
        ]
      }
    },
    connect: {
      server: {
        options: {
          port: 9001,
          base: {
            path: 'dest',
            options: {
              index: 'index',
              maxAge: 300000
            }
          }
        }
      }
    },

    watch: {
      site: {
        files: ['Gruntfile.js', 'data/**/*.json', 'src/templates/**/*.hbs', 'src/js/**/*.js', 'src/css/**/*.css'],
        tasks: ['clean', 'assemble', 'copy']
      }
    },
    "merge-json": {
      "articleLists": {
        src: ["content/*.json"],
        dest: "content/blog/articles.json"
      }
    }
  });

  grunt.task.loadTasks('./tasks/');

  grunt.loadNpmTasks('assemble');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.registerTask('dev', ['default', 'connect:server', 'watch:site']);
  grunt.registerTask('default', ['clean', 'merge-json', 'assemble', 'copy']);
};
