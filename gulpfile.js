var gulp = require('gulp');
var bower = require('gulp-bower');

gulp.task('bower', function() {
    return bower();
});

gulp.task('default', ['bower'], function() {

});