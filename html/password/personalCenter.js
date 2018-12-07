
window.login = localStorage.getItem("login");
window.url = localStorage.getItem("url");

// 手机号判断
var reg = /^1[3-9][0-9]{9}/;

function PersonalCenter() {
	var _this = this;
	// 模态窗
	var modelWrap = document.getElementById("model-wrap"),
		modelTitle = document.getElementById("model-title"),
		modelCenter = document.getElementById("model-center"),
		modelClose = document.getElementById("model-close"),
		
		telValue = document.getElementById("tel"),
		loginPassword = document.getElementById("loginPassword"),
		registerPassword = document.getElementById("registerPassword"),
		newCode = document.getElementById("newPassword"),
		confirmCode = document.getElementById("confirmCode");

	// 跳转 个人中心
	this.GoTOPersonal = function() {
		mui.ajax(localStorage.getItem("login")+"/checkSSO",{
			success:function(res){
				console.log(JSON.stringify(res));
				if(res.code == 600 || res.data.response.ok == false){
					mui.openWindow({
						url: "./html/login/login.html",
						id: "./html/login/login",
						styles: {
							top: 0, //新页面顶部位置
							bottom: 0, //新页面底部位置
						},
					});
					mui.toast("请登录");
				}else{
					mui.openWindow({
						url: 'html/personalCenter/personalCenter.html',
						id: "html/personalCenter/personalCenter",
						styles: {
							top: 0, //新页面顶部位置
							bottom: 0, //新页面底部位置
						},
					})
				}
			}
		})
	}

	// 跳转 修改密码
	this.resetPassword = function() {
		mui.openWindow({
			url: '../password/resetPassword.html',
			id: "../ password/resetPassword",
			styles: {
				top: 0, //新页面顶部位置
				bottom: 0, //新页面底部位置
			},
			extras: {
				title: '重置密码' //自定义扩展参数 
			},
		})
	}

	// 检查更新
	this.checkNew = function() {
		var appVersion = "2.0.0";
		mui.ajax(url + '/system/clientVersion', {
			data: {
				appVersion: appVersion
			},
			type: 'get',
			dataType: "jsonp",
			// jsonp: "jsoncallback",
			timeout: 10000,
			success: function(res) {
				var data = JSON.parse(res).data.response;
				if (appVersion < data.mustVersion) {
					console.log(JSON.stringify(data));
					modelWrap.style.display = "flex";
					modelWrap.style.visibility = "visible";
					modelTitle.style.display = "none";
					modelTitle.style.visibility = "visible";
					// modelTitle.innerHTML="<div class='font-size18 line-height2 aLine half' style=''>"+"SVGFEColorMatrixElement"+"</div>"+"<div class='font-size14 line-height1-5 aLine half'>"+"WebGLTransformFeedback"+"</div>";
					modelCenter.innerHTML = "<p>" + data.updateDes + "</p><a href='" + data.downloadUrl + "' dowload>点击体验最新版</a>";
				} else {
					mui.toast("当前版本已是最新版")
				}
			},
			error: function() {}
		})
	}

	// 登出
	this.logout = function() {
		mui.confirm("确认退出登录？", "", function(e) {
			if (e.index == 1) {
				mui.ajax(window.localStorage.getItem('logout'), {
					data: {
						sessionKey: localStorage.getItem("sessionKey")
					},
					success: function(res) {
						if (res.code == 200) {
							mui.toast("已成功退出")
							window.localStorage.setItem('sessionKey', "");
							window.localStorage.setItem('password', "");
							window.localStorage.setItem('userName', "");
							window.localStorage.setItem('level', "");
							var main = plus.webview.getWebviewById(window.localStorage.getItem('index.html'));
							mui.fire(main, 'changeCity', {
							})
							  mui.back()
						}
					}
				})
			} else {

			}
		})
	};

	// 获取登录验证码
	this.getLoginPasswordVerificationCode = function() {
		if (telValue.value.length != 11 || !reg.test(telValue.value)) {
			mui.toast("请输入正确的手机格式")
			return
		}
		// 判断是否需要验证码
		mui.ajax(localStorage.getItem("login") + '/isVerifyCode', {
			data: {
				formatType:"json"
			},
			type: 'get',
			dataType: "jsonp",
			jsonp: "jsoncallback",
			timeout: 10000,
			header:{
				"Content-Type":"x-www-form-urlencoded",
			},
			success: function(res) {
				console.log(res);
				var data = JSON.parse(res).data.response;
				if (data.isVerifyCode == true) {
					var regisTertoken = data.token; // 判断是否需要验证码
					window.regisTertoken = data.token;
					var xhr = new XMLHttpRequest();
					xhr.open('GET', localStorage.getItem("login") + '/verifyCode?token=' + regisTertoken + "&formatType=img", true);
					xhr.responseType = "blob";
					xhr.onload = function() {
						if (this.status == 200) {
							var blob = this.response;
							var img = document.createElement("img");
							img.onload = function(e) {
								window.URL.revokeObjectURL(img.src);
							};
							img.src = window.URL.createObjectURL(blob);
							// 样式
							modelWrap.style.display = "flex";
							modelWrap.style.visibility = "visible";
							img.className = 'margin-25-auto';
							img.setAttribute("class", "margin-25-auto");
							modelCenter.innerHTML = "";
							modelCenter.className = "model-center mui-text-center";
							modelCenter.setAttribute("class", "model-center mui-text-center");
							modelCenter.innerHTML +=
								"<div class='font-size18 color-0D6FC6 mui-text-center' style='padding-top:18px;' id='p'><span style='display:inline-block;'><span>请输入图片验证码</span><img class='width16' style='height:16px;margin-left:10px;margin-top:2px;display:inline-block;float:right;' src='../../img/VCode.png'/></span></div>";
							modelCenter.appendChild(img);
							modelCenter.innerHTML +=
								"<div id='' class='color-404040 relative CodeValueWrap margin0 padding0 height33 margin-0-auto' style='margin-bottom:18px;'><span id='CodeValue' class='CodeValue'></span><input type='number' class='inputCode' id='CodeInput' maxlength='4' autofocus><div><div class='hr'></div><div class='hr'></div><div class='hr'></div><div class='hr'></div></div></div>";

							var inp = document.getElementById('CodeInput');
							var text = document.getElementById('CodeValue');
							document.getElementById("p").onclick = function() {
								_this.getLoginPasswordVerificationCode();
							}
							// 输入图片验证码
							inp.oninput = function() {
								text.style.background = '#fff';
								inp.style.color = '#fff';
								text.innerHTML = inp.value;
								if (inp.value.length == 4) {
									// 注册发送验证码
									mui.ajax(localStorage.getItem("login") + '/sendPwdCode', {
										data: {
											mobile: telValue.value,
											token: regisTertoken,
											verifyCode: inp.value,
										},
										type: 'get',
										dataType: "jsonp",
										// jsonp: "jsoncallback",
										timeout: 10000,
										success: function(res) {
											var rescode = JSON.parse(res).code;
											var message = JSON.parse(res).message;
											if (rescode != 200) {
												mui.toast(message);
												modelWrap.style.display = "none";
												modelWrap.style.visibility = "hidden";
											} else {
												mui.toast("验证码正在发送中，请稍等");
												modelWrap.style.display = "none";
												modelWrap.style.visibility = "hidden";
											}
										}
									})
								}
							}
						} else {
							console.log(this);
						}
					}
					xhr.send();
				}
			},
			error(err) {
				console.log(err);
			}
		})
	}
	// 跳转新密码页
	this.VerificationCode = function() {
		if (telValue.value.length != 11 || !reg.test(telValue.value)) {
			mui.toast("请输入正确的手机格式")
			return
		}
		if (VerificationCode.value.length != 6) {
			mui.toast("请输入6位的验证码")
			return
		}
		mui.ajax(localStorage.getItem("login") + "/checkPwdCode", {
			data: {
				mobile: telValue.value,
				mobileCode: VerificationCode.value,
				type: "2",
			},
			timeout: 10000,
			success: function(res) {
				console.log(JSON.stringify(res));
				if (res.code == 200) {
					mui.openWindow({
						url: 'nextResetPassword.html',
						id: "nextResetPassword",
						styles: {
							top: 0, //新页面顶部位置
							bottom: 0, //新页面底部位置
						},
						extras: {
							tel: telValue.value,
							// code: VerificationCode.value,
						},
					})

				} else {
					mui.toast(res.message);
				}
			},
		})
	}
	
	// 密码长度
	this.PasswordLength = function() {
		if (loginPassword && loginPassword.value.length > 16) {
			mui.toast("密码长度应小于16位");
			loginPassword.value = loginPassword.value.slice(0, 16);
		}
		if (registerPassword && registerPassword.value.length > 16) {
			mui.toast("密码长度应小于16位");
			registerPassword.value = registerPassword.value.slice(0, 16);
		}
		if (newCode && newCode.value.length > 16) {
			mui.toast("密码长度应小于16位");
			newCode.value = newCode.value.slice(0, 16);
		}
		if (confirmCode && confirmCode.value.length > 16) {
			mui.toast("密码长度应小于16位");
			confirmCode.value = confirmCode.value.slice(0, 16);
		}
	}
	// 关闭弹窗
	this.closemodle = function() {
		modelWrap.style.display = "none";
		modelWrap.style.visibility = "hidden";
	}
}

var personalCenter = new PersonalCenter();
