import gulp from 'gulp';
import babel from 'gulp-babel';
import pug from 'gulp-pug';
import sass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import uglify from 'gulp-uglify';
import imagemin from 'gulp-imagemin';
import browserSync from 'browser-sync';

const reload = browserSync.reload;

const source = {
    server: '../dist',
    estructure: './*.pug',
    styles: './index.scss',
    scripts: 'js/*.js',
    images: 'img/*'
};

const dest = {
    estructure: '../dist',
    styles: '../dist/css',
    scripts: '../dist/js',
    images: '../dist/img'
}

gulp.task('server', () => {
    browserSync.init({
        server: source.server
    });
});
gulp.task('html', () => {
    return gulp.src(source.estructure)
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest(dest.estructure))
});

gulp.task('styles', () => {
    return gulp.src(source.styles)
        .pipe(sass({
            outputStyle: 'compressed'
        }))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest(dest.styles))
});

gulp.task('scripts', () => {
    return gulp.src(source.scripts)
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify())
        .pipe(gulp.dest(dest.scripts))
});

gulp.task('images', () => {
    return gulp.src(source.images)
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.jpegtran({progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({plugins: [{removeViewBox: true}]})
        ]))
        .pipe(gulp.dest(dest.images))
});

gulp.task('watch', () => {
    gulp.watch(source.estructure, ['html']);
    gulp.watch(source.styles, ['styles']);
    gulp.watch(source.scripts, ['scripts']);
    gulp.watch(source.images, ['images']);
   
    gulp.watch('../dist/*.html').on('change', reload);
    gulp.watch('../dist/css/*.css').on('change', reload);
    gulp.watch('..dist/js/*.js').on('change', reload);
});

gulp.task('default', ['html', 'styles', 'scripts', 'images', 'server', 'watch']);