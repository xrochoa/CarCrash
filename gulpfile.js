// Installer
//yarn add --dev --exact gulp gulp-imagemin gulp-htmlmin gulp-sass gulp-autoprefixer gulp-clean-css gulp-jshint jshint gulp-uglify del run-sequence browser-sync gulp-typescript imagemin-gifsicle imagemin-jpegtran imagemin-optipng imagemin-svgo gulp-include



/*----------  GULP FOR AN ANGULAR 2 APP  ----------*/

'use strict';

// GULP
var gulp = require('gulp');

// PLUGINS
//img
var imagemin = require('gulp-imagemin');

//html
var htmlmin = require('gulp-htmlmin');


//css
var sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cleanCSS = require('gulp-clean-css');

//js
var jshint = require('gulp-jshint'),
    typeScript = require('gulp-typescript'),
    include = require('gulp-include'),
    uglify = require('gulp-uglify');


//utils
var del = require('del'),
    runSequence = require('run-sequence'),
    sourcemaps = require('gulp-sourcemaps');

// Allows module reloading require project name
require.reload = function reload(path) {
    delete require.cache[require.resolve(path)];
    return require(path);
};

//server
var browserSync = require('browser-sync').create(),
    historyApiFallback = require('connect-history-api-fallback');


/*----------  CONFIGURATION  ----------*/

//const typeScriptConfig = require('./tsconfig.json');

const autoprefixerConfig = {
    browsers: [
        "Android 2.3",
        "Android >= 4",
        "Chrome >= 20",
        "Firefox >= 24",
        "Explorer >= 8",
        "iOS >= 6",
        "Opera >= 12",
        "Safari >= 6"
    ],
    cascade: false
};

const cleanCSSConfig = { compatibility: 'ie8' };

const gameCode = 'carcrash';

/*----------  TASKS  ----------*/

/*
CLEAN
*/

//Clean dist folder before tasks
gulp.task('clean', function() {
    return del(['dist/*']);
});

/*
RESOURCES
*/

//Copy all files from resources
gulp.task('res', function() {
    return gulp.src('./src/assets/res/**/*')
        .pipe(gulp.dest(`./dist/games/${gameCode}/assets/res`))
        .pipe(browserSync.stream());
});


/*
HTML
*/

//Minify html
gulp.task('html', function() {
    return gulp.src('./src/**/*.html')
        //.pipe(htmlmin({ collapseWhitespace: true })) //check options for angular
        .pipe(gulp.dest('./dist'))
        .pipe(browserSync.stream());

});

/*
IMAGES
*/

//Minify png, jpg, gif and svg images
gulp.task('img', function() {
    return gulp.src('./src/assets/**/img/**/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }]
        }))
        .pipe(gulp.dest(`./dist/games/${gameCode}/assets`))
        .pipe(browserSync.stream());
});


/*
JAVASCRIPT
*/



//Lint, bundle, minify javascript in assets (with sourcemaps)
gulp.task('js', function() {
    return gulp.src('./src/main.js')
        .pipe(sourcemaps.init())
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(include())
        .pipe(uglify())
        .pipe(gulp.dest(`./dist/games/${gameCode}`))
        .pipe(sourcemaps.write())
        .pipe(browserSync.stream());
});


/*
WATCH - DEFAULT
*/

//Watches Files For Changes
gulp.task('watch', function() {

    browserSync.init({
        server: {
            baseDir: ['dist'],
            middleware: [historyApiFallback()] //allows SPA behaviour always serving index
        },
        notify: {
            styles: {
                top: 'auto',
                bottom: '0'
            }
        },
        open: false
    });

    gulp.watch('./src/**/res/**/*', ['res']).on('change', browserSync.reload);
    gulp.watch('./src/**/img/**/*', ['img', 'html']).on('change', browserSync.reload);
    gulp.watch('./src/**/*.html', ['html']).on('change', browserSync.reload);
    gulp.watch('./src/**/*.js', ['js']).on('change', browserSync.reload);


});


// Default Task
gulp.task('default', function() {
    runSequence('clean', 'res', 'img', 'html', 'js', 'watch');
});
