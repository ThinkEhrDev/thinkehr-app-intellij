var gulp = require('gulp');
var bower = require('gulp-bower');
var webserver = require('gulp-webserver');
var outDest = 'out/production/thinkehr-app-intellij';
var watch = require('gulp-watch');

gulp.task('bower', function() {
    return bower();
});

gulp.task('compile', function() {
    gulp.src('./vendor/**')
        .pipe(gulp.dest(outDest));

    gulp.src('./src/**')
        .pipe(gulp.dest(outDest));
});

gulp.task('default', ['bower'], function() {

});

gulp.task('stream', function () {
    return gulp.src('src/**')
        .pipe(watch('src/**'))
        .pipe(gulp.dest(outDest));
});

gulp.task('webserver', function() {
    gulp.src(outDest)
        .pipe(webserver({
            livereload: true,
            directoryListing: false,
            open: 'index.html',
            port: 8808
        }));
});

gulp.task('http', ['compile', 'stream', 'webserver'], function() {

});