'use strict';

var filename = require('./test/testHelper.js').getCrxName(),
    jar = require('selenium-server-standalone-jar');


module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    growl: true
                },
                src: ['test/**/*.js']
            }
        },
        watch: {
            files: ['**/*', '!**/node_modules/**'],
            tasks: ['crx', 'mochaTest']
        },
        crx: {
            myPublicPackage: {
                'filename': filename + '.crx',
                'src': 'src/**/*',
                'dest': 'dist/',
                'privateKey': '~./ssh/key.pem'
            }
        },
        bower: {
            install: {
                options: {
                    targetDir: './src',
                    install: true,
                    verbose: true,
                    cleanTargetDir: false,
                    cleanBowerDir: false,
                    bowerOptions: {}
                }
            }
        },
        'http-server': {
            dev: {
                root: 'test',
                port: 8765,
                host: 'localhost',
                showDir: true,
                autoIndex: true,
                runInBackground: true
            }
        },
        selenium: {
            options: {
                jar: jar.path
            },
            your_target: {}
        }
    });
    // 3. Where we tell Grunt we plan to use this plug-in.
    grunt.loadNpmTasks('grunt-selenium-simple');
    grunt.loadNpmTasks('grunt-http-server');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-crx');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-bower-installer');
    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
    grunt.registerTask('default', ['bower', 'http-server', 'crx', 'selenium', 'mochaTest']);

};
