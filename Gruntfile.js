'use strict';

module.exports = function (grunt) {

    grunt.initConfig({
        uglify: {
            scripts: {
                options: {
                    beautify: false,
                    compress: true,
                    mangle: false
                },
                files: {
                    'mp-widget/js/j-marketplace.js': [
                        "js/lib/3dparty/json2.js",
                        "js/lib/3dparty/jquery.min.js",
                        "js/lib/framepost.js",
                        "js/lib/3dparty/modernizr.js",
                        "js/lib/3dparty/ejs.js",
                        "js/lib/3dparty/bootstrap/tooltip.js",
                        "js/lib/3dparty/bootstrap/popover.js",
                        "js/data/countries.js",
                        "js/data/regions.js",
                        "js/JApp.js",
                        "js/marketplace.js",
                    ],
                }
            }
        },
        less: {
            src: {
                expand: true,
                cwd: "",
                src: [
                    "css/*.less",
                    "css/**/*.less",
                    "css/**/*.less"
                ],
                ext: ".css"
            }
        },
        csso: {
            restructure: {
                files: {
                    'mp-widget/css/j-marketplace.min.css': [
                        'css/flags.css',
                        'css/marketplace.css',
                    ],
                }
            }
        }
    });

    // Load tasks
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-csso');

    // Register tasks
    grunt.registerTask('build', [
        'less',
        'csso',
        'uglify:scripts',
    ]);

};