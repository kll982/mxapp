var url;
var numbir = 0;
mui.plusReady(function() {
	//点击添加图片 
});

function photoCenter(indexnum) {
	// console.log(num)
	if (mui.os.plus) {
		var a = [{
			title: '拍照'
		}, {
			title: '从手机相册选择'
		}];
		plus.nativeUI.actionSheet({
			// title:'修改头像',
			cancel: '取消',
			buttons: a
		}, function(b) {
			switch (b.index) {
				case 0:
					break;
				case 1:
					//拍照
					getImages(indexnum);
					break;
				case 2:
					//打开相册
					imageStatic(indexnum);
					break;
				default:
					break;
			}
		}, false);
	}
}
//拍照
function getImages(indexnum) {
	// console.log(num)
	var img_my = new Image();
	var mobileCamera = plus.camera.getCamera();
	mobileCamera.captureImage(function(e) {
		plus.io.resolveLocalFileSystemURL(e, function(entry) {
			var path = entry.toLocalURL();
			// 				uploadHeadImg(path);
			img_my.src = path; //设置img的路径

			//把图片base64编码  注意：这里必须在onload事件里执行！这给我坑的不轻
			img_my.onload = function() {
				var ext = img_my.src.split(".")[img_my.src.split(".").length - 1].toLowerCase();
				var data = getBase64Image(img_my, ext, indexnum); //base64编码
				// var newImgbase = data.split(",")[1]; //通过逗号分割到新的编码
				// imgArray.push(newImgbase); //放到imgArray数组里面
				// img_my.off('load'); //关闭加载
				// uploadimg(data); //图片上传
			}
		}, function(err) {
			console.log("读取拍照文件错误");
		});
	}, function(e) {
		console.log("er", err);
	}, function() {
		filename: '_doc/head.png';
	});
}
// 相册
function imageStatic(indexnum) {
	var img_my = new Image();
	// var imgArray=[];
	//打开相册（这里之前很多小伙伴问我，为什么打不开，因为我用的是H5+的方式，不适用于纯web页面）
	plus.gallery.pick(
		function(path) {
			img_my.src = path; //设置img的路径
			//把图片base64编码  注意：这里必须在onload事件里执行！这给我坑的不轻
			img_my.onload = function() {
				var ext = img_my.src.split(".")[img_my.src.split(".").length - 1].toLowerCase();
				var data = getBase64Image(img_my, ext, indexnum); //base64编码
				// var newImgbase = data.split(",")[1]; //通过逗号分割到新的编码
				// imgArray.push(newImgbase); //放到imgArray数组里面
				// img_my.off('load'); //关闭加载
				// console.log(uploadimg(data));
				// uploadimg(data); //图片上传
			}
		},
		function(e) {
			mui.toast('取消选择');
		});
}

//base64编码  压缩
function getBase64Image(img, ext, indexnum) {
	// 图片原始尺寸
	var originWidth = img.width;
	var originHeight = img.height;
	// 最大尺寸限制，可通过设置宽高来实现图片压缩程度
	var fullWidth = screen.availWidth,
		fullHeight = originHeight * screen.availWidth / originWidth;
	// 目标尺寸
	var canvas = document.createElement("canvas"); //创建canvas DOM元素，并设置其宽高和图片一样
	var ctx = canvas.getContext("2d");
	canvas.width = fullWidth;
	canvas.height = fullHeight;
	ctx.drawImage(img, 0, 0, fullWidth, fullHeight); //使用画布画图
	// canvas对图片进行缩放
	// 	canvas.width = targetWidth;
	// 	canvas.height = targetHeight;
	// 清除画布
	// 	ctx.clearRect(0, 0, targetWidth, targetHeight);
	// 	ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

	var dataURL = canvas.toDataURL("image/" + ext); //返回的是一串Base64编码的URL并指定格式
	if (ext == 'jpg') {
		dataURL = canvas.toDataURL("image/jpeg");
		uploadimg(dataURL.replace("data:image/jpeg;base64,", ""), ext, indexnum)
		return dataURL.replace("data:image/jpeg;base64,", "");
	} else {
		dataURL = canvas.toDataURL("image/png");
		uploadimg(dataURL.replace("data:image/png;base64,", ""), ext, indexnum)
		return dataURL.replace("data:image/png;base64,", "");
	}
	// console.log(dataURL.replace("data:image/png;base64,", ""));
}
//上传图片
// var num = -1;
var urls = [];

function uploadimg(imgArray, ext, indexnum) {
	const promist = new Promise(function(resolve, reject) {
		if (true) {
			var len = [];
			for (var index = 0; index < 100; index++) {
				if (imgArray.substring(index * 5000, (index + 1) * 5000) == '') {} else {
					len.push(imgArray.substring(index * 5000, (index + 1) * 5000))
				}
			}
			resolve(ajaxfuntion(len, indexnum))
		}
	})

	function ajaxfuntion(len, indexnum) {
		
		mui.ajax(localStorage.getItem("url") + "/oss/uploadTroublePic", {
			type: "post",
			data: {
				file: len,
				prefix: "." + ext,
			},
			type: 'post',
			timeout: 10000,
			header: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			dataType: 'json',
			xhrFields: {
				withCredentials: true
			},
			success: function(res) {
				numbir++
				// alert(JSON.stringify(res))
				if (res.code == 200) {
					url = res.data.url;
				
					var string = '<span id="'+ numbir +'photoImg'+ indexnum +'" class="photoImgBig"><img id="'+ numbir +
					'photoImgname'+ indexnum +  '" class="photname'+ indexnum +'" onClick="zudexiaochu('+ indexnum +','+ numbir +
					')" src="' + res.data.url +'"/><span class="zudexiaochu" id="zudexiaochu' + indexnum + 
					'" ><img onClick="deleteItem('+ indexnum +','+numbir +',event)" src="../../img/zudexiaochu13.png"/></span></span>'
					$('#photoCenter' + indexnum).append(string)
					return url;
				} else {
					mui.toast(res.message);
				}
			},
			error: function(xhr, type, errorThrown) {
				console.log(type);
				console.log(errorThrown);
				mui.toast('错误');
			}
		});
	}

}

function zudexiaochu(num,numbir) {
	var img = $('#'+numbir +'photoImgname' + num).attr('src')
	mui.openWindow({
		url: "../../js/img.html",
		id: "img",
		extras: {
			img: img,
		}
	})
}
function deleteItem(num,numbir,event){
	event.stopPropagation();
	$('#'+numbir +'photoImg' + num).html('')
	$('#'+numbir +'photoImg' + num).css('display','none')
}
