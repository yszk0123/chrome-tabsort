changed = require 'gulp-changed'
extend = require 'extend'
gulp = require 'gulp'
gutil = require 'gulp-util'
rename = require 'gulp-rename'
source = require 'vinyl-source-stream'
{resolve} = require 'path'

# 必要に応じて
# process.chdir(__dirname)

settings =
  development: true
  watchOptions: {} # interval: 3000, debounceDelay: 1000
  browserifyOptions:
    extensions: '.coffee'
    detectGlobals: false
    basedir: __dirname
  src: './app'
  htmls: './app/*.{html,jade}'
  manifest: './app/*.json'
  styles:
    src: './app/styles/*.{css,styl}'
    dest: './dist/styles'
  background:
    index: resolve './app/background/index.coffee'
    build: './dist/background/build'
  options:
    index: resolve './app/options/index.coffee'
    build: './dist/options/build'
  dest: './dist'
  build: './dist/build'

gulp
  .task 'html', ->
    jade = require 'gulp-jade'
    gulp.src settings.htmls
      .pipe changed(settings.dest, { extension: '.html' })
      .pipe jade()
      .on 'error', gutil.log
      .pipe gulp.dest(settings.dest)

  .task 'manifest', ->
    gulp.src settings.manifest
      .pipe gulp.dest(settings.dest)

  .task 'background:script', ->
    browserify = require 'browserify'
    browserify(settings.background.index, settings.browserifyOptions)
      .bundle()
      .pipe source('build.js')
      .pipe gulp.dest(settings.background.build)

  .task 'options:script', ->
    browserify = require 'browserify'
    browserify(settings.options.index, settings.browserifyOptions)
      .bundle()
      .pipe source('build.js')
      .pipe gulp.dest(settings.options.build)

  .task 'style', ->
    stylus = require 'gulp-stylus'
    gulp.src(settings.styles.src)
      .pipe changed(settings.styles.dest, { extension: '.css' })
      .pipe stylus()
      .on 'error', gutil.log
      .pipe gulp.dest(settings.styles.dest)

  .task 'watch', ->
    browserify = require 'browserify'
    watchify = require 'watchify'
    browserifyOptions = extend watchify.args, settings.browserifyOptions

    options = settings.watchOptions
    gulp.watch settings.htmls, options, ['html']
    gulp.watch settings.styles.src, options, ['style']

    backgroundBundler = browserify settings.background.index, browserifyOptions

    backgroundRebundle = ->
      backgroundBundler.bundle()
        .on 'error', (err) -> gutil.log 'Browserify error', err
        .pipe source('build.js')
        .pipe gulp.dest(settings.background.build)

    watchify backgroundBundler
      .on 'update', backgroundRebundle
      .on 'log', (msg) -> gutil.log 'Browserify bundle', msg

    backgroundRebundle()

    optionsBundler = browserify settings.options.index, settings.browserifyOptions

    optionsRebundle = ->
      optionsBundler.bundle()
        .on 'error', (err) -> gutil.log 'Browserify error', err
        .pipe source('build.js')
        .pipe gulp.dest(settings.options.build)

    watchify optionsBundler
      .on 'update', optionsRebundle
      .on 'log', (msg) -> gutil.log 'Browserify bundle', msg

    optionsRebundle()

  .task 'background', ['background:script']
  .task 'options', ['options:script']
  .task 'build', ['html', 'manifest', 'background', 'options', 'style']
  .task 'default', ['watch']
