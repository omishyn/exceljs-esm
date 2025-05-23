'use strict';

// var babel = require('@rollup/plugin-babel').default;


module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-terser');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  // grunt.loadNpmTasks('grunt-rollup');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-exorcise');

  grunt.initConfig({
    babel: {
      options: {
        sourceMap: true,
        compact: false,
      },
      dist: {
        files: [
          {
            expand: true,
            src: ['./src/lib/**/*.js', './spec/browser/*.js'],
            dest: './build/',
          },
        ],
      },
    },
    browserify: {
      options: {
        transform: [
          [
            'babelify',
            {
              // enable babel transpile for node_modules
              global: true,
              presets: ['@babel/preset-env'],
              // core-js should not be transpiled
              // See https://github.com/zloirock/core-js/issues/514
              ignore: [/node_modules[\\/]core-js/],
            },
          ],
        ],
        browserifyOptions: {
          // enable source map for browserify
          debug: true,
          standalone: 'ExcelJS',
        },
      },
      bare: {
        // keep the original source for source maps
        src: ['./src/lib/exceljs.bare.js'],
        dest: './dist/exceljs.bare.js',
      },
      bundle: {
        // keep the original source for source maps
        src: ['./src/lib/exceljs.browser.js'],
        dest: './dist/exceljs.js',
      },
      spec: {
        options: {
          transform: null,
          browserifyOptions: null,
        },
        src: ['./build/spec/browser/exceljs.spec.js'],
        dest: './build/web/exceljs.spec.js',
      },
    },

    terser: {
      options: {
        output: {
          preamble: '/*! ExcelJS <%= grunt.template.today("dd-mm-yyyy") %> */\n',
          ascii_only: true,
        },
      },
      dist: {
        options: {
          // Keep the original source maps from browserify
          // See also https://www.npmjs.com/package/terser#source-map-options
          sourceMap: {
            content: 'inline',
            url: 'exceljs.min.js.map',
          },
        },
        files: {
          './dist/exceljs.min.js': ['./dist/exceljs.js'],
        },
      },
      bare: {
        options: {
          // Keep the original source maps from browserify
          // See also https://www.npmjs.com/package/terser#source-map-options
          sourceMap: {
            content: 'inline',
            url: 'exceljs.bare.min.js.map',
          },
        },
        files: {
          './dist/exceljs.bare.min.js': ['./dist/exceljs.bare.js'],
        },
      },
    },

    //
    // rollup: {
    //   options: {
    //     plugins: [
    //       babel({
    //         exclude: './node_modules/**',
    //       }),
    //     ],
    //   },
    //   esm: {
    //     files: {
    //       './dist/esm/index.js': './lib/exceljs.nodejs.js',
    //     },
    //   },
    // },

    // Move source maps to a separate file
    exorcise: {
      bundle: {
        options: {},
        files: {
          './dist/exceljs.js.map': ['./dist/exceljs.js'],
          './dist/exceljs.bare.js.map': ['./dist/exceljs.bare.js'],
        },
      },
    },

    copy: {
      dist: {
        files: [
          // {expand: true, src: ['**'], cwd: './build/lib', dest: './dist/es5'},
          // {src: './build/lib/exceljs.nodejs.js', dest: './dist/es5/index.js'},
          {src: './LICENSE', dest: './dist/LICENSE'},
          {src: './README.md', dest: './dist/README.md'},
          {src: './src/index.d.ts', dest: './dist/index.d.ts'},
          {src: './src/index.js', dest: './dist/index.js'},
          {src: './src/package.json', dest: './dist/package.json'},
        ],
      },
    },

    jasmine: {
      options: {
        version: '3.8.0',
        noSandbox: true,
      },
      dev: {
        src: ['./dist/exceljs.js'],
        options: {
          specs: './build/web/exceljs.spec.js',
        },
      },
    },
  });

  grunt.registerTask('build', ['babel:dist', 'browserify', 'terser', 'exorcise',
    // 'rollup',
    'copy']);
  grunt.registerTask('ug', ['terser']);
};
