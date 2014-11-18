var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var minifyCSS = require('gulp-minify-css');
var browserSync = require('browser-sync');
var reload      = browserSync.reload;

gulp.task('js', function(){
 return gulp.src('static/js/*.js')
  .pipe(concat('all.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest('static/js'));
});

gulp.task('sass', function(){
 return gulp.src('static/css/*.scss')
        .pipe(sass())
        .pipe(minifyCSS())
        .pipe(gulp.dest('static/css'))
        .pipe(reload({stream:true}));
});

// browser-sync task for starting the server.
gulp.task('browser-sync', function() {
    return browserSync({
      server: {
          baseDir: "./"
      },
      ghostMode: {
  	    clicks: true,
  	    location: true,
  	    forms: true,
  	    scroll: true
  		},
  		open: "external",
      injectChanges: true, // inject CSS changes (false force a reload) 
      browser: ["google chrome"],
      scrollProportionally: true, // Sync viewports to TOP position
      scrollThrottle: 50,
    });
});

// Default task to be run with `gulp`
gulp.task('watch', ['sass', 'browser-sync'], function () {
    gulp.watch("static/css/*.scss", ['sass']);
});