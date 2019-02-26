            //接收打印结果
			function getPrintResult(result) {
				window.clearTimeout(t1);
				//result:0:成功  1:缺纸 2:打印头过热 
				if (result == 0) {
					$('#tiShiText').css('display','none')
					succse()
				} else if (result == 2) {
					$('#buttodiv').find('img').attr('src', '../../img/zujiande155.png')
					$('#Release').html('打印机请无纸<br>请装纸')
					$('#buttonITemFitr').text('')
					$('#tiShiText').css('display','none')
					$('#footItem').css({
						'display': 'block'
					})
				} else {
					$('#tiShiText').css('display','none')
					succse()
					// 					$('#buttodiv').find('img').attr('src', '../../img/zujiande155.png')
					// 					$('#Release').html('打印头过热 ')
					// 					$('#buttonITemFitr').text('')
					// 					$('#footItem').css({
					// 						'display': 'block'
					// 					})
				}
			}
			//同步调用原生方法扫描打印机              
			function scanPrinter(){
				//调用customPlugin插件的testFunctionSync方法，传递了两个参数，分别是James和Tracy
				var result = plus.bridge.execSync("customPlugin", "scanPrinter", []);
				$('#buttodiv').find('img').attr('src', '../../img/zujian154.png')
				$('#Release').text('正在搜索设备')
				$('#buttonITemFitr').text('')
				$('#footItem').css('display', 'none')
				$('#tiShiText').css('display','none')
			}
			//接收蓝牙设备
			function acceptPrint(name, macaddr){
				var rejectItem = {
					name: name,
					macaddr: macaddr
				}
				acceptPrintArray.push(rejectItem)
			}
			//本次扫描打印机结束事件
			function scanPrinterEnd(result){	
				var string = '';
				for (var index = 0; index < acceptPrintArray.length; index++) {
					var valueItemger='';
					if(acceptPrintArray[index].name.length > 6){
						valueItemger = acceptPrintArray[index].name.substring(0,6)+'...'
					}else{
						valueItemger = acceptPrintArray[index].name
					}
					string += '<li class="mui-table-view-cell" onClick="addPrinter(' + index +
						')"><a class="mui-navigate-right"><img src="../../img/lantinsdgsagd161.png">'+ valueItemger + '  '  + acceptPrintArray[index].macaddr +
						'</a> </li>'
				}
				$('#buttodiv').html('<ul class="mui-table-view">' + string + '</ul>')
			}
			//异步调用原生方法
			function nativeAsync() {
				var bridge = plus.bridge;
				var success = function(msg) {
					// alert("onSuccess,msg = " + msg);
				};
				var failed = function(msg) {
					// alert("onFailed,msg = " + msg);
				}
				//获取回调的id
				var callbackId = bridge.callbackId(success, failed);
				//注意，这里要跟原生开发的人定好回调id在参数列表中的索引位置
				plus.bridge.exec("customPlugin", "testFunctionAsync", [callbackId, "secondParam"]);
			}
			
			function succse(){
				$('#buttodiv').find('img').attr('src', '../../img/lujing33.png')
				$('#Release').text('打印完成')
				$('#buttonITemFitr').html(
					'<button type="button"  id="bnITem" class="buttonITemcalss"  onclick="print()">继续打印</button><button type="button" onClick="bnITem()"  class="buttonITemcalssItem" >返回</button>'
				)
			}
			// 未检测到打印机
			function scanPrinterItem() {
				$('#buttodiv').find('img').attr('src', '../../img/zujiande155.png')
				$('#Release').html('未检测到打印机<br>请连接打印机')
				$('#buttonITemFitr').html(
					'<button type="button" id="bnITemlijie" onClick="scanPrinter()" class="buttonITemcalss" >搜索设备</button>')
			}

