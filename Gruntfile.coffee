module.exports = (grunt) ->

    grunt.initConfig

        jshint:
            options:
                jshintrc: '.jshintrc'
            all: ['app/*.js']

        connect:
            server:
                options:
                    port: 9000
                    base: 'app'
                    keepalive: true

    grunt.loadNpmTasks 'grunt-contrib-jshint'
    grunt.loadNpmTasks 'grunt-contrib-connect'
