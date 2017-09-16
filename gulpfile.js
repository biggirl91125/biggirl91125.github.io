/**
 * Created by chaowang211311 on 2017/9/6.
 */
var gulp = require('gulp');
var minifycss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var clean = require('gulp-clean');//清理文件或文件夹

var cssSrc = 'src/main/webapp/resources/css/source',
    cssDist = 'src/main/webapp/resources/css/dist';
var jsSrc = 'src/main/webapp/resources/js/source',
    jsDist = 'src/main/webapp/resources/js/dist';

// 压缩 CSS
gulp.task('minifycss', function() {
    gulp.src([cssSrc+'/**/*.css'])
        .pipe(minifycss({advanced:false,compatibility:'ie8'}))//1、不需要合并相同属性css，如background:#000;与background:rgba(0,0,0,.8);2、ie8兼容模式，如background:url('')no-repeat 0 0\9;这样的ie8不支持
        .pipe(gulp.dest(cssDist));
});
// 校验 js
gulp.task('lint', function() {
    return gulp.src(jsSrc+'/**/*.js')
        .pipe(jshint({"curly": true,"newcap": true,"noarg": true,"sub": true,"undef": true,"boss": true,"node": true}))
        .pipe(jshint.reporter('default'));
});
gulp.task('uglifyjs', function(event) {
    gulp.src([jsSrc + '/*.js', jsSrc + '/!(modules)/**/*.js'])
        .pipe(uglify())
        .pipe(gulp.dest(jsDist));
});
// 监听任务
gulp.task('watch',function(){
    gulp.watch(cssSrc + '/**/*.css', ['minifycss']);
    gulp.watch([jsSrc + '/*.js', jsSrc + '/!(modules)/**/*.js'], ['uglifyjs']);
});
// 发布
gulp.task('default', ['minifycss',/*'lint',*/'seajsModules','uglifyjs']);