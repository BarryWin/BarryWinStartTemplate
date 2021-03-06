const { src, dest, watch, series, parallel } = require('gulp');
const webpack = require('webpack-stream');

const pug = require('gulp-pug');
const prettify = require('gulp-jsbeautifier');

const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');

const named = require('vinyl-named');

const imagemin = require('gulp-imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');

const changed = require('gulp-changed');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const gulpif = require('gulp-if');
const del = require('del');
const browserSync = require('browser-sync');

const iconfont = require('gulp-iconfont');
const iconfontCss = require('gulp-iconfont-css');
const runTimestamp = Math.round(Date.now()/1000);

let env = process.env.NODE_ENV;

let fontName = 'icons';

function iconsFont() {
    return src(['src/images/iconsFont/*.svg']) // Source folder containing the SVG images
        .pipe(iconfontCss({
            fontName: fontName,
            path: './src/images/iconsFont/icons.css',
            targetPath: 'icons.css',
            fontPath: './'
        }))
        .pipe(iconfont({
            prependUnicode: false, // Recommended option
            fontName: fontName, // Name of the font
            fontHeight: 1000,
            normalize: true,
            centerHorizontally: true,
            formats: ['ttf', 'eot', 'woff'], // The font file formats that will be created
            timestamp: runTimestamp // Recommended to get consistent builds when watching files
        }))
        .pipe(dest('./public/fonts/iconsFont'));
};
exports.iconsFont = iconsFont;

function buildPug() {
    return src('./src/templates/*.pug')
        .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
        .pipe(changed('./src/templates/*.pug'))
        .pipe(pug())
        .pipe(prettify({}))
        .pipe(dest('./public'))
};
exports.buildPug = buildPug;

function buildScss() {
    return src('./src/scss/*.scss')
        .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
        .pipe(changed('./src/scss/*.scss'))
        .pipe(gulpif(env === 'development', sourcemaps.init()))
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            grid: true,
            // browsers: ['last 5 versions'],
            // cascade: false
        }))
        .pipe(cleanCSS())
        .pipe(gulpif(env === 'development', sourcemaps.write()))
        .pipe(dest('./public/css'))
};
exports.buildScss = buildScss;

function buildJs() {
    return src('./src/js/**/*.js')
        .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
        .pipe(changed('./src/js/**/*.js'))
        .pipe(named())
        .pipe(gulpif(env === 'development',
            webpack(require('./webpack.dev.conf')),
            webpack(require('./webpack.build.conf'))))
        .pipe(dest('./public/js'))
};
exports.buildJs = buildJs;

function buildImages() {
    return src('./src/images/**/*')
        .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
        .pipe(changed('./src/images/**/*'))
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.jpegtran({progressive: true}),
            imageminMozjpeg({quality: 90, progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: false}
                ]
            })
        ]))
        .pipe(dest('./public/images'))
};
exports.buildImages = buildImages;

function buildFonts() {
    return src('./src/fonts/**/*')
        .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
        .pipe(changed('./src/fonts/**/*'))
        .pipe(dest('./public/fonts'))
};
exports.buildFonts = buildFonts;

function serve(cb) {
    browserSync.init({
        server: "./public",
        port: 8080,
        host: "0.0.0.0"
    }, cb);
}
exports.serve = serve;

function reload(cb) {
    browserSync.reload();
    cb();
}

// function clear() {
//     return del([
//         './public/**/*',
//         '!./public/data',
//     ]);
// }
// exports.clear = clear;

function watcher() {
    watch('./src/templates/**/*.pug', series(buildPug, reload));
    watch('./src/scss/**/*.scss', series(buildScss, reload));
    watch('./src/js/**/*.js', series(buildJs, reload));
    watch('./src/images/**/*', series(buildImages, reload));
    watch('./src/fonts/**/*', series(buildFonts, reload));
}
exports.watcher = watcher;


exports.default = parallel(buildPug, buildScss, buildJs, buildImages, buildFonts, watcher, serve);
exports.build = parallel(buildPug, buildScss, buildJs, buildImages, buildFonts);
// exports.test = series(testPug, testScss);
