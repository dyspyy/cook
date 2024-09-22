const { src, dest, watch, parallel, series } = require('gulp');

const sass = require('gulp-dart-sass');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const browserSync = require('browser-sync').create();
const autoPrefixer = require('gulp-autoprefixer');
const clean = require('gulp-clean');
const include = require('gulp-file-include');
const ttf2woff2 = require('gulp-ttf2woff2');
const svgSprite = require('gulp-svg-sprite');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const plumber = require('gulp-plumber');
const babel = require('gulp-babel');
const cache = require('gulp-cache');
const imageminAvif = require('imagemin-avif');

const paths = {
  styles: {
    src: 'src/sass/**/*.sass',
    dest: 'src/css/'
  },
  scripts: {
    src: 'src/js/main.js',
    dest: 'src/js/'
  },
  images: {
    src: 'src/img/src/**/*.{png,jpg,jpeg}',
    dest: 'src/img/'
  },
  svg: {
    src: 'src/img/src/**/*.svg',
    dest: 'src/img/'
  },
  fonts: {
    src: 'src/fonts/src/*.ttf',
    dest: 'src/fonts/'
  },
  html: {
    src: 'src/pages/*.html',
    dest: 'src/'
  },
  components: 'src/components/'
};

function styles() {
  return src(paths.styles.src)
    .pipe(plumber())
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(autoPrefixer({ overrideBrowserslist: ['last 10 versions'] }))
    .pipe(concat('style.min.css'))
    .pipe(dest(paths.styles.dest))
    .pipe(browserSync.stream());
}

function html() {
  return src(paths.html.src)
    .pipe(plumber())
    .pipe(
      include({
        prefix: '@@',
        basepath: paths.components
      })
    )
    .pipe(dest(paths.html.dest))
    .pipe(browserSync.stream());
}

function fonts() {
  return src(paths.fonts.src)
    .pipe(plumber())
    .pipe(ttf2woff2())
    .pipe(dest(paths.fonts.dest));
}

function sprite() {
  return src('src/img/src/icons/*.svg')
    .pipe(plumber())
    .pipe(
      svgSprite({
        mode: {
          symbol: {
            sprite: '../sprite.svg',
          }
        }
      })
    )
    .pipe(dest(paths.images.dest));
}

function scripts() {
  return src(paths.scripts.src)
    .pipe(plumber())
    .pipe(
      babel({
        presets: ['@babel/env']
      })
    )
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest(paths.scripts.dest))
    .pipe(browserSync.stream());
}

function images() {
  return src(paths.images.src)
    .pipe(plumber())
    .pipe(
      cache(
        imagemin(
          [
            imagemin.mozjpeg({ quality: 80, progressive: true }),
            imagemin.optipng({ optimizationLevel: 5 }),
            imageminAvif({ quality: 50 })
          ],
          {
            verbose: true
          }
        )
      )
    )
    .pipe(dest(paths.images.dest))
    .pipe(webp())
    .pipe(dest(paths.images.dest));
}

function cleanDist() {
  return src('dist', { allowEmpty: true }).pipe(clean());
}

function clearCache(done) {
  cache.clearAll();
  done();
}

function build() {
  return src(
    [
      'src/css/style.min.css',
      'src/fonts/*.woff2',
      'src/js/main.min.js',
      'src/*.html',
      'src/img/**/*.{png,jpg,jpeg,svg,webp,avif}',
      '!src/img/src/**/*'
    ],
    { base: 'src' }
  ).pipe(dest('dist'));
}

function watcher() {
  browserSync.init({
    server: {
      baseDir: 'src/'
    }
  });
  watch(paths.styles.src, styles);
  watch([paths.scripts.src], scripts);
  watch([paths.components + '**/*', paths.html.src], html);
  watch('src/*.html').on('change', browserSync.reload);
  watch(paths.images.src, images);
  watch(paths.svg.src, sprite);
}

exports.build = series(
  clearCache,
  cleanDist,
  build
);

exports.default = series(
  parallel(images, fonts, sprite, styles, scripts, html),
  watcher
);

exports.styles = styles;
exports.html = html;
exports.fonts = fonts;
exports.scripts = scripts;
exports.images = images;
exports.sprite = sprite;
exports.cleanDist = cleanDist;
exports.clearCache = clearCache;
exports.watcher = watcher;
