/*
 * assemble-examples <https://github.com/assemble/assemble-examples>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT license.
 */

var _ = require('lodash');
var path = require('path');

module.exports = function(grunt) {
  'use strict';


  var recipeTemplate = grunt.file.read('./templates/blog.hbs');

// expand the data files and loop over each filepath
  var pages = _.flatten(_.map(grunt.file.expand('./content/*.json'), function(filepath) {
    var data = grunt.file.readJSON(filepath);

    // create a 'page' object to add to the 'pages' collection
    return {
      // the filename will determine how the page is named later
      filename: path.basename(filepath, path.extname(filepath)),
      // the data from the json file
      data: data,
      // add the recipe template as the page content
      content: recipeTemplate
    };
  }));

  grunt.initConfig({
    clean: ['dest/'],
    assemble: {
      options: {
        flatten: true,
        partials: ['templates/includes/*.hbs'],
        layoutdir: 'templates/layouts',
        data: 'content/blogs.json',
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
          {expand: true, src: ['js/**'], dest: 'dest/'},
          {expand: true, src: ['fancybox/**'], dest: 'dest/'}
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

  // Load the Assemble plugin.
  grunt.loadNpmTasks('assemble');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');

  // The default task to run with the `grunt` command.
  grunt.registerTask('dev', ['default', 'connect:server', 'watch:site']);
  grunt.registerTask('default', ['clean', 'assemble', 'copy']);
};
