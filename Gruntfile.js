module.exports = function(grunt) {

    grunt.initConfig({
        concat: {
            options: {
                separator: ';'
            },
            scripts: {
                src: [
                    'static/js/profile.js',
                    'static/js/vendor/custom.modernizr.js',
                    'static/js/vendor/jquery.min.js',
                    'static/js/bootstrap.min.js',
                    'static/js/vendor/jquery.mobile-1.3.1.min.js'

                ],
                dest: 'static/dest/GTConcat.js'
            },
            css: {
                src: [
                    'static/css/jquery.mobile-1.3.1.min.css',
                    'static/css/normalize.css',
                    'static/css/global.css'


                ],
                dest: 'static/dest/GTConcat.css'
            }
        },
        jshint: {
            files: ['Gruntfile.js'],
            options: {
                // options here to override JSHint defaults
                globals: {
                    jQuery: true,
                    console: true,
                    module: true,
                    document: true
                }
            }
        },
        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['jshint', 'concat']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask('default', ['jshint', 'concat']);

};