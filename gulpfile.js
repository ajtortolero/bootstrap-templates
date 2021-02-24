// const gulp = require('gulp');
// const browserSync = require('browser-sync').create();
// const sass = require('gulp-sass');

// gulp.task('build', () => {
//   return gulp.src([
//     'node_modules/bootstrap/scss/bootstrap.scss',
//     'src/scss/*.scss'
//   ])
//     .pipe(sass({ outputStyle: 'compressed' }))
//     .pipe(gulp.dest('src/css'))
//     .pipe(browserSync.stream());
// });

// gulp.task('js', () => {
//   return gulp.src([
//     'node_modules/bootstrap/dist/js/bootstrap.min.js',
//     'node_modules/jquery/dist/jquery.min.js',
//     'node_modules/popper.js/dist/umd/popper.min.js'
//   ])
//     .pipe(gulp.dest('src/js'))
//     .pipe(browserSync.stream());
// });

// gulp.task('serve', ['build'], () => {
//   browserSync.init({
//     server: './src',
//     port: 3000
//   });

//   gulp.watch([
//     'node_modules/bootstrap/scss/bootstrap.min.scss',
//     'src/scss/*.scss'
//   ], ['build']);

//   gulp.watch('src/*.html').on('change', browserSync.reload);

// });

// gulp.task('font-awesome', () => {
//   return gulp.src('node_modules/font-awesome/css/font-awesome.min.css')
//     .pipe(gulp.dest('src/css'));
// })

// gulp.task('fonts', () => {
//   return gulp.src('node_modules/font-awesome/fonts/*')
//     .pipe(gulp.dest('src/fonts'));
// });

// gulp.task('default', ['js', 'serve', 'font-awesome', 'fonts'])

"use strict";

// Load plugins
const autoprefixer = require("gulp-autoprefixer");
const browsersync = require("browser-sync").create();
const cleanCSS = require("gulp-clean-css");
const del = require("del");
const gulp = require("gulp");
const header = require("gulp-header");
const merge = require("merge-stream");
const plumber = require("gulp-plumber");
const rename = require("gulp-rename");
const sass = require("gulp-sass");
const uglify = require("gulp-uglify");

// Load package.json for banner
const pkg = require('./package.json');

// Set the banner content
const banner = ['/*!\n',
  ' * FleetControl - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
  ' * Copyright 2020-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
  ' * Licensed under <%= pkg.license %>',
  ' */\n',
  '\n'
].join('');

// BrowserSync
function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: "src"
    },
    port: 3000
  });
  done();
}

// BrowserSync Reload
function browserSyncReload(done) {
  browsersync.reload();
  done();
}

// Clean vendor
function clean() {
  return del(["src/css"]);
}

