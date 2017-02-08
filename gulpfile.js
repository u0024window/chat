var gulp = require('gulp');
var del = require('del');
// fs扩展模块
var fs = require('fs-extra');
var cssmin = require('gulp-cssmin');
var uglify = require('gulp-uglify');
// 本地服务器模块
var connect = require('gulp-connect');
// 本地服务器编译响应
var respond = require('gulp-respond');
var gulpScss = require('gulp-scss');
// tinypng图片压缩
var tinypng = require('gulp-tinypng-compress');
var dateFormat = require('date-format');

var gulpif = require('gulp-if');
var replace = require('gulp-replace');
// html标记build模块
var useref = require('gulp-useref');
var rename = require('gulp-rename');
// 支持comment的json
var cjson = require('cjson');
var filePaths = require('filepaths');
var clean = require('gulp-clean');
// task按照顺序执行
var runSequence = require('run-sequence');
var gcallback = require('gulp-callback');
// 控制台文本颜色插件
var colors = require('colors');
var gutil = require('gulp-util');
var nodeSass = require('node-sass');
// 以jQuery的方式处理html文件
var cheerio = require('gulp-cheerio');
// gulp错误处理插件
var plumber = require('gulp-plumber');

var serverApi = cjson.load('./server.json');
var args = process.argv.slice(2);
var cmd = 'serve';
var fileIndex = 0;
var config = {
    src: 'src',
    output: 'dist',
    tinypngCacheFile: 'src/img/tinypng.json',
	resourcePrefix: {
		serve: '../..',
		api: '/app/imview'
	}
};
var scssOptions = {
    tmpPath: '.sass-cache'
};
var timestamp = dateFormat('yyyyMMddhhmmss', new Date());

String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

function getParams(url) {
    var paramsObj = {};
    var paramsArr = url.split('?')[1] ? url.split('?')[1].split('&') : [];
    paramsArr.forEach(function(item) {
        paramsObj[item.split('=')[0]] = item.split('=')[1];
    });
    return paramsObj;
}

