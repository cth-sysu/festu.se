var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var nodemon = require('gulp-nodemon');

// process JS files and return the stream.
gulp.task('js', function () {
    return gulp.src('./static/public/js/*js')
});

gulp.task('html', function () {
    return gulp.src('./static/public/*html')
});

gulp.task('css', function () {
    return gulp.src('./static/public/css/*css')
});

// create a task that ensures the `js` task is complete before
// reloading browsers
gulp.task('js-watch', ['js'], function() {
    browserSync.reload();
});

gulp.task('html-watch', ['html'], function() {
    browserSync.reload();
});

gulp.task('css-watch', ['css'], function() {
    browserSync.reload();
});

// use default task to launch Browsersync and watch JS files
gulp.task('serve', ['nodemon'], function () {

    // Serve files from the root of this project
    browserSync.init({
        server: {
            baseDir: "./static/public/",
            index: "index.html",
            browser: "google chrome",
        	port: 3002,
        }
    });

    // add browserSync.reload to the tasks array to make
    // all browsers reload after tasks are complete.
    gulp.watch("./static/public/js/*.js", ['js-watch']);
    gulp.watch("./static/public/*.html", ['html-watch']);
    gulp.watch("./static/public/css/*.css", ['css-watch']);
});

gulp.task('nodemon', function (cb) {
	
	var started = false;
	
	return nodemon({
		script: 'server.js'
	}).on('start', function () {
		// to avoid nodemon being started multiple times
		// thanks @matthisk
		if (!started) {
			cb();
			started = true; 
		} 
	});
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['serve']);