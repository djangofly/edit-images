var images = require("images");
var fs = require("fs");     //fs核心模块中提供了一个  fs.readFile方法,来读取指定目录下的文件
var path = require('path');//解析需要遍历的文件夹
var filePath = path.resolve('./0/[伊藤潤二X佐藤優][憂國的拉斯普金][東立]Vol.1');
var distPosition = path.resolve('./dist/images/');

/**
 * 递归创建目录
 * @param {String} dirname 
 * @param {bollon} sync 
 * @param {function} callback 
 * 
 */
var mkdirs = function(dirname,sync,callback){
    if(!callback){
        var callback = function(){}
    } 
    if(sync){ //同步方式创建 
        if (fs.existsSync(dirname)) {  
            return true;  
        } else {  
            if (mkdirs(path.dirname(dirname),false)) {  
                fs.mkdirSync(dirname);  
                return true;  
            }  
        }  
    }else{ //异步创建 默认
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
}

var i = 0;
/**
 * 将图片流左右切割 并返回
 * @param {*} img 
 * @param {*} leftName 
 * @param {*} rightName
 */
function longImgCut( img ){
    var width = img.size().width;
    var height = img.size().height;

    var imgLeftCut = images(img, 0, 0, width/2, height);
    var imgRightCut = images(img, (width/2+1), 0, width/2, height);

    return {
        left: imgLeftCut,
        right: imgRightCut
    };
}

/**
 * 
 * @param {buffer} img 图片流
 * @param {number} width 保存宽度
 * @param {number} quality 保存图片质量
 * @param {string} position 保存位置及文件名 './dist/images/a.jpg'
 */
function distPic( img, width, quality, position ){
    if(!quality) quality = 100;
    images(img)                           //Load image from file 
        //加载图像文件
        .size(width)                            //Geometric scaling the image to 400 pixels width
        //等比缩放图像到400像素宽
        //.draw(images("logo.png"), 10, 10)   //Drawn logo at coordinates (10,10)
        //在(10,10)处绘制Logo
        .save(position, {    //Save the image to a file, with the quality of 50
        quality : quality                          //保存图片到文件,图片质量为50
    });
}

mkdirs(distPosition , false);  

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
            files.forEach(function(filename,index){
                //console.log(filename);
                //获取当前文件的绝对路径
                var filedir = path.join(filePath, filename);
                //根据文件路径获取文件信息，返回一个fs.Stats对象
                fs.stat(filedir,function(eror, stats){
                    if(eror){
                        console.warn('获取文件stats失败');
                    }else{
                        var isFile = stats.isFile();//是文件
                        var isDir = stats.isDirectory();//是文件夹

                        if(isFile && /\.jpg$/.test(filename)){ //是以.jpg结尾的文件

                            var imgCut = longImgCut(images(filedir));
                            imgCut.left.save(distPosition+'/'+filename+'.jpg');

                        // }else if(isFile && /\.png$/.test(filename)){
                        //     console.log(filedir,"是以.png结尾的文件");
                        //     var jpgfile = images(filedir).encode("jpg", {operation:80});        //Load image from file 
                        //         images(jpgfile)  
                        //         //加载图像文件
                        //         .size(2400)                            //Geometric scaling the image to 400 pixels width
                        //         //等比缩放图像到400像素宽
                        //         //.draw(images("logo.png"), 10, 10)   //Drawn logo at coordinates (10,10)
                        //         //在(10,10)处绘制Logo
                        //         .save(distPosition+'/'+filename+'.jpg', {    //Save the image to a file, with the quality of 50
                        //             quality : 80                          //保存图片到文件,图片质量为50
                        //         });
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