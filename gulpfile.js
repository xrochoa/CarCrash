'use strict';

// GULP
var gulp = require('gulp');

// PLUGINS
//js
var jshint = require('gulp-jshint');
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');
//img
var imagemin = require('gulp-imagemin');
//html
var cdnizer = require("gulp-cdnizer");
//server
var nodemon = require('gulp-nodemon');
var livereload = require('gulp-livereload');
//utils
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var clean = require('gulp-clean');
var runSequence = require('run-sequence');


//Clean folders before tasks
gulp.task('clean', function() {
    return gulp.src(['dist/*'], {
            read: false
        })
        .pipe(clean());
});

//Lint Javascript
gulp.task('lintjs', function() {
    return gulp.src('src/js/app/**/*.js')
        .pipe(jshint({
            "browserify": true
        }))
        .pipe(jshint.reporter('default'));
});

//Browserify and Minify Javascript
gulp.task('bundlejs', function() {
    return gulp.src('src/js/app/app.js')
        .pipe(browserify())
        .pipe(rename(function(path) {
            path.basename = "bundle";
        }))
        .pipe(gulp.dest('src/js')) //bundles at source
        .pipe(uglify())
        .pipe(rename(function(path) {
            path.basename += ".min";
        }))
        .pipe(gulp.dest('dist/js'))
        .pipe(livereload());
});

//Minify images
gulp.task('img', function() {
    return gulp.src('src/assets/**/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }]
        }))
        .pipe(gulp.dest('dist/assets'))
        .pipe(livereload());
});

//Replaces local links with CDNs and minify html
gulp.task('html', function() {
    return gulp.src('src/**/*.html')
        .pipe(cdnizer([{
            file: 'phaser/build/phaser.js',
            package: 'phaser',
            cdn: 'https://cdnjs.cloudflare.com/ajax/libs/phaser/${ version }/phaser.min.js'
        }, {
            file: 'js/bundle.js',
            cdn: 'js/bundle.min.js'
        }]))
        .pipe(gulp.dest("dist"))
        .pipe(livereload());

});

//Watches Files For Changes
gulp.task('watch', function() {
    livereload.listen();
    gulp.watch('src/js/app/**/*.js', ['lintjs', 'bundlejs']);
    gulp.watch('src/**/*.html', ['html']);
    gulp.watch('src/assets/**/*', ['img']);
});

//Node server start
gulp.task('server', function() {
    nodemon({
        script: 'server.js'
    });
});

// Default Task
gulp.task('default', function() {
    runSequence('clean', 'lintjs', 'bundlejs', 'html', 'img', 'watch', 'server');
});