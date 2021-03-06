'use strict';

var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglifycss = require('gulp-uglifycss'),
    rename = require('gulp-rename'),
    del = require('del'),
    flatten = require('gulp-flatten');

gulp.task('build-css', function() {
	gulp.src([
        'src/app/state-flow/common/common.css',
		    'src/app/state-flow/**/*.css'
    ])
        .pipe(concat('state-flow.css'))
        .pipe(gulp.dest('dist/resources'));
});

gulp.task('build-css-prod', function() {
    gulp.src([
        'src/app/state-flow/common/common.css'
    ])
    .pipe(concat('state-flow.css'))
    .pipe(gulp.dest('dist/resources'))
    .pipe(uglifycss({"uglyComments": true}))
    .pipe(rename('state-flow.min.css'))
    .pipe(gulp.dest('dist/resources'));
});

gulp.task('copy-component-css', function () {
    gulp.src([
        'src/app/state-flow/**/*.css',
        'src/app/state-flow/**/images/*.png',
        'src/app/state-flow/**/images/*.gif'
    ])
    .pipe(gulp.dest('dist/resources/state-flow'));
});

gulp.task('images', function() {
    return gulp.src(['src/app/state-flow/**/images/*.png', 'src/app/state-flow/**/images/*.gif'])
        .pipe(flatten())
        .pipe(gulp.dest('dist/resources/images'));
});

//Cleaning previous gulp tasks from project
gulp.task('clean', function() {
	del(['dist/resources']);
});

//Copy readme
gulp.task('readme', function() {
    gulp.src(['README.md'])
    .pipe(gulp.dest('dist'));
});

//Building project with run sequence
gulp.task('build-assets', ['clean','copy-component-css', 'build-css-prod', 'images', 'readme']);

