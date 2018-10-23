$(function(){
	/*var chart = Highcharts.chart('picture', {credits: {enabled: false}});   //获取图表对象
    chart.showLoading();
    chart.hideLoading();*/
	var data = RF_SP2State.mock.RF_SP2[0];
  	//默认加载第一个曲线
	var x=[];
    var y=[];
    var CVZ= [];
    var CVX=[];
    var CVY=[];
  	if(data.curveinfos.length >= 1){
  		/*dimension == 0*/
  		SmithCurve(data);
	}else{
  		RF_SP2SwalMixin({
  			title: '信息',
  			text: "此晶圆无曲线数据！",
  			type: 'info',
  			showConfirmButton: false,
  			showCancelButton: false,
  			timer: 2000
  		}).then(function(result){
			if(result.dismiss == "timer"){
				
			}
		});
  	}

		function SmithCurve(data){
	  		// 默认加载史密斯信息
	  		var Smith_Paramter = RF_SP2State.waferSelected[0];
			$(".Smith_Paramter").text(Smith_Paramter);
	  		
	  		var dom1 = document.getElementById("picture1top");
	  		var dom2 = document.getElementById("picture4top");
	  		var msgdom1  = document.getElementById("picture1bottom");
	  		var msgdom2  = document.getElementById("picture4bottom");
			var title = [''];
			var legendName1 = ['S11'];
			var legendName2 = ['S22'];
			var data1 = [data.curveinfos[2].smithAndCurve.S11];
			var data2 = [data.curveinfos[2].smithAndCurve.S22];
			var smith1 = smithChart(dom1,title,legendName1, data1,'S11',msgdom1);
			var smith2 = smithChart(dom2,title,legendName2, data2,'S22',msgdom2);

			var DbCurveDom1 = "picture2top";
			var DbCurveDom2 = "picture3top";
			var DbCurveData1 = data.curveinfos[2].smithAndCurve.S12;
			var DbCurveData2 = data.curveinfos[2].smithAndCurve.S21;
			//曲线
			drawDbCurve(DbCurveDom1,DbCurveData1,$("#picture2bottom"));
			drawDbCurve(DbCurveDom2,DbCurveData2,$("#picture3bottom"));
			//默认加载曲线信息
			$("#picture2bottom .Smith_Msg2").text(parseFloat(DbCurveData1[0][1])+" dB,"+(DbCurveData1[0][0]/1000000000).toFixed(2)+"GHz");
			$("#picture3bottom .Smith_Msg2").text(parseFloat(DbCurveData2[0][1])+" dB,"+(DbCurveData2[0][0]/1000000000).toFixed(2)+"GHz");	
			
			window.onresize = function () {
				smith1.onresize();
				smith2.onresize();
			};
		}


		function drawDbCurve(dom,data,msgDom){
			var xData = [];var yData = [];
			for(var i = 0 ; i < data.length ;i++){
				xData.push((data[i][0] / 1000000000).toFixed(2));
				yData.push(parseFloat(data[i][1]));
			}	
			var chart = Highcharts.chart(dom, {
				chart: {
					type: 'line'
				},
				title: {
					text: null
				},
		        lang: {
		            loading: 'Loading...' ,//设置载入动画的提示内容，默认为'Loading...'，若不想要文字提示，则直接赋值空字符串即可 
		        },
		        legend: {
					enabled: false
				},
			    xAxis: {
					title: {
						text: "GHz",
					}, 
					categories : xData,
					gridLineColor: '#197F07',
		            gridLineWidth: 1
				}, 
				yAxis: {
					title: {
						text: "dB",
					},
				    gridLineColor: '#197F07',
				    gridLineWidth: 1,
				  /*  labels: {
				      step: 0.01
			    	}  */
				},
				series:  [{
					data: yData
				}],
				credits: {
					enabled: false
				},
				plotOptions: {
					series: {
						point: {
							events: {
								mouseOver: function (pa) {
									/*console.log(this);
									console.log(pa);*/
									var x = xData[this.x] ;
									var y = this.y ;
									var str = y+" dB,"+x+" GHz" ;
									msgDom.find(".Smith_Msg2").text(str);
								}
							}
						},
					}
				},
			});
		}



			// 阻止浏览器默认右键点击事件
			$(document).on("contextmenu", "#picture_box2, #picture_box3, div.swal2-container", function(e){
				// e.preventDefault();
			    return false;
			});
			$("#picture_box2,#picture_box3").mousedown(function(e) {
				if (3 == e.which) {
					// e.preventDefault();
					$(this).data("iflag", RF_SP2State.contextObj.flagArr[Number($(this).data("iflag") == "initial")]);

					RF_SP2State.contextObj.classify = $(this).data("iclassify");
					RF_SP2State.contextObj.flag = $(this).data("iflag");
					var iThat = $(this);
					RF_SP2SwalMixin({
					  title: '确定切换数据格式吗？',
					  text: "切换数据格式，绘制在图表上！",
					  type: 'question',
					  showCancelButton: true,
					  confirmButtonText: '确定，切换！',
					  cancelButtonText: '不，取消！',
					  reverseButtons: false
					}).then(function(result) {
					  if (result.value) {
					  	// {value: true}
					  	iThat.children(".picturetop").empty();
		  				//曲线
		  				var originData = RF_SP2State.mock.RF_SP2_MagnitudeDB[0];
		  				if(RF_SP2State.contextObj.flag == "initial"){
		  					originData = RF_SP2State.mock.RF_SP2[0].curveinfos[2].smithAndCurve;
		  				}
		  				drawDbCurve(iThat.children(".picturetop").attr("id"), originData[RF_SP2State.contextObj.classify], iThat.children(".picturebottom"));
					    RF_SP2SwalMixin({
					    	title: '切换成功！',
					    	text: "新数据已被绘制到图表",
					    	type: 'success',
					    	showConfirmButton: false,
					    	timer: 1000,
					    });
					  } else if (
					    // Read more about handling dismissals
					    // {dismiss: "overlay"}
					    result.dismiss === swal.DismissReason.cancel
					  ) {
					    RF_SP2SwalMixin({
					    	title: '取消了！',
					    	text: "不作处理",
					    	type: 'error',
					    	showConfirmButton: false,
					    	timer: 1000,
					    });
					  }
					});		
		        }
			});
			

				
				

			//得到点击的坐标
			function getEventPosition(ev) {
			    var x, y;
			    if (ev.layerX || ev.layerX == 0) {
			        x = ev.layerX;
			        y = ev.layerY;
			    } else if (ev.offsetX || ev.offsetX == 0) { 
			        x = ev.offsetX;
			        y = ev.offsetY;
			    }
			    return {x: x, y: y};
			}
});

