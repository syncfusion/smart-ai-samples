'use strict';

var gulp = require('gulp');

/** 
 * Compile TypeScript to JS
 */
gulp.task('compile', function (done) {
    var webpack = require('webpack');
    var webpackStream = require('webpack-stream');
    gulp.src(['./src/app/app.ts']).pipe(webpackStream({
        config: require('./webpack.config.js')
    }, webpack))
        .pipe(gulp.dest('./dist'))
        .on('end', function () {
            done();
        });
});

/**
 * Testing spec files
 */
var protractor = require('gulp-protractor').protractor;
var webdriver_standalone = require('gulp-protractor').webdriver_standalone;
var webdriver_update = require('gulp-protractor').webdriver_update_specific;

gulp.task('e2e-serve', webdriver_standalone);

gulp.task('e2e-webdriver-update', webdriver_update({
    webdriverManagerArgs: ['--ie', '--edge']
}));

gulp.task('e2e-test', gulp.series('compile', function (done) {
    var browserSync = require('browser-sync');
    var bs = browserSync.create('Essential JS 2');
    var options = {
        server: {
            baseDir: [
                './dist/',
            ],
            directory: true
        },
        ui: false,
        open: false,
        notify: false
    };
    bs.init(options, function () {
        gulp.src(['./spec/**/*.spec.js'])
            .pipe(protractor({
                configFile: 'e2e/protractor.conf.js'
            }))
            .on('error', function (e) {
                console.error('Error: ' + e.message);
                done();
                process.exit(1);
            })
            .on('end', function () {
                done();
                process.exit(0);
            });
    });
}));