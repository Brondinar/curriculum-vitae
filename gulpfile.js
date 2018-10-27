'use strict';

const gulp = require('gulp');
const concat = require('gulp-concat');
const browserSync = require('browser-sync');
const reload = browserSync.reload;
const less = require('gulp-less');
const debug = require('gulp-debug');
const plumber = require('gulp-plumber');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const rollup = require('gulp-better-rollup');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const image = require('gulp-image');
const cache = require('gulp-cache');
const cleanCSS = require('gulp-clean-css');

const params = {
	out: 'public',
	htmlSrc: 'index.html'
}

gulp.task('server', function(callback) {
	browserSync.init({
		server: params.out
	});

	gulp.watch('*.html', gulp.series('html'));
	gulp.watch('less/**/*.less', gulp.series('style'));
	gulp.watch('js/**/*.js', gulp.series('js'));

	callback();
});

gulp.task('html', function() {
	return gulp.src(params.htmlSrc)
		.pipe(gulp.dest(params.out))
		.pipe(reload({ stream: true }));
});

gulp.task('image', function() {
	return gulp.src('img/*')
		.pipe(plumber())
		.pipe(cache(image()))
		.pipe(gulp.dest(params.out + '/img'))
		.pipe(reload({ stream: true }));
});

gulp.task('font', function() {
	return gulp.src('fonts/*')
		.pipe(gulp.dest(params.out + '/fonts'))
});

gulp.task('style', function() {
	return gulp.src('less/**/*.less')
		.pipe(plumber())
		.pipe(concat('style.css'))
		.pipe(less())
		.pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(cleanCSS())
		.pipe(gulp.dest(params.out))
		.pipe(reload({ stream: true }));
});

gulp.task('js-plugins', function() {
	return gulp.src('js/**/*.min.js')
		.pipe(gulp.dest(params.out))
		.pipe(reload({ stream: true }))

	callback();
});

gulp.task('js', gulp.series('js-plugins', function() {
	return gulp.src(['js/**/*.js', '!js/**/*.min.js'])
		// .pipe(plumber())
		// .pipe(sourcemaps.init())
		// .pipe(rollup({plugins: [babel()]}, {format: 'iife'}))
		.pipe(babel({
	      presets: ['@babel/preset-env']
	    }))
		.pipe(concat('scripts.js'))
		// .pipe(sourcemaps.write())
		.pipe(gulp.dest(params.out))
		// .pipe(rollup({plugins: [uglify()]}, {format: 'iife'}))
		.pipe(uglify())
		.pipe(rename('scripts.min.js'))
		.pipe(gulp.dest(params.out))
		.pipe(reload({ stream: true }));
}));

gulp.task('build', gulp.series('html', 'image', 'font', 'style', 'js'));

gulp.task('default', gulp.series('server', 'build'));