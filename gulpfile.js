var gulp=require('gulp'),
    less=require('gulp-less'),
    watch=require('gulp-watch'),
    clean=require('gulp-clean'),
    //imagemin=require('gulp-imagemin'),
    cssmin=require('gulp-minify-css'),
    js=require('gulp-requirejs-optimize'),
    autoprefix=require('gulp-autoprefixer'),
    spriter = require('gulp-css-spriter'),
    ftp = require('gulp-ftp');

var webpack=require('webpack');

/**
 * 使用gulp-autoprefixer根据设置浏览器版本自动处理浏览器前缀。使用她我们可以很潇洒地写代码，不必考虑各浏览器兼容前缀
 * */
var path=require('path');
gulp.task('less', function () {
    gulp.src('./page/css/*.less')
    .pipe(less())
    .pipe(autoprefix())
    .pipe(cssmin())
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('jsConcat', function () {
    gulp.src('./entries/action/*.js')
    .pipe(js())
    .pipe(gulp.dest('./dist/js'))
});

/*gulp.task('images', function () {
    gulp.src('./dist/img/!*')
    .pipe(imagemin({
            optimizationLevel:7,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
    }))
});*/

gulp.task('spring', function () {
    var timestamp=+new Date();
    gulp.src('./dist/css/*.css')
    .pipe(spriter({
            'spriteSheet':'./dist/img/spring/sprite'+timestamp+'.png',
            'pathToSpriteSheetFromCSS':'../img/spring/sprite'+timestamp+'.png'
     }))
    .pipe(gulp.dest('./dist/css'))
});

gulp.task('copy', function () {
    gulp.src('./page/img/**/*.*')
    .pipe(gulp.dest('./dist/img'))
});
gulp.task('clear', function () {
    gulp.src('./dist',{read:false})
    .pipe(clean())
});

gulp.task('watch', function () {
    gulp.watch('./entries/**/*.js',['jsConcat']);
    gulp.watch('./page/css/*.less',['less']);
    gulp.watch('./page/img/*',['copy']);
});

gulp.task('ftp', function () {
    gulp.src('./dist/*')
    .pipe(ftp({
            host: '10.2.8.102',
            port:21,
            user:'product',
            pass:'PrM2015Q',
            remotePath:'/gulp'
     }))
});
gulp.task('default',['clear','copy','less','jsConcat','spring','watch']);
gulp.task('pro',['copy','less','jsConcat','spring']);
