const { src, dest, series, parallel, watch } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const terser = require("gulp-terser");
const cleanCSS = require("gulp-clean-css");
const htmlmin = require("gulp-htmlmin");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const browserSync = require("browser-sync").create();

const paths = {
  html: "src/*.html",
  styles: "src/scss/**/*.scss",
  scripts: "src/js/**/*.js",
  images: "src/images/**/*", 
  icons: "src/icons/**/*" 
};

function pages() {
  return src(paths.html)
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest("dist"))
    .pipe(browserSync.stream());
}

function styles() {
  return src(paths.styles)
    .pipe(sass().on("error", sass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(cleanCSS())
    .pipe(dest("dist/css"))
    .pipe(browserSync.stream());
}

async function images() {
  const imagemin = (await import('gulp-imagemin')).default;

  return src(paths.images)
    .pipe(imagemin([
      imagemin.gifsicle({ interlaced: true }),
      imagemin.mozjpeg({ quality: 75, progressive: true }),
      imagemin.optipng({ optimizationLevel: 5 }),
      imagemin.svgo({ plugins: [{ removeViewBox: false }, { cleanupIDs: false }] })
    ]))
    .pipe(dest("dist/images"))
    .pipe(browserSync.stream());
}

function icons() {
  return src(paths.icons)
    .pipe(dest("dist/icons"))
    .pipe(browserSync.stream());
}

function scripts() {
  return src(paths.scripts)
    .pipe(terser())
    .pipe(dest("dist/js"))
    .pipe(browserSync.stream());
}

function fonts() {
  return src('src/fonts/**/*')
    .pipe(dest('dist/fonts'));
}

function serve() {
  browserSync.init({
    server: {
      baseDir: "dist"
    }
  });

  watch(paths.html, pages);
  watch(paths.styles, styles);
  watch(paths.scripts, scripts);
  watch(paths.images, images);
  watch(paths.icons, icons);
}

exports.build = series(parallel(pages, styles, scripts, images, icons, fonts));
exports.default = series(exports.build, serve);
