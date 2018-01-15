var fs = require('fs')
var shell = require('shelljs')
var argv = require('yargs').option('p', {
    alias : 'path',
    demand: true,
    describe: '使用 charles Mirror 功能对应的路径',
    type: 'string'
  }).option('a', {
    alias: 'auto',
    demand: false,
    describe: '自动打开浏览器搜索',
 	default: false,
    type: 'boolean'
  }).option('v', {
    alias: 'verbose',
    demand: false,
    describe: '显示所有的网络请求',
 	default: false,
    type: 'boolean'
  }).argv

var basePath = argv.path
if(! fs.existsSync(basePath)) {
	console.log("文件夹不存在")
	return
}

fs.watch(basePath, {recursive: true }, function(event, path) {

	var fullPath = basePath + "/" +  path
	if (fs.statSync(fullPath).isDirectory()) {
		return
	}
	fs.readFile(fullPath, function(err, result) {

		if (err) {
			return
		}
		if (argv.verbose) {
			console.log(result.toString())
		}		

		var jsonResult;
		try {
			jsonResult = JSON.parse(result.toString())
		}
		catch (err) {
			return
		}
	    if (jsonResult[0] != 'showQuestion') {
	    	return
	    }
	    var obj = jsonResult[1]
	    var desc = obj.desc
	    desc = desc.substring(desc.indexOf('.') + 1, desc.length - desc.indexOf('.'))
	    var options = JSON.parse(obj.options)

	    console.log(desc)
	    var content = ""
	    options.forEach(function(item, idx) {    	
	    	console.log(idx + 1 + "  " + item)
	    	content += idx + 1 + "  " + item + " "
	    })
   	    console.log("\n\n")

	    if (argv.auto) {
		    shell.exec('open -a /Applications/Safari.app https://www.baidu.com/s\?wd\=' + encodeURI(desc))
		    shell.exec("osascript -e 'display notification \"" + content + " ! !\" with title \"" + desc + "\"'")
	    }
	})
})

console.log("正在监听【冲顶大会】问题")