/*绘制曲线图*/
function renderSpline(option){
	var chart = Highcharts.chart(option.container, {
		chart: {
			type: 'spline',
			zoomType: 'x',
			resetZoomButton: {
				position: {
					align: 'left', // by default
					// verticalAlign: 'top', // by default
					x: 90,
					y: 10
				},
				relativeTo: 'chart'
			}
		},
		title: {
			text: option.title
		},
        lang: {
            loading: 'Loading...' ,//设置载入动画的提示内容，默认为'Loading...'，若不想要文字提示，则直接赋值空字符串即可 
        },
        legend: {
			enabled: true
		},
	    xAxis: {
			title: {
				text: "Mhz",
			}, 
			categories : option.data.xData[0],
			gridLineColor: '#197F07',
			// 网格线线条宽度，当设置为 0 时则不显示网格线
            gridLineWidth: 0,
            crosshair: {
            	dashStyle: "LongDashDotDot",
            	width: 2,
            	color: "#bbbbbb"
            }
		}, 
		yAxis: {
			title: {
				text: "dB",
			},
		    gridLineColor: '#eee',
		    gridLineWidth: 1,
		  	crosshair: {
		  		dashStyle: "LongDashDotDot",
		  		width: 2,
		  		color: "#bbbbbb"
		  	}
		},
		series:  [{
			name: option.name[0],
			data: option.data.yData[0]
		},{
			name: option.name[1],
			data: option.data.yData[1]
		}],
		credits: {
			enabled: false
		},
		tooltip: {
			formatter: function (e) {
                return '<b>'+this.series.name+'</b><br>'+this.x+' Mhz, '+this.y+' dB';
            }
			/*headerFormat: '<b>{series.name}</b><br>',
			pointFormat: option.data.xData[0][point.index]+' MHz, {point.y} db'*/
		},
		plotOptions: {
			series: {
				allowPointSelect: false,
				/*dataLabels: {
					enabled: true,
					format: '{y} mm'
				},*/
				marker: {
					enabled: true,
					/*fillColor: "#00aeef",*/
					radius: 1,
					symbol: "diamond",
					states: {
						hover: {
							fillColor: 'white',
	                        lineColor: 'black',
	                        lineWidth: 3
						},
						select: {
							fillColor: 'white',
	                        lineColor: 'red',
	                        lineWidth: 3,
	                        radius: 4
						}
					}
				},
				cursor: "pointer",
				point: {
					events: {
						mouseOver: function (ev) {
							/*console.log(chart.getSelectedPoints());*/
							var ii = this.colorIndex;
							if(ii == 0){
								$(".g_bodyin_bodyin_bottom_rsubin_foot>.container-fluid>.row").eq(0).children().text(this.series.name+" "+this.category+"Mhz, "+this.y+"dB");
								$(".g_bodyin_bodyin_bottom_rsubin_foot>.container-fluid>.row").eq(1).children().text(option.name[1]+" "+this.category+"Mhz, "+option.data.yData[1][this.x]+"dB");
							}else{
								$(".g_bodyin_bodyin_bottom_rsubin_foot>.container-fluid>.row").eq(1).children().text(this.series.name+" "+this.category+"Mhz, "+this.y+"dB");
								$(".g_bodyin_bodyin_bottom_rsubin_foot>.container-fluid>.row").eq(0).children().text(option.name[0]+" "+this.category+"Mhz, "+option.data.yData[0][this.x]+"dB");
							}
							/*chart.series[ii].data[1].select(true, true);*/
						},
						click: function(ev){
							var serise1 = 0;
							var name = this.series.name;
							var x = this.category;
							var y = this.y;
							if(this.selected){
								this.select(false,true);
								/*_.isEqual*/
								_.pull(RF_SP2State.stateObj.splineSelectedArr, _.find(RF_SP2State.stateObj.splineSelectedArr, function(o) { 
										var flag = false;
										if(o.name == name && o.x == x && o.y == y) flag = true;
										return flag;
									 }));
								$(".buildMarker_body>.container-fluid tbody>tr[data-iflag='"+(name+x)+"']").remove();
							}else{
								_.forEach(RF_SP2State.stateObj.splineSelectedArr, function(o){
									 if(o.name == name){
									 	serise1++;
									 }
								});
								if(serise1 > 1){
									RF_SP2SwalMixin({
										title: "Marker打点提示",
										text: "目前功能一条曲线最多打2个点",
										type: "error",
										timer: 2500
									});
									return false;
								}
								this.select(true,true);
								var markerName = "Marker"+(RF_SP2State.stateObj.splineSelectedArr.length + 1);
								RF_SP2State.stateObj.splineSelectedArr.push({
									name: name,
									x: x,
									y: y,
									markerName: markerName,
									key: RF_SP2State.stateObj.comfirm_key
								});
								$(".buildMarker_body>.container-fluid tbody").append('<tr data-iflag="'+(name+x)+'"><td contenteditable="true" title="点击修改">'+markerName+'</td><td>'+x+'</td><td>'+y+'</td><td>'+RF_SP2State.stateObj.comfirm_key+'</td></tr>');
							}
						}
					}
				},
			}
		},
	});
	option.callback && option.callback(chart);
}