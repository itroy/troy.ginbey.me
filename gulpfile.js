var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    util = require('gulp-util'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    minifyHTML = require('gulp-minify-html'),
    rename = require('gulp-rename'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    log = util.log;

// Globs
var sassFiles = 'assets/scss/**/*.scss',
    htmlFiles = '*.html';

// Error handling with Gulp Plumber
var gulp_src = gulp.src;

gulp.src = function() {
    return gulp_src.apply(gulp, arguments)
        .pipe(plumber(function(error) {
        // Output an error message
            util.log(util.colors.green('Error (' + error.plugin + '): ' + error.message));
        // emit the end event, to properly end the task
            this.emit('end');
        })
    );
};

gulp.task('sass', function() {
    log('Generate CSS files ' + (new Date()).toString());
    gulp.src(sassFiles)
        .pipe(sass({
            'require': 'susy'
        }))
            //.pipe(autoprefixer('last 3 version', 'safari 5', 'ie 8', 'ie 9'))
        .pipe(gulp.dest('dist/assets/css'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(minifycss())
        .pipe(gulp.dest('dist/assets/css'))
        .pipe(browserSync.stream());
});
gulp.task('html', function() {
    log('Generate HTML files ' + (new Date()).toString());
    gulp.src(htmlFiles)
        .pipe(minifyHTML())
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.stream());
})

gulp.task('serve', function() {
    browserSync.init({
        server: 'dist'
    });
    gulp.watch(sassFiles, ['sass']);
    gulp.watch(htmlFiles, ['html']);
});
