changed = require 'gulp-changed'
gulp = require 'gulp'
gutil = require 'gulp-util'
rename = require 'gulp-rename'

# 必要に応じて
# process.chdir(__dirname)

settings =
  development: true
  watchOptions: interval: 3000, debounceDelay: 1000
  src: './app'
  htmls: './app/*.{html,jade}'
  manifest: './app/*.json'
  styles:
    src: './app/styles/*.{css,styl}'
    dest: './dist/styles'
  background:
    src: './app/background'
    scripts: './app/background/*.{js,coffee}'
    build: './dist/background/build'
  options:
    src: './app/options'
    scripts: './app/options/*.{js,coffee}'
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
    browserify = require 'gulp-browserify'
    gulp.src "#{settings.background.src}/index.coffee", { read: false }
      .pipe browserify
        transform: ['coffeeify', 'jadify']
        extensions: ['.coffee']
        detectGlobals: false
      .on 'error', gutil.log
      .pipe rename('build.js')
      .pipe gulp.dest(settings.background.build)

  .task 'options:scripts', ->
    browserify = require 'gulp-browserify'
    gulp.src "#{settings.options.src}/index.coffee", { read: false }
      .pipe browserify
        transform: ['coffeeify', 'jadify']
        extensions: ['.coffee']
        detectGlobals: false
      .on 'error', gutil.log
      .pipe rename('build.js')
      .pipe gulp.dest(settings.options.build)

  .task 'styles', ->
    stylus = require 'gulp-stylus'
    gulp.src(settings.styles.src)
      .pipe changed(settings.styles.dest, { extension: '.css' })
      .pipe stylus()
      .on 'error', gutil.log
      .pipe gulp.dest(settings.styles.dest)

  .task 'watch', ->
    options = settings.watchOptions
    gulp.watch settings.htmls, options, ['htmls']
    gulp.watch settings.background.scripts, options, ['background:scripts']
    gulp.watch settings.options.scripts, options, ['options:scripts']
    gulp.watch settings.styles.src, options, ['styles']

  .task 'background', ['background:scripts']
  .task 'options', ['options:scripts']
  .task 'build', ['htmls', 'manifest', 'background', 'options', 'styles']
  .task 'default', ['watch']
