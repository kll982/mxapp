function linkage(){
			// console.log(parId)	
			// console.log(nameId)
			if (parId == 1) {
				var cityData2 = [{
					value: levelindex,
					text: namevalue,
					children: [{
						value: levelindex,
						text: '全部',
					}]
				}]
				mui.ajax({
					type: 'get',
					url: url + '/msaInfo/getChildByParId',
					data: {
						id: levelindex
					},
					dataType: "jsonp",
					jsonp: "jsoncallback",
					timeout: 5000,
					success: function(data) {
						var res = JSON.parse(data)
						var string = ''
						if (res.code == 200) {
							var childDepts = res.data.response.childDepts
							for (var index = 0; index < childDepts.length; index++) {
								var item = {
									value: childDepts[index].id,
									text: childDepts[index].shortName
								}
                              cityData2[0].children.push(item)
							}
							var cityPicker = new mui.PopPicker({
								layer: 2
							});
							cityPicker.setData(cityData2);
							// console.log(JSON.stringify(cityData2))
							cityPicker.show(function(items) {
								var twocity = items[0].text,
								    twovalue = items[0].value;
									threecity = items[1].text,
									threevalue = items[1].value;
									if(twovalue == threevalue){
										level = twovalue
										$('#city').text(twocity)
									}else {
										level = threevalue 
										$('#city').text(threecity)
									}
// else if(twovalue=='全部'){
// 										level = twovalue
// 									}else{
// 										level = threevalue
// 									}
									firstDom(0)
							})
						}
					},
					error: function(err) {
						console.log(err)
					}
				})


			} else if (parId == 0) {
				var cityPicker3 = new mui.PopPicker({
					layer: 3
				});
				cityPicker3.setData(cityData3);
				cityPicker3.show(function(items) {
					var twocity = items[1].text,
						twovalue = items[1].value;
					    threecity = items[2].text,
						threevalue = items[2].value,
						onetext = items[0].text;
					if (twovalue == threevalue) {
						level = twovalue
					} else {
						level = threevalue
					}
					if (threecity == '全部') {
						var valuetext = twocity 
						$('#city').text(valuetext)
					} else {
						var valuetext = threecity 
						$('#city').text(valuetext)
					}
					if(twocity == '全部'){
						level = 0;
						var valuetext = '江苏' 
						$('#city').text(valuetext)
					}
					firstDom(0)

				});
			}else if(parId == 2){
// 				console.log('99999')
// 				var main = plus.webview.getWebviewById("html/browse/browse.html");
// 				mui.fire(main, 'changetextthree', {
// 					// valuetext: valuetext
// 				})
			}
			// 			mui.ajax({
			// 				type: 'get',
			// 				url: url + '/msaInfo/getChildByParId ',
			// 				data:{
			// 					id:1
			// 				},
			// 				dataType: "jsonp",
			// 				jsonp: "jsoncallback",
			// 				timeout: 5000,
			// 				success: function(data) {
			// 					var res = JSON.parse(data)
			// 					var string = ''
			// 				   console.log(res)
			// 				},
			// 				error: function(err) {
			// 					console.log(err)
			// 				}
			// 			})
}