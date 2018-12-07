

window.login = localStorage.getItem("login");
window.url = localStorage.getItem("url");
// 模态窗
var modelWrap = document.getElementById("model-wrap"),
	modelTitle = document.getElementById("model-title"),
	modelCenter = document.getElementById("model-center"),
	modelClose = document.getElementById("model-close"),
	// 手机号 密码
	telValue = document.getElementById("tel"),
	loginPassword = document.getElementById("loginPassword"),
	registerPassword = document.getElementById("registerPassword"),
	newCode = document.getElementById("newPassword"),
	confirmCode = document.getElementById("confirmCode"),
	// 注册 下一步
	nextRegister = document.getElementById("nextRegister"),
	// 验证码
	VerificationCode = document.getElementById("VerificationCode"),
	// 手机号判断
	reg = /^1[3-9][0-9]{9}/;

function Login() {
	var _this = this;

	// 首页 跳转 登录
	this.GoTOLogin = function() {


		mui.openWindow({
			url: './html/login/login.html',
			id: "login",
			styles: {
				top: 0, //新页面顶部位置
				bottom: 0, //新页面底部位置
			},

		})
	}
	// 跳转 注册
	this.register = function() {
		mui.openWindow({
			url: '../register/register.html',
			id: "../register/register.html",
			styles: {
				top: 0, //新页面顶部位置
				bottom: 0, //新页面底部位置
			},

		})
	}
	// 跳转 注册 下一步
	this.nextRegister = function() {
		if (telValue.value.length != 11 || !reg.test(telValue.value)) {
			mui.toast("请输入正确的手机格式")
			return
		}
		if (VerificationCode.value.length != 6) {
			mui.toast("请输入6位的验证码")
			return
		}
		console.log(telValue.value);
		console.log(VerificationCode.value);

		mui.ajax(localStorage.getItem("login") + "/checkPwdCode", {
			data: {
				mobile: telValue.value,
				mobileCode: VerificationCode.value,
				type:"1",
			},
			timeout: 10000,
			success: function(res) {
				console.log(JSON.stringify(res));
				if(res.code == 200){
					mui.openWindow({
						url: 'nextRegister.html',
						id: "nextRegister",
						styles: {
							top: 0, //新页面顶部位置
							bottom: 0, //新页面底部位置
						},
						extras: {
							tel: telValue.value,
							// code: VerificationCode.value,
						},
					})
					
				}else{
					mui.toast(res.message);
				}
			},
		})
	}
	// 	// 跳转 个人中心
	// 	this.GoTOPersonal = function() {
	// 		mui.openWindow({
	// 			url: '../personalCenter/personalCenter.html',
	// 			id: "personalCenter",
	// 			styles: {
	// 				top: 0, //新页面顶部位置
	// 				bottom: 0, //新页面底部位置
	// 			},
	// 		})
	// 	}

	// 获取注册验证码
	this.getRegisterPasswordVerificationCode = function() {
		// var reg = /^1[3-9][0-9]{9}/;
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
			// jsonp: "jsoncallback",
			timeout: 10000,
			header:{
				"Content-Type":"x-www-form-urlencoded",
			},
			success: function(res) {
				var data = JSON.parse(res).data.response;
				if (data.isVerifyCode == true) {
					var regisTertoken = data.token; // 判断是否需要验证码
					window.regisTertoken = data.token;
					console.log(regisTertoken)
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
								_this.getRegisterPasswordVerificationCode();
							}
							// 输入图片验证码
							inp.oninput = function() {
								text.style.background = '#fff';
								inp.style.color = '#fff';
								text.innerHTML = inp.value;
								if (inp.value.length == 4) {
									// 注册发送验证码
									mui.ajax(localStorage.getItem("login") + '/sendVerifyCode', {
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
											console.log(res);
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
						}
					}
					xhr.send();
				}
				// console.log(res.data.response.isVerifyCode)
			},
			error: function() {}

		})
	}
	// 跳转 修改密码
	this.resetPassword = function() {
		mui.openWindow({
			url: '../password/resetPassword.html',
			id: "resetPassword",
			styles: {
				top: 0, //新页面顶部位置
				bottom: 0, //新页面底部位置
			},
			extras: {
				title: '重置密码' //自定义扩展参数 
			},
		})
	}

	// 关闭弹窗
	this.closemodle = function() {
		modelWrap.style.display = "none";
		modelWrap.style.visibility = "hidden";
	}
	// 登录
	this.loginWith = function() {
		if (telValue.value.length != 11 || !reg.test(telValue.value)) {
			mui.toast("请输入正确的手机格式")
			return
		}
		if (loginPassword && loginPassword.value.length < 8) {
			mui.toast("密码长度应大于8位");
			return;
		}
		mui.ajax(localStorage.getItem("login") + "/login", {
			data: {
				mobile: telValue.value,
				password: loginPassword.value,
			},
			type: 'get',
			dataType: "jsonp",
			success: function(res) {
				console.log(res);
				if (res.code == 500) {
					mui.toast(res.message);
				} else if (res.code == 200) {
					if (res.data.response == false) {
						mui.toast("该账户不存在");
					} else {
						mui.toast("登录成功");
						localStorage.setItem("userName", res.data.response.user.usrMobile);
						localStorage.setItem("sessionKey", res.data.response.sessionKey);
					
						mui.openWindow({
							url: '../../index.html',
							id: window.localStorage.getItem('index.html'),
							styles: {
								top: 0, //新页面顶部位置
								bottom: 0, //新页面底部位置
							},
							extras: {
								title: '重置密码' //自定义扩展参数 
							},
						})
					}
				}
			}
		})
	}
}

var login = new Login();
