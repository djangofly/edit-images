var images = require("images");
var fs = require("fs");     //fs核心模块中提供了一个  fs.readFile方法,来读取指定目录下的文件
var path = require('path');//解析需要遍历的文件夹
var filePath = path.resolve('./pre-processing-images');
var distPosition = path.resolve('./dist/images/');

//递归创建目录 异步方法  
function mkdirs(dirname, callback) {  
    fs.exists(dirname, function (exists) {  
        if (exists) {  
            callback();  
        } else {  
            //console.log(path.dirname(dirname));  
            mkdirs(path.dirname(dirname), function () {  
                fs.mkdir(dirname, callback);  
            });  
        }  
    });  
}  

//递归创建目录 同步方法  
function mkdirsSync(dirname) {  
    //console.log(dirname);  
    if (fs.existsSync(dirname)) {  
        return true;  
    } else {  
        if (mkdirsSync(path.dirname(dirname))) {  
            fs.mkdirSync(dirname);  
            return true;  
        }  
    }  
}  



mkdirsSync(distPosition , null);  
// mkdirs( distPosition , function(e) {  
//    console.log("目录创建完毕")  
// });  


//调用文件遍历方法
fileDisplay(filePath);
//文件遍历方法
function fileDisplay(filePath){
    //根据文件路径读取文件，返回文件列表
    fs.readdir(filePath,function(err,files){
        if(err){
            console.warn(err)
        }else{
            //遍历读取到的文件列表
            files.forEach(function(filename){
                console.log(filename);
                //获取当前文件的绝对路径
                var filedir = path.join(filePath, filename);
                //根据文件路径获取文件信息，返回一个fs.Stats对象
                fs.stat(filedir,function(eror, stats){
                    if(eror){
                        console.warn('获取文件stats失败');
                    }else{
                        var isFile = stats.isFile();//是文件
                        var isDir = stats.isDirectory();//是文件夹
                        //是以.jpg结尾的文件
                        if(isFile && /\.jpg$/.test(filename)){
                            console.log(filedir,"是以.jpg结尾的文件");
　　　　　　　　　　　　　　　　　// 读取文件内容
                            images(filedir)                           //Load image from file 
                                //加载图像文件
                                .size(400)                            //Geometric scaling the image to 400 pixels width
                                //等比缩放图像到400像素宽
                                //.draw(images("logo.png"), 10, 10)   //Drawn logo at coordinates (10,10)
                                //在(10,10)处绘制Logo
                                .save(distPosition+'/'+filename, {    //Save the image to a file, with the quality of 50
                                quality : 50                          //保存图片到文件,图片质量为50
                            });
                        }
                        if(isDir){
                            fileDisplay(filedir);//递归，如果是文件夹，就继续遍历该文件夹下面的文件
                        }
                    }
                })
            });
        }
    });
}