function outputHtml(path) {
    // var env = cmd == 'beta' ? 'prod' : cmd;
    // 将windows下的\替换成/
    path = path.replace(/\\/g, '/');
    var env = cmd;
    var htmlBuildPath = path.replace('./src/', '');
    var cssBuildPath = path.replace('./src/', 'css/')
        .replace('partials/', '')
        .replace('.jsp', '.min.css');
    var jsBuildPath = path.replace('./src/', 'js/')
        .replace('partials/', '')
        .replace('.jsp', '.min.js');
    var assets = useref.assets({
        searchPath: '{.,bower_components,src}'
    });
    var compileStream = gulp.src(path)
        .pipe(replace(/href=\"(.+\.scss)\"/g, function(match, $1) {
            // 根目录是src或bower_components
            var url = 'src' + $1;
            if (!fs.existsSync(url)) {
                url = 'bower_components' + $1;
            }
            var outUrl = scssOptions.tmpPath + '/' + url.replace('.scss', '.css');
            // 同步编译scss文件
            var result = nodeSass.renderSync({
                file: url
            });
            // 确认临时输出路径tmpPath存在
            fs.ensureFileSync(outUrl);
            // 同步写入编译后的css
            fs.writeFileSync(outUrl, result.css.toString());
            return 'href="' + outUrl + '"';
        }))
        .pipe(cheerio(function($, file) {
            $('script').each(function() {
                var $script = $(this);
                var url = $script.attr('src');
                var content = '';
                if (!url || /^\s*http/.test(url)) {
                    return;
                }
                if ($script.attr('ignore')) {
                    return;
                }
                url = url.trim();
                // 如果是bower的组件js，如果末尾没有分号则添加分号
                if (!fs.existsSync('src' + url)) {
                    url = 'bower_components' + url;
                    content = fs.readFileSync(url, 'utf8');
                    // 末尾没有分号才添加，避免组件被引入多次而添加了很多分号
                    if (!content.endsWith(';')) {
                        fs.appendFileSync(url, ';');
                    }
                }
            });
        }));

    // 如果是dev命令且--api=serve, 则接口使用假数据接口
    if (args[0] == 'dev' && args[1] == '--api=serve') {
        env = 'serve';
    }

    compileStream = compileStream
        .pipe(rename(htmlBuildPath))
        // 自动替换编译后的js和css路径
        .pipe(replace('[cssBuildPath]', cssBuildPath))
        .pipe(replace('[jsBuildPath]', jsBuildPath))
        .pipe(assets)
        .pipe(assets.restore())
        .pipe(useref());

    // 如果是dev命令且传参--not-min, 则不压缩js和css，方便dev环境调试
    if (!(args[0] == 'dev' && args[1] == '---')) {
        compileStream = compileStream
            .pipe(gulpif('*.js', uglify()))
            .on('error', function(content) {
                console.info('Error: '.red + content.fileName.magenta);
            })
            .on('error', gutil.log)
            .on('error', gutil.beep)
            .pipe(gulpif('*.css', cssmin()));
    }

	// 写死为api
	env = 'api';
    compileStream
		.pipe(gulpif('*.jsp', replace(/\{\{(\w+Data)\}\}/g, '<%=pageData%>')))
        .pipe(gulpif('*.js', replace(/\{\{(\w+Api)\}\}/g, function(match, $1) {
            return serverApi[$1][env];
        })))
        // string模版路径替换成对应的文件内容
        .pipe(gulpif('*.js', replace(/require\s*\(\s*[\'|\"]([\w+|\\|\/]+\.string)[\'|\"]\s*\)/g, function(match, $1) {
            return ('\'' + fs.readFileSync('src/templates/' + $1, 'utf8') + '\'').replace(/^\s+|\s+$|\n|\r\n/g, '');
        })))
        // view视图路径替换成对应的文件内容
        .pipe(gulpif('*.js', replace(/require\s*\(\s*[\'|\"]([\w+|\\|\/]+\.vue)[\'|\"]\s*\)/g, function(match, $1) {
            return ('\'' + fs.readFileSync('src/views/' + $1, 'utf8') + '\'').replace(/^\s+|\s+$|\n|\r\n/g, '');
        })))
        // 资源前缀替换
        .pipe(replace(/#resourcePrefix#/g, config.resourcePrefix[env]))
        // 引入css和js的入口加上时间戳，清除浏览器缓存
        .pipe(gulpif('*.jsp', replace(/(href=|src=)\"(.+\.css|.+\.js)\"/g, function(match, $1, $2) {
            if ($2.indexOf('request.getContextPath()') > -1 || $2.indexOf('/app/imview/') > -1 ||  $2.indexOf('http') > -1) {
                return $1 + '"' + $2 + '?_=' + timestamp + '"';
            } else {
                return $1 + '"/app/imview/' + $2 + '?_=' + timestamp + '"';
            }
        })))
        .pipe(gulpif('*.jsp', replace('&lt;%=request.getContextPath()%&gt;', '<%=request.getContextPath()%>')))
        .pipe(gulp.dest(config.output))
        .pipe(gulpif('*.jsp', gcallback(function() {
            console.log((++fileIndex + ': ').cyan + htmlBuildPath.white + '  Success'.green);
        })))
        .on('error', function() {
            console.log(htmlBuildPath.white + '  Error'.red);
        });
}

function outputImages() {
    // tinypng的开发者key
    var appKeys = [
        'xMYaN3BaIQv4U11qMTiKSHiRle-4CcQJ',
        'cXrHaVpfUyAxJETKGXUqXtMLkv6OXnSm',
        '2AkR2IApbA5LE7kIjkDczQxyahpOF4Sp',
        'v6aTztRcc56bCfGmvUf5H9o2lsK5UvK3'
    ];
    // 随机使用一个key, 避免达到每月最多500个压缩上限
    var appKey = appKeys[Math.floor(Math.random() * appKeys.length)];
    // 压缩历史纪录数据
    var tinypngCacheData = cjson.load(config.tinypngCacheFile);
    // 所有的图片路径
    var imgPaths = filePaths.getSync(config.src + '/img/');
    // 普通的拷贝, 不压缩图片
    var copy2dist = function(path, buildPath) {
        gulp.src(path)
            .pipe(rename(buildPath))
            .pipe(gulp.dest(config.output + '/img'));
    };
    imgPaths.forEach(function(path, index) {
        // 将windows下的\替换成/
        path = path.replace(/\\/g, '/');
        var buildPath = path.replace('./src/img/', '');
		var blackList = [
			'/notMin/',
			'/72x72/'
		];
		var checkBlackList = function(path) {
			for (var i = 0, len = blackList.length; i < len; i++) {
				if (path.indexOf(blackList[i]) > -1) {
					return false;
				}
			}
			return true;
		};
        // 压缩条件:
        // 1. png或jpg
        // 2. 非黑名单目录内的图片
        // 3. 未压缩过的图片(增量压缩)
        // 4. 只在dev环境进行图片压缩
        if (/(\.png|\.jpg|.jpeg)$/.test(path) && checkBlackList(path) && !tinypngCacheData[path] && cmd == 'dev') {
            gulp.src(path)
                .pipe(plumber({
                    errorHandler: function(err) {
                        // 若压缩失败，则进行平拷
                        copy2dist(path, buildPath);
                    }
                }))
                .pipe(rename(buildPath))
                .pipe(tinypng({
                    key: appKey,
                    log: true
                })).on('error', gutil.log)
                // 压缩后覆盖原始图片，以做增量压缩
                .pipe(gulp.dest(config.src + '/img'))
                // 压缩后输出dest
                .pipe(gulp.dest(config.output + '/img'))
                .pipe(gcallback(function() {
                    // 压缩成功，记入历史纪录文件
                    tinypngCacheData[path] = 1;
                    fs.writeFileSync(config.tinypngCacheFile,
                        JSON.stringify(tinypngCacheData, null, 4));
                }));
        } else {
            // 进行平拷
            copy2dist(path, buildPath);
        }
    });
}

gulp.task('htmls', function() {
    console.log('开始build html页面...'.cyan);
    var paths = filePaths.getSync(config.src + '/partials', {
        ext: '.jsp'
    });
    console.log(('共有' + paths.length + '个页面!').green);
    // build所有html页面
    paths.forEach(function(path, index) {
        outputHtml(path);
    });
});

gulp.task('reload', function() {
    serverApi = cjson.load('./server.json');
});

gulp.task('images', function() {
    console.log('开始build images图片...'.cyan);
    outputImages();
});

gulp.task('data', function() {
    console.log('开始copy data假数据...'.cyan);
    gulp.src(config.src + '/data/**')
        .pipe(gulp.dest(config.output + '/data'));
});

gulp.task('fonts', function() {
	console.log('开始copy fonts文件...'.cyan);
	gulp.src(config.src + '/fonts/**')
	.pipe(gulp.dest(config.output + '/css/fonts'));
});

gulp.task('connect', function() {
    var params = {};
    // 启动本地server
    connect.server({
        // 多个root目录
        root: ['src', './bower_components'],
        port: 8008,
        livereload: true,
        // 本地server中间件，完成本地动态编译
        middleware: function() {
            return [function(req, res, next) {
                var path = req.url.split('?').shift();
                path = path == '/' ? '/index.jsp' : path;
                // 获取运行时参数
                if (path.endsWith('.jsp')) {
                    params = getParams(req.url);
                }
                url = 'src' + path;
                if (!fs.existsSync(url)) {
                    url = 'bower_components' + path;
                }
				if (path.endsWith('.scss') || path.endsWith('.css')) {
					res.setHeader('content-type', 'text/css');
				}

				var prefixCondition = function(file) {
					var path = file.path;
					if (path.endsWith('.png') 
						|| path.endsWith('.jpg') 
						|| path.endsWith('.gif')) {
						return false;
					}
					return true;
				};

                gulp.src(url)
                    .pipe(gulpif('*.jsp', replace(/\{\{(\w+Data)\}\}/g, function(match, $1) {
						return JSON.stringify(cjson.load('src' + serverApi[$1]['serve']));
                    })))
                    .pipe(gulpif('*.js', replace(/\{\{(\w+Api)\}\}/g, function(match, $1) {
                        return serverApi[$1]['serve'];
                    })))
                    // string模版路径替换成对应的文件内容
                    .pipe(gulpif('*.js', replace(/require\s*\(\s*[\'|\"]([\w+|\\|\/]+\.string)[\'|\"]\s*\)/g, function(match, $1) {
                        return ('\'' + fs.readFileSync('src/templates/' + $1, 'utf8') + '\'').replace(/^\s+|\s+$|\n|\r\n/g, '');
                    })))
                    // view视图路径替换成对应的文件内容
                    .pipe(gulpif('*.js', replace(/require\s*\(\s*[\'|\"]([\w+|\\|\/]+\.vue)[\'|\"]\s*\)/g, function(match, $1) {
                        return ('\'' + fs.readFileSync('src/views/' + $1, 'utf8') + '\'').replace(/^\s+|\s+$|\n|\r\n/g, '');
                    })))
                    // 动态编译scss文件
                    .pipe(gulpif('*.scss', gulpScss(scssOptions)))
					// 资源前缀替换
					.pipe(gulpif(prefixCondition, replace(/#resourcePrefix#/g, config.resourcePrefix['serve'])))
                    .pipe(respond(res));
            }];
        }
    });
});

gulp.task('watch', function() {
    // api配置修改了，则自动重载本地server
    gulp.watch('./server.json', ['reload']);
});

gulp.task('clean', function() {
    console.log('开始clean dist目录...'.cyan);
    return gulp.src(config.output, {
            read: false
        })
        .pipe(clean());
});

gulp.task('replace:dev', function() {
    cmd = 'dev';
});

gulp.task('replace:beta', function() {
    cmd = 'beta';
});

gulp.task('replace:prod', function() {
    cmd = 'prod';
});

gulp.task('handle', ['htmls', 'images', 'fonts']);

// 开发环境
gulp.task('serve', ['connect', 'watch']);

// 联调环境
gulp.task('dev', function() {
    runSequence('clean', 'replace:dev', ['handle']);
});

// beta环境
gulp.task('beta', function() {
    runSequence('clean', 'replace:beta', ['handle']);
});

// 线上环境
gulp.task('build', function() {
    runSequence('clean', 'replace:prod', ['handle']);
});
