'use strict'

if (process.env.NODE_ENV === 'development') {
  require('dotenv').config({ path: './.env.dev' })
}

var autoprefixer = require('autoprefixer')
var babel = require('gulp-babel')
var browserSync = require('browser-sync')
var concat = require('gulp-concat')
var cssnano = require('cssnano')
var gulp = require('gulp')
var htmlmin = require('gulp-htmlmin')
var imagemin = require('gulp-imagemin')
var postcss = require('gulp-postcss')
var pug = require('gulp-pug')
var replace = require('gulp-token-replace')
var sass = require('gulp-sass')
var uglify = require('gulp-uglify')

// consts
var buildDir = './build'
var srcDir = './src'

var pugDir = `${srcDir}/pug/**/*.pug`
var scssDir = `${srcDir}/scss/**/*.scss`
var jsDir = `${srcDir}/js/**/*.js`
var imgDir = `${srcDir}/img/**/*`

// build
function buildHTML(cb) {
  var htmlminOptions = { collapseWhitespace: true, removeComments: true }
  var srcOptions = [pugDir, `!${srcDir}/pug/views/**/*.pug`]

  gulp
    .src(srcOptions)
    .pipe(pug())
    .pipe(htmlmin(htmlminOptions))
    .pipe(gulp.dest(buildDir))
    .pipe(browserSync.stream())

  cb()
}

function buildCSS(cb) {
  var postcssPlugins = [autoprefixer(), cssnano()]

  gulp
    .src(scssDir, { sourcemaps: true })
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('index.css'))
    .pipe(postcss(postcssPlugins))
    .pipe(gulp.dest(`${buildDir}/css`, { sourcemaps: true }))
    .pipe(browserSync.stream())

  cb()
}

function buildJS(cb) {
  var replaceOptions = {
    global: {
      IPIFY_TOKEN: process.env.IPIFY_TOKEN,
      MAPBOX_TOKEN: process.env.MAPBOX_TOKEN,
    },
  }
  var babelOptions = {
    presets: ['@babel/env'],
  }

  gulp
    .src(jsDir, { sourcemaps: true })
    .pipe(replace(replaceOptions))
    .pipe(babel(babelOptions))
    .pipe(concat('index.js'))
    .pipe(uglify())
    .pipe(gulp.dest(`${buildDir}/js`, { sourcemaps: true }))
    .pipe(browserSync.stream())

  cb()
}

function buildImage(cb) {
  gulp
    .src(imgDir)
    .pipe(imagemin())
    .pipe(gulp.dest(`${buildDir}/img`))
    .pipe(browserSync.stream())

  cb()
}

// functions
function start(cb) {
  var browserSyncOptions = {
    server: buildDir,
  }

  browserSync.init(browserSyncOptions)

  gulp.watch(pugDir, buildHTML)
  gulp.watch(scssDir, buildCSS)
  gulp.watch(jsDir, buildJS)
  gulp.watch(imgDir, buildImage)

  gulp.watch([pugDir, scssDir, jsDir, imgDir]).on('change', browserSync.reload)

  cb()
}

// exports
exports.build = gulp.parallel(buildHTML, buildCSS, buildJS, buildImage)
exports.start = start
