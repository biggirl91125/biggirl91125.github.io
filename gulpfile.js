/**
 * Created by chaowang211311 on 2017/9/6.
 */
var gulp = require('gulp');
var minifycss = require('gulp-minify-css');
var uglifyjs= require('gulp-uglify');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var clean = require('gulp-clean');//清理文件或文件夹
var rev=require('gulp-rev');
var rename=require('gulp-rename');

var cssSrc = 'css/src/',//路径要正确
    cssDist = 'css/dist/';
var jsSrc = 'js/src/',
    jsDist = 'js/dist/';

// 压缩 CSS
gulp.task('minifycss', function(){
    gulp.src([cssSrc+'*.css'])
        //.pipe(rename({suffix: '.min'}))
        .pipe(minifycss({advanced:false,compatibility:'ie8'}))//1、不需要合并相同属性css，如background:#000;与background:rgba(0,0,0,.8);2、ie8兼容模式，如background:url('')no-repeat 0 0\9;这样的ie8不支持
        .pipe(concat('all.min.css'))
        .pipe(rev())
        //.pipe(rev.manifest())
        .pipe(gulp.dest(cssDist));
});
// 校验 js
gulp.task('jshint', function() {
    return gulp.src(jsSrc+'**/*.js')
        .pipe(jshint({"curly": true,"newcap": true,"noarg": true,"sub": true,"undef": true,"boss": true,"node": true}))
        .pipe(jshint.reporter('default'));
});
gulp.task('concatjs', function(event) {
    gulp.src([jsSrc + '**/*.js','!'+jsSrc+'*.js'])
        //.pipe(rename({suffix: '.min'}))
        //.pipe(uglify())
        .pipe(concat('plugin.min.js'))
        .pipe(rev())
        //.pipe(rev.manifest())
        .pipe(gulp.dest(jsDist));
});
gulp.task('uglifyjs', function(event) {
    gulp.src([jsSrc+'*.js'])
    //.pipe(rename({suffix: '.min'}))
        .pipe(uglifyjs())
        .pipe(concat('scripts.min.js'))
        .pipe(rev())
        //.pipe(rev.manifest())
        .pipe(gulp.dest(jsDist));
});
// 监听任务
gulp.task('watch',function(){
    gulp.watch(cssSrc + '*.css', ['minifycss']);
    gulp.watch([jsSrc + '*.js'], ['uglifyjs']);
});
// 发布
gulp.task('default', ['minifycss','concatjs','uglifyjs']);