'use strict';
var $ = require('gulp-load-plugins')();
var path = require('path');
var argv = require('minimist')(process.argv.slice(2));
var assign = require('object-assign');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var del = require('del');
var envify = require('envify/custom');
var gulp = require('gulp');
var merge = require('merge-stream');
var source = require('vinyl-source-stream');
var watchify = require('watchify');
var babelify = require('babelify');

// 各種設定
var RELEASE = Boolean(argv.release);
var pkg = require('./package.json');
var AUTOPREFIXER_BROWSERS = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];
var config = {
  srcDir: './app/',
  destDir: './dist/',
  manifest: './app/*.json',
  htmls: './app/htmls/*.{html,jade}',
  scripts: ['./app/scripts/*.js'],
  styles: ['./app/styles/app.less'],
  background: {
    routeFile: null,
    entryPath: './app/scripts/background.js'
  },
  options: {
    routeFile: null,
    entryPath: './app/scripts/options.js'
  }
};

function wrappedWatchify(opts) {
  return watchify(browserify(assign({}, watchify.args, opts)));
}

// clean

gulp.task('clean', function() {
  del(['.tmp', 'dist/*', '!dist/.git'], {dot: true});
});

// lint

gulp.task('lint', function() {
  return gulp.src(config.scripts)
    .pipe($.eslint())
    .pipe($.eslint.format());
    // .pipe($.eslint.failOnError());
});

// manifest

gulp.task('manifest', function() {
  return gulp.src(config.manifest, { base: config.srcDir })
    .pipe($.changed(config.destDir, { extension: '.json' }))
    .pipe(gulp.dest(config.destDir))
    .pipe($.size({ title: 'manifest' }));
});

// htmls

gulp.task('htmls', function() {
  return gulp.src(config.htmls, { base: config.srcDir })
    .pipe($.changed(config.destDir, { extension: '.html' }))
    .pipe($.jade({
      locals: {
        title: pkg.name
      }
    }))
    .pipe($.plumber())
    .on('error', $.util.log.bind($.util, 'Jade Error'))
    .pipe(gulp.dest(config.destDir))
    .pipe($.size({ title: 'htmls' }));
});

// scripts

gulp.task('scripts', function() {
  return merge(
    makeJSBundler(config.background),
    makeJSBundler(config.options)
  );
});

function makeJSBundler(customConfig) {
  var opts = {
    entries: customConfig.entryPath,
    debug: argv.debug
  };

  var b = (argv.watch ? wrappedWatchify : browserify)(opts);

  if (RELEASE) {
    b.transform(envify({
      // _: 'purge',
      NODE_ENV: 'production'
    }));
  }

  b.transform(babelify.configure({ stage: 2 }));

  b.on('update', bundle);
  b.on('log', $.util.log.bind($.util, 'Browserify Log'));
  return bundle();

  function bundle() {
    var name = path.basename(customConfig.entryPath);

    return b
      .bundle()
      .on('error', $.util.log.bind($.util, 'Browserify Error'))
      .pipe(source(name))
      .pipe(buffer())
      .pipe($.if(argv.debug, $.sourcemaps.init({ loadMaps: true })))
        .pipe($.if(RELEASE, $.uglify()))
      .pipe($.if(argv.debug, $.sourcemaps.write('./')))
      .pipe(gulp.dest(customConfig.destDir))
      .pipe($.size({ title: 'scripts:' + name }));
  }
}

// styles

gulp.task('styles', function() {
  return gulp.src(config.styles, { base: config.srcDir })
    .pipe($.less({
      sourceMap: !RELEASE,
      sourceMapBasepath: __dirname
    }))
    .pipe($.plumber())
    .on('error', $.util.log.bind($.util, 'Less Error'))
    .pipe($.autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
    .pipe($.csscomb())
    .pipe($.if(RELEASE, $.minifyCss()))
    .pipe(gulp.dest(config.destDir))
    .pipe($.size({ title: 'styles' }));
});

// test

gulp.task('test', function() {});

// watch

gulp.task('watch', ['build-without-scripts', 'scripts'], function() {
  gulp.watch(config.htmls, ['htmls']);
  gulp.watch(config.styles, ['styles']);
});

// default

gulp.task('build', ['manifest', 'htmls', 'scripts', 'styles']);
gulp.task('build-without-scripts', ['manifest', 'htmls', 'styles']);
gulp.task('default', ['build']);
