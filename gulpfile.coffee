changed = require 'gulp-changed'
gulp = require 'gulp'
gutil = require 'gulp-util'
rename = require 'gulp-rename'
source = require 'vinyl-source-stream'
{resolve} = require 'path'

# 必要に応じて
# process.chdir(__dirname)

settings =
  development: true
  watchOptions: interval: 3000, debounceDelay: 1000
  browserifyOptions:
    extensions: '.coffee'
    detectGlobals: false
    basedir: __dirname
    # Note: watchifyがcacheオブジェクトが存在すると仮定しているようで, これがないとエラーになる
    cache: {}
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
  .task 'htmls', ->
    jade = require 'gulp-jade'
    gulp.src settings.htmls
      .pipe changed(settings.dest, { extension: '.html' })
      .pipe jade()
      .on 'error', gutil.log
      .pipe gulp.dest(settings.dest)

  .task 'manifest', ->
    gulp.src settings.manifest
      .pipe gulp.dest(settings.dest)

  .task 'background:scripts', ->
    browserify = require 'browserify'
    browserify(settings.background.index, settings.browserifyOptions
      .transform 'coffeeify'
      .transform 'jadify'
      .bundle()
      .pipe source('build.js')
      .pipe gulp.dest(settings.background.build)

  .task 'options:scripts', ->
    browserify = require 'browserify'
    browserify(settings.options.index, settings.browserifyOptions
      .transform 'coffeeify'
      .transform 'jadify'
      .bundle()
      .pipe source('build.js')
      .pipe gulp.dest(settings.options.build)

  .task 'styles', ->
    stylus = require 'gulp-stylus'
    gulp.src(settings.styles.src)
      .pipe changed(settings.styles.dest, { extension: '.css' })
      .pipe stylus()
      .on 'error', gutil.log
      .pipe gulp.dest(settings.styles.dest)

  .task 'watch', ->
    browserify = require 'browserify'
    watchify = require 'watchify'

    options = settings.watchOptions
    gulp.watch settings.htmls, options, ['htmls']
    gulp.watch settings.styles.src, options, ['styles']

    backgroundBundler = browserify(settings.background.index, settings.browserifyOptions
      .transform 'coffeeify'
      .transform 'jadify'

    backgroundRebundle = ->
      backgroundBundler.bundle()
        .on 'error', (err) -> gutil.log 'Browserify error', err
        .pipe source('build.js')
        .pipe gulp.dest(settings.background.build)

    watchify backgroundBundler
      .on 'update', backgroundRebundle
      .on 'log', (msg) -> gutil.log 'Browserify bundle', msg

    backgroundRebundle()

    optionsBundler = browserify(settings.options.index, settings.browserifyOptions
      .transform 'coffeeify'
      .transform 'jadify'

    optionsRebundle = ->
      optionsBundler.bundle()
        .on 'error', (err) -> gutil.log 'Browserify error', err
        .pipe source('build.js')
        .pipe gulp.dest(settings.options.build)

    watchify optionsBundler
      .on 'update', optionsRebundle
      .on 'log', (msg) -> gutil.log 'Browserify bundle', msg

    optionsRebundle()

  .task 'background', ['background:scripts']
  .task 'options', ['options:scripts']
  .task 'build', ['htmls', 'manifest', 'background', 'options', 'styles']
  .task 'default', ['watch']
