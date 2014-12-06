var filename = require('./test/testHelper.js').getCrxName();

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
            files: ['**/*', '!**/node_modules/**', '!src/app.js'],
            tasks: ['browserify']
        },
        crx: {
            myPublicPackage: {
                'filename': filename + '.crx',
                'src': 'src/',
                'dest': 'dist/',
                'privateKey': 'key.pem'
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
                jar: '/home/my8bit/selenium/selenium-server-standalone-2.43.1.jar'
            },
            your_target: {}
        },
        browserify: {
            options: {
                browserifyOptions: {
                    debug: true
                }
            },
            main: {
                src: ['src/navigate.js'],
                dest: 'src/app.js'
            }
        }
    });
    // 3. Where we tell Grunt we plan to use this plug-in.
    grunt.loadNpmTasks('grunt-selenium-simple');
    grunt.loadNpmTasks('grunt-http-server');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-crx');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-bower-installer');
    grunt.loadNpmTasks('grunt-browserify');
    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
    grunt.registerTask('default', ['bower', 'browserify', 'http-server', 'crx', 'selenium', 'mochaTest']);
};