// Bring third party dependencies from node_modules into vendor directory
function modules() {
  // Popper
  var popperJS = gulp.src('node_modules/popper.js/dist/umd/popper.js').pipe(gulp.dest('vendor/bootstrap/js'));

  // jQuery
  var jqueryJS = gulp.src(['node_modules/jquery/dist/jquery.js']).pipe(gulp.dest('vendor/bootstrap/js'));

  // Bootstrap JS
  var bootstrapJS = gulp.src('node_modules/bootstrap/dist/js/bootstrap.js').pipe(gulp.dest('vendor/bootstrap/js'));

  // Elektron SCSS
  var elektronJS = gulp.src('node_modules/elektron/dist/elektron.js').pipe(gulp.dest('vendor/elektron/js'));

  // MetisMenu JS
  var metismenuJS = gulp.src('node_modules/metismenujs/dist/metismenujs.js').pipe(gulp.dest('vendor/metismenu/js'));

  // MetisMenu JS
  var onoffcanvasJS = gulp.src('node_modules/onoffcanvas/dist/onoffcanvas.js').pipe(gulp.dest('vendor/onoffcanvas/js'));  

  // Kendo JS
  var kendoJS = gulp.src('node_modules/@progress/kendo-ui/js/kendo.all.js').pipe(gulp.dest('vendor/kendo/js'));    
  
  // Font Awesome
  var fontAwesome = gulp.src('node_modules/font-awesome/css/font-awesome.css').pipe(gulp.dest('vendor/bootstrap/fonts'));  

  // Bootstrap SCSS
  var bootstrapSCSS = gulp.src('node_modules/bootstrap/scss/**/*').pipe(gulp.dest('vendor/bootstrap/scss', { overwrite: false }));

  // Elektron SCSS
  var elektronSCSS = gulp.src('node_modules/elektron/scss/**/*').pipe(gulp.dest('vendor/elektron/scss', { overwrite: false }));

  // MetisMenu SCSS

  var metisMenuSCSS = gulp.src('node_modules/metismenujs/scss/**/*').pipe(gulp.dest('vendor/metismenu/scss', { overwrite: false }));  

  // OnOffCanvas SCSS
  var onoffcanvasSCSS = gulp.src('node_modules/onoffcanvas/scss/**/*').pipe(gulp.dest('vendor/onoffcanvas/scss', { overwrite: false })); 
  
  // Kendo
  var kendoSCSS = gulp.src("node_modules/@progress/kendo-theme-default/dist/all.scss").pipe(gulp.dest('vendor/kendo/scss', { overwrite: false })); 

  return merge(popperJS, jqueryJS, bootstrapJS, elektronJS, metismenuJS, onoffcanvasJS, kendoJS, fontAwesome, bootstrapSCSS, elektronSCSS, metisMenuSCSS, onoffcanvasSCSS, kendoSCSS);
}

// CSS Task
function css() {
  return gulp
    .src([
      'vendor/bootstrap/scss/**/*.scss',
      'vendor/bootstrap/fonts/*',
      'src/scss/*.scss'
    ])
    .pipe(plumber())
    .pipe(sass({ outputStyle: "compressed" }))
    .on("error", sass.logError)
    .pipe(autoprefixer({ cascade: false }))
    .pipe(gulp.dest("src/bootstrap/css"))
    .pipe(rename({ suffix: ".min" }))
    .pipe(cleanCSS())
    .pipe(gulp.dest("src/bootstrap/css"))
    .pipe(browsersync.stream());
}

// CSS Elektron Task
function cssElektron() {
  return gulp
    .src([
      'vendor/elektron/scss/**/*.scss'
    ])
    .pipe(plumber())
    .pipe(sass({ outputStyle: "compressed" }))
    .on("error", sass.logError)
    .pipe(autoprefixer({ cascade: false }))
    .pipe(gulp.dest("src/elektron/css"))
    .pipe(rename({ suffix: ".min" }))
    .pipe(cleanCSS())
    .pipe(gulp.dest("src/elektron/css"))
    .pipe(browsersync.stream());
}

// CSS MetisMenu Task
function cssMetisMenu() {
  return gulp
    .src([
      'vendor/metismenu/scss/**/*.scss'
    ])
    .pipe(plumber())
    .pipe(sass({ outputStyle: "compressed" }))
    .on("error", sass.logError)
    .pipe(autoprefixer({ cascade: false }))
    .pipe(gulp.dest("src/metismenu/css"))
    .pipe(rename({ suffix: ".min" }))
    .pipe(cleanCSS())
    .pipe(gulp.dest("src/metismenu/css"))
    .pipe(browsersync.stream());
}

// CSS OnOffCanvas Task
function cssOnOffCanvas() {
  return gulp
    .src([
      'vendor/onoffcanvas/scss/**/*.scss'
    ])
    .pipe(plumber())
    .pipe(sass({ outputStyle: "compressed" }))
    .on("error", sass.logError)
    .pipe(autoprefixer({ cascade: false }))
    .pipe(gulp.dest("src/onoffcanvas/css"))
    .pipe(rename({ suffix: ".min" }))
    .pipe(cleanCSS())
    .pipe(gulp.dest("src/onoffcanvas/css"))
    .pipe(browsersync.stream());
}

