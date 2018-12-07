function echart(){
	document.getElementById("charts").style.width = document.body.clientWidth + "px";
			document.getElementById("charts").style.height = document.body.clientWidth * 2 / 3 + "px";


			mui.ajax(localStorage.getItem("url") + "/checklist/indexChart", {
				success: function(res) {
      console.log(JSON.stringify(res))
					var ringData = [];
					if (res.code == 200) {
						var data = res.data.response;
						ringData = [{
								name: "解决 " + data.solvedCount,
								value: data.solvedCount
							},
							{
								name: "未解决 " + data.unSolvedCount,
								value: data.unSolvedCount
							}
						];
						var ring = echarts.init(document.getElementById("charts"), 'westeros'),
							ringOption = {
								color: ['#2079DE', '#E8C25B'],
								graphic: {
									elements: [{
										type: 'text',
										top: "38%",
										left: "center",
										zlevel: 0,
										style: {
											text: data.count,
											fontSize: 30,
											fill: "#E8C25B",
											fontWeight: 'bold',
											fontFamily:"黑体",
										}
									}, {
										type: 'text',
										top: "55%",
										left: "center",
										zlevel: 0,
										style: {
											text: "隐患总数",
											fontSize: 18,
										}
									}, ]
								},
								series: [{
									name: '访问来源',
									type: 'pie',
									hoverOffset: 5,
									radius: ['55%', '68%'],
									center: ['50%', '50%'],
									label: {
										normal: {
											show: true,
										},
									},
									labelLine: {
										normal: {
											show: true,
											textStyle: {
												fontSize: '18',
											}
										},
										emphasis: {
											show: true,
											textStyle: {
												fontSize: '30',
												fontWeight: 'bold'
											}
										}
									},
									data: ringData
								}],
	
							};
						ring.setOption(ringOption);
						var level =window.localStorage.getItem("level");
						// 省
						if (level == 1) {
							if (data.allAverage == null || data.allAverage == 0) {
								document.getElementsByClassName("chartsText")[0].innerHTML =
									"<div class='color-1E78DE font-size18'>——</div><p class='font-size14'> 全省隐患平均值</p>"
							} else if (data.allAverage < 0) {
								document.getElementsByClassName("chartsText")[0].innerHTML =
									"<div class='color-1E78DE font-size18'><span class='font-size18'>" +
									Math.abs(Number(data.allAverage)) +
									"</span></div><p class='font-size14'> 全省隐患平均值</p>"
	
							} else if (data.allAverage > 0) {
								document.getElementsByClassName("chartsText")[0].innerHTML =
									"<div class='color-1E78DE font-size18'><span class='font-size18'>" +
									Number(data.allAverage) +
									"</span></div><p class='font-size14'> 全省隐患平均值</p>"
							}
	
							if (data.troubleSpecific == null || data.troubleSpecific == 0) {
								document.getElementsByClassName("chartsText")[1].innerHTML =
									"<div class='color-D9AF3D font-size18'><i class='iconfont color-D9AF3D font-size18'>——</i> </div><p class='font-size14'>较上月隐患数量</p>"
							} else if (data.troubleSpecific < 0) {
								document.getElementsByClassName("chartsText")[1].innerHTML =
									"<div class='color-D9AF3D font-size18'><i class='iconfont icon-tubiaoxiajiangqushi color-D9AF3D font-size18'></i> <span class='font-size18'>" +
									Math.abs(Number(data.troubleSpecific)) +
									"% </span></div><p class='font-size14'>较上月隐患数量</p>"
							} else if (data.troubleSpecific > 0) {
								document.getElementsByClassName("chartsText")[1].innerHTML =
									"<div class='color-D9AF3D font-size18'><i class='iconfont icon-tubiaoshangshengqushi color-D9AF3D font-size18'></i> <span class='font-size18'>" +
									Number(data.troubleSpecific) +
									"% </span></div><p class='font-size14'>较上月隐患数量</p>"
							} else {
								document.getElementsByClassName("chartsText")[1].innerHTML =
									"<div class='color-D9AF3D line-height2 padding10-0'><span>" + data.troubleSpecific + "</span>"
							}
							
						} 
						// 市
						else if (level == 2) {
							if (data.average == null || data.average == 0) {
								document.getElementsByClassName("chartsText")[0].innerHTML =
									"<div class='color-1E78DE font-size18'><i class='iconfont color-1E78DE font-size18'>——</i> </div><p>较全部地区平均值</p>"
							} else if (data.average < 0) {
								document.getElementsByClassName("chartsText")[0].innerHTML =
									"<div class='color-1E78DE font-size18'><i class='iconfont icon-tubiaoxiajiangqushi color-1E78DE font-size18'></i> <span class='font-size18'>" + Math.abs(
										Number(data.average)) +
									"% </span></div><p>较全部地区平均值</p>"
	
							} else if (data.average > 0) {
								document.getElementsByClassName("chartsText")[0].innerHTML =
									"<div class='color-1E78DE font-size18'><i class='iconfont icon-tubiaoshangshengqushi color-1E78DE font-size18'></i> <span class='font-size18'>" + Number(
										data.average) +
									"% </span></div><p>较全部地区平均值</p>"
							}
	
							if (data.troubleSpecific == null || data.troubleSpecific == 0) {
								document.getElementsByClassName("chartsText")[1].innerHTML =
									"<div class='color-D9AF3D font-size18'><i class='iconfont color-D9AF3D font-size18'>——</i> </div><p>较上月隐患数量</p>"
							} else if (data.troubleSpecific < 0) {
								document.getElementsByClassName("chartsText")[1].innerHTML =
									"<div class='color-D9AF3D font-size18'><i class='iconfont icon-tubiaoxiajiangqushi color-D9AF3D font-size18'></i> <span class='font-size18'>" + Math.abs(
										Number(data.troubleSpecific)) +
									"% </span></div><p>较上月隐患数量</p>"
							} else if (data.troubleSpecific > 0) {
								document.getElementsByClassName("chartsText")[1].innerHTML =
									"<div class='color-D9AF3D font-size18'><i class='iconfont icon-tubiaoshangshengqushi color-D9AF3D font-size18'></i> <span class='font-size18'>" + Number(
										data.troubleSpecific) +
									"% </span></div><p>较上月隐患总数</p>"
							} else {
								document.getElementsByClassName("chartsText")[1].innerHTML =
									"<div class='color-D9AF3D line-height2 padding10-0'><span>" + data.troubleSpecific + "</span>"
							}
						} 
						// 县
						else if (level == 3) {
							document.getElementsByClassName("chartsText")[0].innerHTML = "";
							document.getElementsByClassName("chartsText")[1].innerHTML = "";
						}
					}
	
				}
			})
}