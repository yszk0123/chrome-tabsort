changed = require 'gulp-changed'
concat = require 'gulp-concat'
gulp = require 'gulp'
gutil = require 'gulp-util'
rename = require 'gulp-rename'
{resolve} = require 'path'

# 必要に応じて
# process.chdir(__dirname)

settings =
  development: true
  watchOptions: interval: 3000, debounceDelay: 1000
  src: './app'
  htmls: './app/*.{html,jade}'
  json: './app/*.json'
  plugins: [ ]
  scripts: './app/scripts/*.{js,coffee}'
  styles: './app/styles/*.{css,styl}'
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

  .task 'json', ->
    gulp.src settings.json
      .pipe gulp.dest(settings.dest)

  .task 'plugins', ->
    gulp.src(settings.plugins)
      .on 'error', gutil.log
      .pipe concat('plugins.js')
      .pipe gulp.dest(settings.build)

  .task 'scripts:background', ->
    browserify = require 'gulp-browserify'
    gulp.src "#{settings.src}/scripts/index.coffee", { read: false }
      .pipe browserify
        transform: ['coffeeify', 'jadify']
        extensions: ['.coffee']
        detectGlobals: false
      .on 'error', gutil.log
      .pipe rename('build.js')
      .pipe gulp.dest(settings.build)

  .task 'scripts:options', ->
    gulp.src "#{settings.src}/scripts/options.coffee", { read: false }
      .pipe gulp.dest(settings.dest)

  .task 'styles:options', ->
    stylus = require 'gulp-stylus'
    gulp.src("#{settings.src}/styles/options.styl")
      .pipe stylus()
      .on 'error', gutil.log
      .pipe gulp.dest(settings.dest)

  .task 'watch', ->
    options = settings.watchOptions
    gulp.watch settings.htmls, options, ['htmls']
    gulp.watch settings.plugins, options, ['plugins']
    gulp.watch settings.scripts, options, ['scripts']
    gulp.watch settings.styles, options, ['styles']

  .task 'scripts', ['scripts:background', 'scripts:options']
  .task 'styles', ['scripts:options']
  .task 'build', ['htmls', 'json', 'plugins', 'scripts', 'styles']
  .task 'default', ['watch']