// CSS OnOffCanvas Task
function cssKendo() {
  return gulp
    .src([
      'vendor/kendo/scss/**/*.scss'
    ])
    .pipe(plumber())
    .pipe(sass({ outputStyle: "compressed" }))
    .on("error", sass.logError)
    .pipe(autoprefixer({ cascade: false }))
    .pipe(gulp.dest("src/kendo/css"))
    .pipe(rename({ suffix: ".min" }))
    .pipe(cleanCSS())
    .pipe(gulp.dest("src/kendo/css"))
    .pipe(browsersync.stream());
}

// JS Task
function js() {
  return gulp.src([
    'vendor/bootstrap/js/jquery.js',
    'vendor/bootstrap/js/popper.js',
    'vendor/bootstrap/js/bootstrap.js'
  ])
  .pipe(uglify())
  .pipe(header(banner, { pkg: pkg }))
  .pipe(rename({ suffix: '.min' }))
  .pipe(gulp.dest('src/bootstrap/js')).pipe(browsersync.stream());
}

// JS elektron Task
function jsElektron() {
  return gulp.src([
    'vendor/elektron/js/elektron.js'
  ])
  .pipe(uglify())
  .pipe(header(banner, { pkg: pkg }))
  .pipe(rename({ suffix: '.min' }))
  .pipe(gulp.dest('src/elektron/js')).pipe(browsersync.stream());
}

// JS MetisMenu Task
function jsMetisMenu() {
  return gulp.src([
    'vendor/metismenu/js/metismenujs.js'
  ])
  .pipe(uglify())
  .pipe(header(banner, { pkg: pkg }))
  .pipe(rename({ suffix: '.min' }))
  .pipe(gulp.dest('src/metismenu/js')).pipe(browsersync.stream());
}

// JS MetisMenu Task
function jsOnOffCanvas() {
  return gulp.src([
    'vendor/onoffcanvas/js/onoffcanvas.js'
  ])
  .pipe(uglify())
  .pipe(header(banner, { pkg: pkg }))
  .pipe(rename({ suffix: '.min' }))
  .pipe(gulp.dest('src/onoffcanvas/js')).pipe(browsersync.stream());
}

// JS MetisMenu Task
function jsKendo() {
  return gulp.src([
    'vendor/kendo/js/kendo.all.js'
  ])
  .pipe(uglify())
  .pipe(header(banner, { pkg: pkg }))
  .pipe(rename({ suffix: '.min' }))
  .pipe(gulp.dest('src/kendo/js')).pipe(browsersync.stream());
}

// Watch Files
function watchFiles() {
  gulp.watch("vendor/bootstrap/scss/**/*", css);
  gulp.watch("vendor/elektron/scss/**/*", cssElektron);
  gulp.watch("vendor/metismenu/scss/**/*", cssMetisMenu);
  gulp.watch("vendor/onoffcanvas/scss/**/*", cssOnOffCanvas);
  gulp.watch("vendor/kendo/scss/**/*", cssKendo);

  gulp.watch("vendor/bootstrap/js/*", js);
  gulp.watch("vendor/elektron/js/*", jsElektron);
  gulp.watch("vendor/metismenu/js/*", jsMetisMenu);
  gulp.watch("vendor/metismenu/js/*", jsOnOffCanvas);
  gulp.watch("vendor/metismenu/js/*", jsKendo);

  gulp.watch("src/*.html", browserSyncReload);
}

// Define Complex Tasks
const vendor = gulp.series(clean, modules);
const build = gulp.series(vendor, gulp.parallel(css, js, cssElektron, cssOnOffCanvas, jsElektron, cssMetisMenu, jsMetisMenu, jsOnOffCanvas, jsKendo, cssKendo));
const watch = gulp.series(build, gulp.parallel(watchFiles, browserSync));

// Export tasks
exports.css = css;
exports.js = js;
exports.clean = clean;
exports.vendor = vendor;
exports.build = build;
exports.watch = watch;
exports.default = build;

//const watcher = gulp.series(build, gulp.parallel(watchFiles, browserSync));