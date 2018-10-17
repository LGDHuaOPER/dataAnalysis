function HashTable() 
{ 
	var size = 0; 
	var entry = new Object(); 
	this.add = function (key , value){ 
		if(!this.containsKey(key)) 
		{ 
			size ++ ; 
		} 
	entry[key] = value; 
	} 
	this.getValue = function (key){ 
		return this.containsKey(key) ? entry[key] : null; 
	} 
	this.remove = function ( key ){ 
		if( this.containsKey(key) && ( delete entry[key] ) ) 
		{ 
		size --; 
		} 
	} 
	this.containsKey = function ( key ){ 
		return (key in entry); 
	} 
	this.containsValue = function ( value ){ 
		for(var prop in entry) 
		{ 
			if(entry[prop] == value) 
			{ 
				return true; 
			} 
		} 
		return false; 
	} 
	this.getValues = function (){ 
		var values = new Array(); 
		for(var prop in entry) 
		{ 
			values.push(entry[prop]); 
		} 
		return values; 
	} 
	this.getKeys = function (){ 
		var keys = new Array(); 
		for(var prop in entry) 
		{ 
			keys.push(prop); 
		} 
		return keys; 
	} 
	this.getSize = function (){ 
		return size; 
	} 
	this.clear = function (){ 
		size = 0; 
		entry = new Object(); 
	} 
} 

var storage = window.localStorage; 
$(function(){
	var exe = storage.getItem("exe");
	//console.log(exe == null)
	if(exe != null){
		$("#address").hide();
		$(".createReg").val("修改注册表");
		$(".createReg").attr("flag","edit")
		$(".starting").val("启动"+exe);
	}
	else{
		$("#address").show();
		$(".createReg").val("注册表下载");
		$(".starting").val("启动程序");
	}
	
	var resizeflag = false;//判断当前行为是否为resize  是的话不加载曲线
	
	//定义坐标与die信息的哈希表
    var coordsArray1= new HashTable();
	var filterArr=[] ; //全局变量 存储过滤后的坐标

	
	//获取页面数据
	var WaferSerialID =storage.seeWaferID ;
	var WaferID = storage.WaferID;
	var deviceArr =  storage.device.split(";");
	var lotArr =  storage.lot.split(";");
	var DeviceSerialID = '${DeviceSerialID}';
	var LotSerialID = '${LotSerialID}';
	var groupList = '${groupList}';
	var Dienos = '${Dienos}';
	var Subdienos = '${Subdienos}';
	var waferMapsData = '${waferMapsData}';
	var waferdata = '${waferdata}';
	waferdata = JSON.parse(waferdata);
	/*  console.log("DeviceSerialID=="+DeviceSerialID);
	console.log(LotSerialID);
	console.log(groupList);
	console.log(Dienos);
	console.log(Subdienos);
	
	console.log(waferdata);  */
	console.log(waferMapsData);
	//加载 产品型号  批次号 晶圆编号
	$(".ProductId").text(DeviceSerialID); // 产品号
	$(".LotId").text(LotSerialID);  //批次号
	var WaferSerialIDArr = WaferSerialID.split(";");
	var WaferIDArr = WaferID.split(";");
	var currentWafer = window.location.href.match(/WaferID=(\S*)&DeviceSerialID/)[1];
	for(var i = 0 ; i < WaferSerialIDArr.length ; i++){
		var WaferSerialID = WaferSerialIDArr[i].split("-")[0];
		if(currentWafer == WaferSerialIDArr[i]){
			var str = "<option id='"+WaferIDArr[i]+"' device='"+deviceArr[i]+"' lot='"+lotArr[i]+"'  WaferSerialID='"+WaferSerialIDArr[i]+"' selected='selected'>"+WaferSerialID+"</option>";
		}
		else{
			var str = "<option id='"+WaferIDArr[i]+"' device='"+deviceArr[i]+"' lot='"+lotArr[i]+"'  WaferSerialID='"+WaferSerialIDArr[i]+"' >"+WaferSerialID+"</option>";
		}
		$(".PWaferId").append(str);
	}
	
	//加载subdie group type 下拉框
	function setOption(data,dom){
		var dataArr = data.replace("[","").replace("]","").split(",");
		var str = "";
		for(var a = 0 ; a < dataArr.length ; a++){
			str+= "<option>"+dataArr[a].replace(/(^\s*)|(\s*$)/g, "")+"</option>"
		}
		dom.append(str);
	}
	setOption(groupList,$(".GroupSelect"));
	setOption(Dienos,$(".DieTypeSelect"));
	setOption(Subdienos,$(".SubdieSelect"));
	
	//加载  合格信息  内容
	var currentParameter = waferdata.param;
	var currentYield =  waferdata.Yield;
	var currentQualifiedNum = waferdata.qualifynumber;
	var currentFailedNum =  waferdata.Unqulifynumber;
	$(".CurrentWaferData_left_content .currentParameter").text(currentParameter); 
	$(".CurrentWaferData_left_content .currentYield").text(currentYield*100+"%");
	$(".CurrentWaferData_left_content .currentQualifiedNum").text(currentQualifiedNum);
	$(".CurrentWaferData_left_content .currentFailedNum").text(currentFailedNum);
	
	//定义画布
	var can=document.getElementById("canvas");
	var ctx=can.getContext("2d");
	var canwidth = $(".canvasBox").width();
	var canheight = $(".canvasBox").height();
	can.width=canwidth;
	can.height=canheight;
	var colorMap = new HashTable();
	colorMap.add(1,"#008000");
	colorMap.add(-123456,"#0000FF");//低于下限，也是不合格数据
	colorMap.add(123456,"#e6085d");//超出上限，也是不合格数据
	colorMap.add(255,"red");
	colorMap.add(-1,"#314067");
	colorMap.add(-2,"#e4e8eb");
	colorMap.add(2,"#33CCFF");
	colorMap.add(3,"#2a9aa2");
	colorMap.add(4,"#34a496");
	colorMap.add(5,"#74a37b");
	colorMap.add(6,"#94a053"); 
	colorMap.add(7,"#a39f4e");
	colorMap.add(8,"#a5914c");
	colorMap.add(9,"#a6834e");
	colorMap.add(10,"#ffcc66");
	colorMap.add(11,"#835c25");
	colorMap.add(12,"white");
	function WaferMapPlotObj(ctx,r0,r,centerX,centerY,dieX,dieY,minRow,maxRow,minCol,maxCol,coordsArray,positionFlag,FlatLength,currentDieCoord){
		this.r0 = r0;//真实晶圆半径
		this.r=r;
		this.centerX=centerX;
		this.centerY=centerY;
		this.dieX=dieX;
		this.dieY=dieY;
		this.minRow=minRow;
		this.maxRow=maxRow;
		this.minCol=minCol;
		this.maxCol=maxCol;
		this.coordsArray = coordsArray;
		this.positionFlag = positionFlag;
		this.FlatLength=FlatLength;
		this.currentDieCoord=currentDieCoord;
	}
	WaferMapPlotObj.prototype.setPlotParameter = function(waferR,centerW,centerH){
		this.r=waferR;
		this.centerX=centerW;
		this.centerY=centerH;
	}
	//增加过滤die显示
	WaferMapPlotObj.prototype.changeCurrentDieCoord = function(newCoord){
		this.currentDieCoord=newCoord;
	}
	
	WaferMapPlotObj.prototype.plot=function(){
		var FilterFlag =true;
		$("#canvas").remove();
		var Canvas = $('<canvas id="canvas"></canvas>');
		$(".canvasBox").append(Canvas);
		can=document.getElementById('canvas');
		ctx=can.getContext('2d'); 
		var canwidth = $(".canvasBox").width();
		var canheight = $(".canvasBox").height();
		can.width=canwidth;
		can.height=canheight;
		
		
		var dieXZoom = 0.001* this.r*this.dieX / this.r0;
		var dieYZoom = 0.001* this.r*this.dieY / this.r0;
		
		var realr=this.r;
		var x_Max=-999999;
	    var x_Min=999999;
	    var y_Max=-999999;
	    var y_Min=999999;
		//计算行列坐标平均值
		for(var i=this.maxRow;i>=this.minRow;i--){
			for(var j=this.maxCol;j>=this.minCol;j--){	 
				var key = j+":"+i;	    	
				 if(this.coordsArray.containsKey(key))
				 { 
					if(j>x_Max)
					x_Max=j;
					if(j<x_Min)
					x_Min=j;
					if(i>y_Max)
					y_Max=i;
					if(i<y_Min)
					y_Min=i;			    				 
				}
			}
		}  
		x_Max = parseFloat(x_Max);x_Min = parseFloat(x_Min);y_Max = parseFloat(y_Max);y_Min = parseFloat(y_Min);
	    var xmean=(x_Max+x_Min)/2;
	    var ymean=(y_Max+y_Min)/2;
	    dieYZoom=dieXZoom*(x_Max-x_Min)/(y_Max-y_Min);
	    //计算绘制die需要的圆的半径
	    var rc=0;
		var ri=0;
		for(var i=this.maxRow;i>=this.minRow;i--){
	    	for(var j=this.maxCol;j>=this.minCol;j--){	 
	    		var key = j+":"+i;	    	
				if(this.coordsArray.containsKey(key))
				{ 
					ri=Math.sqrt(Math.pow((Math.abs(j-xmean)+0.5)*dieXZoom,2)+Math.pow((Math.abs(i-ymean)+0.5)*dieYZoom,2));
					if(rc<ri)
						rc=ri;
    			}
	    	}
	    }
		dieXZoom=0.995*dieXZoom*realr/rc;
		dieYZoom=0.995*dieYZoom*realr/rc;
		//var FlatLength = parseFloat(this.FlatLength)
		//计算圆弧的角度
		var a = Math.floor(180*Math.asin(this.FlatLength/(2*this.r0))/Math.PI);
		var startArc = ((90+a)*Math.PI)/180;
		var endArc = ((90-a)*Math.PI)/180;
		ctx.fillStyle="#314067";
		ctx.beginPath();
		if(startArc == endArc){
			ctx.arc(this.centerX, this.centerY, this.r,0,2*Math.PI);
		}
		else{
			 ctx.arc(this.centerX, this.centerY, this.r, startArc , endArc);
		}
	    ctx.closePath();
	    ctx.fill(); 
	    var x1,x2,x3,x4,y1,y2,y3,y4,z1,z2,z3,z4;
	    var area=this.r*this.r;
	    var dieCount = 0;
	    
	  	if(this.positionFlag == 'nullnull'){
			for(var i=this.maxRow;i>=this.minRow;i--){
				var y=this.centerY+i*dieYZoom-dieYZoom;
				for(var j=this.maxCol;j>=this.minCol;j--){
					var key = j+":"+i;	    	
					var x=this.centerX-j*dieXZoom;
					if(this.coordsArray.containsKey(key))
					 { 
						dieCount++;
					 	var bin = this.coordsArray.getValue(key);
					 	var Die=new Object();
						var rect=new Object();
					 	if(filterArr.length!=0){
					 		if(IsInArray(filterArr,key)&&colorMap.getValue(bin)!=-1){
					 			ctx.fillStyle=colorMap.getValue(bin);      //'#e0bf88';
					 			Die.filterFlag = "undisabled";
					 		}
					 		else{
					 			ctx.fillStyle="#ccc";   
					 			Die.filterFlag = "disabled";
					 		}
					 	}
					 	else{
					 		Die.filterFlag = "undisabled";
					 		ctx.fillStyle=colorMap.getValue(bin);      //'#e0bf88';
					 	}
						ctx.fillRect(x,y,dieXZoom,dieYZoom);
						ctx.lineWidth=1;
						ctx.strokeStyle="black";
						ctx.strokeRect(x,y,dieXZoom,dieYZoom);
						if( this.currentDieCoord =="" && FilterFlag && Die.filterFlag == "undisabled" && bin != -1  && bin != 12){ // 第一次加载  
	 						addHighLight(ctx,x,y,dieXZoom,dieYZoom);
	 						var WaferSerialID = $(".PWaferId option:selected").attr("id");
							if($(".content_right_title .active").length > 0){var index = $(".content_right_title .active").index() }else{var index =0};
							if(!resizeflag){
								getCurveData(j,i,WaferSerialID,index);
							}
							FilterFlag = false;
							Die.moveFlag = true;					
						}
	 					else if( this.currentDieCoord== key){
	 						 addHighLight(ctx,x,y,dieXZoom,dieYZoom)
	 						Die.moveFlag = true;
	 					}
	 					else{
	 						Die.moveFlag = false;
	 					}
					  	rect.x=x;
			    		rect.y=y;
			    		rect.width=dieXZoom;
			    		rect.height=dieYZoom;
			    		//Die.Dieno=dieCount;
			    		Die.Bin=bin;
			    		Die.rect=rect;
			    		coordsArray1.add(key,Die);
					}else{    				
						 ctx.fillStyle= "#20242b";
					} 
				}
		 	} 
	  }else if(this.positionFlag == 'LeftDown'){
	  
			for(var i=this.minRow;i<=this.maxRow;i++){
			var y = this.centerY-i*dieYZoom+ymean*dieYZoom-0.5*dieYZoom;			
				for(var j=this.minCol;j<=this.maxCol;j++){
				var key = j+":"+i;	    	
				var x=this.centerX+j*dieXZoom-xmean*dieXZoom-0.5*dieXZoom;
				if(this.coordsArray.containsKey(key))
				 { 
					dieCount++;
				 	var bin = this.coordsArray.getValue(key);
				 	var Die=new Object();
					var rect=new Object();
				 	if(filterArr.length!=0){
				 		if(IsInArray(filterArr,key) && colorMap.getValue(bin)!=-1){
				 			ctx.fillStyle=colorMap.getValue(bin);      //'#e0bf88';
				 			Die.filterFlag = "undisabled";
				 		}
				 		else{
				 			ctx.fillStyle="#ccc";   
				 			Die.filterFlag = "disabled";
				 		}
				 	}
				 	else{
				 		Die.filterFlag = "undisabled";
				 		ctx.fillStyle=colorMap.getValue(bin);      //'#e0bf88';
				 	}
					ctx.fillRect(x,y,dieXZoom,dieYZoom);
					ctx.lineWidth=1;
					ctx.strokeStyle="black";
					ctx.strokeRect(x,y,dieXZoom,dieYZoom);
					if( this.currentDieCoord =="" && FilterFlag && Die.filterFlag == "undisabled" && bin != -1  && bin != 12){ // 第一次加载  
						var WaferSerialID = $(".PWaferId option:selected").attr("id");
 						addHighLight(ctx,x,y,dieXZoom,dieYZoom);
						if($(".content_right_title .active").length > 0){var index = $(".content_right_title .active").index() }else{var index =0};
						if(!resizeflag){
							getCurveData(j,i,WaferSerialID,index);
						}
						FilterFlag = false;
						Die.moveFlag = true;					
					}
 					else if( this.currentDieCoord== key){
 						 addHighLight(ctx,x,y,dieXZoom,dieYZoom)
 						Die.moveFlag = true;
 					}
 					else{
 						Die.moveFlag = false;
 					}
					
				  	rect.x=x;
		    		rect.y=y;
		    		rect.width=dieXZoom;
		    		rect.height=dieYZoom;
		    		//Die.Dieno=dieCount;
		    		Die.Bin=bin;
		    		Die.rect=rect;
		    		coordsArray1.add(key,Die);
				}else{    				
					 ctx.fillStyle= "#20242b";
				} 
			}
		} 
	 }else if(this.positionFlag == 'RightDown'){
		  for(var i=this.maxRow;i>=this.minRow;i--){
			  var y=this.centerY-i*dieYZoom+ymean*dieYZoom-0.5*dieYZoom;		
	    	 for(var j=this.maxCol;j>=this.minCol;j--){	 
		    		var key = j+":"+i;	    	
		    		var x=this.centerX-j*dieXZoom+xmean*dieXZoom-0.5*dieXZoom;
	   			 if(this.coordsArray.containsKey(key)){
	   				dieCount++;
				 	var bin = this.coordsArray.getValue(key);
				 	var Die=new Object();
					var rect=new Object();
				 	if(filterArr.length!=0){
				 		if(IsInArray(filterArr,key)&&colorMap.getValue(bin)!=-1){
				 			ctx.fillStyle=colorMap.getValue(bin);      //'#e0bf88';
				 			Die.filterFlag = "undisabled";
				 		}
				 		else{
				 			ctx.fillStyle="#ccc";   
				 			Die.filterFlag = "disabled";
				 		}
				 	}
				 	else{
				 		Die.filterFlag = "undisabled";
				 		ctx.fillStyle=colorMap.getValue(bin);      //'#e0bf88';
				 	}
					ctx.fillRect(x,y,dieXZoom,dieYZoom);
					ctx.lineWidth=1;
					ctx.strokeStyle="black";
					ctx.strokeRect(x,y,dieXZoom,dieYZoom);
					if( this.currentDieCoord =="" && FilterFlag && Die.filterFlag == "undisabled" && bin != -1  && bin != 12){ // 第一次加载  
						var WaferSerialID = $(".PWaferId option:selected").attr("id");
 						addHighLight(ctx,x,y,dieXZoom,dieYZoom);
						if($(".content_right_title .active").length > 0){var index = $(".content_right_title .active").index() }else{var index =0};
						if(!resizeflag){
							getCurveData(j,i,WaferSerialID,index);
						}
						FilterFlag = false;
						Die.moveFlag = true;					
					}
 					else if( this.currentDieCoord== key){
 						 addHighLight(ctx,x,y,dieXZoom,dieYZoom)
 						Die.moveFlag = true;
 					}
 					else{
 						Die.moveFlag = false;
 					}
				  	rect.x=x;
		    		rect.y=y;
		    		rect.width=dieXZoom;
		    		rect.height=dieYZoom;
		    		//Die.Dieno=dieCount;
		    		Die.Bin=bin;
		    		Die.rect=rect;
		    		coordsArray1.add(key,Die);
	   			}else{   
	   				 ctx.fillStyle= "#20242b";
	   			} 
	    	}
	    }  
	 }else if(this.positionFlag == 'RightTop'){
		 for(var i=this.minRow;i<=this.maxRow;i++){
			 var y=this.centerY+i*dieYZoom-ymean*dieYZoom-0.5*dieYZoom;			
		    		for(var j=this.maxCol;j>=this.minCol;j--){	 
		    		var key = j+":"+i;	    	
		    		var x=this.centerX-j*dieXZoom+xmean*dieXZoom-0.5*dieXZoom;
	    			 if(this.coordsArray.containsKey(key))
		    		 { 
	    				 dieCount++;
	 				 	var bin = this.coordsArray.getValue(key);
	 				 	var Die=new Object();
	 					var rect=new Object();
	 				 	if(filterArr.length!=0){
	 				 		if(IsInArray(filterArr,key)&&colorMap.getValue(bin)!=-1){
	 				 			ctx.fillStyle=colorMap.getValue(bin);      //'#e0bf88';
	 				 			Die.filterFlag = "undisabled";
	 				 		}
	 				 		else{
	 				 			ctx.fillStyle="#ccc";   
	 				 			Die.filterFlag = "disabled";
	 				 		}
	 				 	}
	 				 	else{
	 				 		Die.filterFlag = "undisabled";
	 				 		ctx.fillStyle=colorMap.getValue(bin);      //'#e0bf88';
	 				 	}
	 					ctx.fillRect(x,y,dieXZoom,dieYZoom);
	 					ctx.lineWidth=1;
	 					ctx.strokeStyle="black";
	 					ctx.strokeRect(x,y,dieXZoom,dieYZoom);
	 					if( this.currentDieCoord =="" && FilterFlag && Die.filterFlag == "undisabled" && bin != -1  && bin != 12){ // 第一次加载  
	 						addHighLight(ctx,x,y,dieXZoom,dieYZoom);
	 						var WaferSerialID = $(".PWaferId option:selected").attr("id");
							if($(".content_right_title .active").length > 0){var index = $(".content_right_title .active").index() }else{var index =0};
							if(!resizeflag){
								getCurveData(j,i,WaferSerialID,index);
							}
							FilterFlag = false;
							Die.moveFlag = true;					
						}
	 					else if( this.currentDieCoord== key){
	 						 addHighLight(ctx,x,y,dieXZoom,dieYZoom)
	 						Die.moveFlag = true;
	 					}
	 					else{
	 						Die.moveFlag = false;
	 					}
	 				  	rect.x=x;
	 		    		rect.y=y;
	 		    		rect.width=dieXZoom;
	 		    		rect.height=dieYZoom;
	 		    		//Die.Dieno=dieCount;
	 		    		Die.Bin=bin;
	 		    		Die.rect=rect;
	 		    		coordsArray1.add(key,Die);
	    			}else{    				
	    				 ctx.fillStyle= "#20242b";
	    			} 
		    	}
		    }  
		  
	  } 
	 else if(this.positionFlag == 'LeftTop'){
		 for(var i=this.minRow;i<=this.maxRow;i++){
			 var y=this.centerY+i*dieYZoom-ymean*dieYZoom-0.5*dieYZoom;	
			 for(var j=this.minCol;j<=this.maxCol;j++){
					var key = j+":"+i;	    	
					var x=this.centerX+j*dieXZoom-xmean*dieXZoom-0.5*dieXZoom;
	    			 if(this.coordsArray.containsKey(key))
		    		 { 
	    				 dieCount++;
	 				 	var bin = this.coordsArray.getValue(key);
	 				 	var Die=new Object();
	 					var rect=new Object();
	 				 	if(filterArr.length!=0){
	 				 		if(IsInArray(filterArr,key)&&colorMap.getValue(bin)!=-1){
	 				 			ctx.fillStyle=colorMap.getValue(bin);      //'#e0bf88';
	 				 			Die.filterFlag = "undisabled";
	 				 		}
	 				 		else{
	 				 			ctx.fillStyle="#ccc";   
	 				 			Die.filterFlag = "disabled";
	 				 		}
	 				 	}
	 				 	else{
	 				 		Die.filterFlag = "undisabled";
	 				 		ctx.fillStyle=colorMap.getValue(bin);      //'#e0bf88';
	 				 	}
	 					ctx.fillRect(x,y,dieXZoom,dieYZoom);
	 					ctx.lineWidth=1;
	 					ctx.strokeStyle="black";
	 					ctx.strokeRect(x,y,dieXZoom,dieYZoom);
	 					if( this.currentDieCoord =="" && FilterFlag && Die.filterFlag == "undisabled" && bin != -1  && bin != 12){ // 第一次加载    
	 						addHighLight(ctx,x,y,dieXZoom,dieYZoom);
	 						var WaferSerialID = $(".PWaferId option:selected").attr("id");
							if($(".content_right_title .active").length > 0){var index = $(".content_right_title .active").index() }else{var index =0};
							if(!resizeflag){
								getCurveData(j,i,WaferSerialID,index);
							}
							FilterFlag = false;
							Die.moveFlag = true;					
						}
	 					else if( this.currentDieCoord== key){
	 						 addHighLight(ctx,x,y,dieXZoom,dieYZoom)
	 						Die.moveFlag = true;
	 					}
	 					else{
	 						Die.moveFlag = false;
	 					}
	 				  	rect.x=x;
	 		    		rect.y=y;
	 		    		rect.width=dieXZoom;
	 		    		rect.height=dieYZoom;
	 		    		//Die.Dieno=dieCount;
	 		    		Die.Bin=bin;
	 		    		Die.rect=rect;
	 		    		coordsArray1.add(key,Die);
	    			}else{    				
	    				 ctx.fillStyle= "#20242b";
	    			} 
		    	}
		    }  
	 	}
	  	
	  	var maxRow = this.maxRow;
	  	var minRow = this.minRow;
	  	var maxCol = this.maxCol;
	  	var minCol = this.minCol;
		var positionFlag =  this.positionFlag;
		if(positionFlag != ""){
			var src = '<img src="./EdmChart/img/'+positionFlag+'.png" alt="无坐标轴方向">';
			$(".positionFlagBox").empty().append(src);
		}
		
		
	  //鼠标移上die显示信息      开始
		var CurrentSelectedDie = null;
	   	can.addEventListener('mousemove', function (e) {
	        CurrentSelectedDie = null;
			var p = getEventPosition(e);
	   	    for(var i=maxRow;i>=minRow;i--){
	    		for(var j=maxCol;j>=minCol;j--){
	    			var key = j+":"+i;	 
		    		if(coordsArray1.containsKey(key))
		    		{
		    			var die = coordsArray1.getValue(key);
		             	if(IsInRec(die.rect,p))
		             	{
		             		CurrentSelectedDie = die;  
		             		CurrentSelectedDie.x = j;
		             		CurrentSelectedDie.y = i;
		             		break;
		             	}	
		    		}
	            }	
	        if(CurrentSelectedDie != null)
	          	break;
	        }
	        if(CurrentSelectedDie != null)
	        {    
	        	//console.log(CurrentSelectedDie)
	        	$("html,body").css("cursor","pointer");
	    		$('#in').show();
				var str = '';
			 	str +='<ul style="list-style:none;"><li>DIE信息</li><li>Coord: ('+CurrentSelectedDie.x+":"+CurrentSelectedDie.y +')</li><li>Bin:'+CurrentSelectedDie.Bin +'</li>';
				$('#in').html(str);
				$('#in').css({'left':p.x+20+'px','top':p.y+135+'px','color':'#000','background':'#fff','padding':'8px 7px '});
	        }
	  		 else{
	         	if(CurrentSelectedDie == null){
	         		$('#in').hide();
	         		$("html,body").css("cursor","default");
	         	}
	        } 
	    }, false);
		//鼠标移上die显示信息      结束
		
	  		//鼠标点击die   开始
	       	can.addEventListener('click', function (e) {
	       		resizeflag = false ;
	            CurrentSelectedDie = null;
	    		var p = getEventPosition(e);
	       	 	for(var i=maxRow;i>=minRow;i--){
	       	 	for(var j=minCol;j<=maxCol;j++){
		    			var key = j+":"+i;	    	
			    		if(coordsArray1.containsKey(key))
			    		{
			    			var die = coordsArray1.getValue(key);
			             	if(IsInRec(die.rect,p))
			             	{
			             		CurrentSelectedDie = die;  
			             		CurrentSelectedDie.x = j;
			             		CurrentSelectedDie.y = i;
			             		break;
			             	}	
			    		}
		            }	
	            	if(CurrentSelectedDie != null)
	              	break;
	            }
	       	 	if(CurrentSelectedDie != null){
	       	 	//	console.log(CurrentSelectedDie.filterFlag )
					if(CurrentSelectedDie.filterFlag != "disabled" && CurrentSelectedDie.Bin !=-1&& CurrentSelectedDie.Bin != 12){
						if(CurrentSelectedDie.Dieno != '-1'  ){
				       		var DieX = CurrentSelectedDie.x;
				       		var DieY = CurrentSelectedDie.y;
				       		var currentDieCoord = (DieX+":"+DieY);
						  	waferMapPlotObj1.changeCurrentDieCoord(currentDieCoord);	//修改选中die坐标		
							waferMapPlotObj1.plot();
							var WaferSerialID = $(".PWaferId option:selected").attr("id");
							var index = $(".content_right_title .active").index() ;
							//console.log("index==="+index);
							getCurveData(j,i,WaferSerialID,index);
				       	}
		      		}
	       	 	}
		      
	     
	        }, false);
    	//鼠标点击die   结束
    	
    
    	 //键盘事件 开始
	   $(document).off("keydown");
	   $(document).on("keydown",function(event){
		   var keydownflag = $("#keydownflag").val();
		   if(keydownflag != "false"){
			    resizeflag = false ;
				var code = event.keyCode||event.which;
				var currentDie_x = "";
				var currentDie_y = "";
				for(var i=maxRow;i>=minRow;i--){
		       	 	for(var j=minCol;j<=maxCol;j++){
		    			var key = j+":"+i;	    	
			    		if(coordsArray1.containsKey(key))
			    		{
			    			var die = coordsArray1.getValue(key);
			    			if(die.moveFlag){
			    				currentDie_x =j;
			    				currentDie_y =i;
			    				break;
			    			}
			    		}
		            }	
	            }
				
				var Die_x =currentDie_x;var Die_y =currentDie_y;
				var len = coordsArray1.getKeys().length;
				 if(positionFlag == "LeftDown"){
					switch (code)
					{
						case 37:
							for(var i = 1 ; i < len ;i++){
								  Die_x =currentDie_x -i;
								  var newkey  = Die_x+":"+Die_y;
								  if(coordsArray1.containsKey(newkey)){
									  if( coordsArray1.getValue(newkey).Bin == -1 ||coordsArray1.getValue(newkey).Bin == 12){    //遇到bin值为-1或12的die跳过
										  continue;
									  }
									  else{
										  break;  
									  }
								  }
							}
							 break;
						case 38:
						  for(var i = 1 ; i < len ;i++){
							  Die_y = currentDie_y + i;
							  var newkey  = Die_x+":"+Die_y;
							  if(coordsArray1.containsKey(newkey)){
								  if( coordsArray1.getValue(newkey).Bin == -1 ||coordsArray1.getValue(newkey).Bin == 12){    //遇到bin值为-1或12的die跳过
									  continue;
								  }
								  else{
									  break;  
								  }
							  }
							}
						  break;
						case 39:
						  for(var i = 1 ; i < len ;i++){
							  Die_x = currentDie_x +i ;
							  var newkey  = Die_x+":"+Die_y;
							  if(coordsArray1.containsKey(newkey)){
								  if( coordsArray1.getValue(newkey).Bin == -1 ||coordsArray1.getValue(newkey).Bin == 12){    //遇到bin值为-1或12的die跳过
									  continue;
								  }
								  else{
									  break;  
								  }
							  }
						  }
						  break;
						case 40:
						  for(var i = 1 ; i < len ;i++){
							  Die_y = currentDie_y - i ;
							  var newkey  = Die_x+":"+Die_y;
							  if(coordsArray1.containsKey(newkey)){
								  if( coordsArray1.getValue(newkey).Bin == -1 ||coordsArray1.getValue(newkey).Bin == 12){    //遇到bin值为-1或12的die跳过
									  continue;
								  }
								  else{
									  break;  
								  }
							  }
						  }
						  break;
					}
				}
				else if(positionFlag == "RightDown"){
					switch (code)
					{
						case 37:
						  for(var i = 1 ; i < len ;i++){
							  Die_x =currentDie_x +i;
							  var newkey  = Die_x+":"+Die_y;
							  if(coordsArray1.containsKey(newkey)){
								  if( coordsArray1.getValue(newkey).Bin == -1 ||coordsArray1.getValue(newkey).Bin == 12){    //遇到bin值为-1或12的die跳过
									  continue;
								  }
								  else{
									  break;  
								  }
							  }
						}
						  break;
						case 38:
						  for(var i = 1 ; i < len ;i++){
							  Die_y = currentDie_y + i;
							  var newkey  = Die_x+":"+Die_y;
							  if(coordsArray1.containsKey(newkey)){
								  if( coordsArray1.getValue(newkey).Bin == -1 ||coordsArray1.getValue(newkey).Bin == 12){    //遇到bin值为-1或12的die跳过
									  continue;
								  }
								  else{
									  break;  
								  }
							  }
							}
						  break;
						case 39:
						  for(var i = 1 ; i < len ;i++){
							  Die_x = currentDie_x -i ;
							  var newkey  = Die_x+":"+Die_y;
							  if(coordsArray1.containsKey(newkey)){
								  if( coordsArray1.getValue(newkey).Bin == -1 ||coordsArray1.getValue(newkey).Bin == 12){    //遇到bin值为-1或12的die跳过
									  continue;
								  }
								  else{
									  break;  
								  }
							  }
						  }
						  break;
						case 40:
						  for(var i = 1 ; i < len ;i++){
							  Die_y = currentDie_y - i ;
							  var newkey  = Die_x+":"+Die_y;
							  if(coordsArray1.containsKey(newkey)){
								  if( coordsArray1.getValue(newkey).Bin == -1 ||coordsArray1.getValue(newkey).Bin == 12){    //遇到bin值为-1或12的die跳过
									  continue;
								  }
								  else{
									  break;  
								  }
							  }
						  }
						  break;
					}
				}
				else if(positionFlag == "LeftTop"){
					switch (code)
					{
						case 37:
						  for(var i = 1 ; i < len ;i++){
							  Die_x =currentDie_x -i;
							  var newkey  = Die_x+":"+Die_y;
							  if(coordsArray1.containsKey(newkey)){
								  if( coordsArray1.getValue(newkey).Bin == -1 ||coordsArray1.getValue(newkey).Bin == 12){    //遇到bin值为-1或12的die跳过
									  continue;
								  }
								  else{
									  break;  
								  }
							  }
						}
						  break;
						case 38:
						  for(var i = 1 ; i < len ;i++){
							  Die_y = currentDie_y - i;
							  var newkey  = Die_x+":"+Die_y;
							  if(coordsArray1.containsKey(newkey)){
								  if( coordsArray1.getValue(newkey).Bin == -1 ||coordsArray1.getValue(newkey).Bin == 12){    //遇到bin值为-1或12的die跳过
									  continue;
								  }
								  else{
									  break;  
								  }
							  }
							}
						  break;
						case 39:
						  for(var i = 1 ; i < len ;i++){
							  Die_x = currentDie_x +i ;
							  var newkey  = Die_x+":"+Die_y;
							  if(coordsArray1.containsKey(newkey)){
								  if( coordsArray1.getValue(newkey).Bin == -1 ||coordsArray1.getValue(newkey).Bin == 12){    //遇到bin值为-1或12的die跳过
									  continue;
								  }
								  else{
									  break;  
								  }
							  }
						  }
						  break;
						case 40:
						  for(var i = 1 ; i < len ;i++){
							  Die_y = currentDie_y + i ;
							  var newkey  = Die_x+":"+Die_y;
							  if(coordsArray1.containsKey(newkey)){
								  if( coordsArray1.getValue(newkey).Bin == -1 ||coordsArray1.getValue(newkey).Bin == 12){    //遇到bin值为-1或12的die跳过
									  continue;
								  }
								  else{
									  break;  
								  }
							  }
						  }
						  break;
					}
				}
				else if(positionFlag == "RightDownTop"){
					switch (code)
					{
						case 37:
						  for(var i = 1 ; i < len ;i++){
							  Die_x =currentDie_x +i;
							  var newkey  = Die_x+":"+Die_y;
							  if(coordsArray1.containsKey(newkey)){
								  if( coordsArray1.getValue(newkey).Bin == -1 ||coordsArray1.getValue(newkey).Bin == 12){    //遇到bin值为-1或12的die跳过
									  continue;
								  }
								  else{
									  break;  
								  }
							  }
						}
						  break;
						case 38:
						  for(var i = 1 ; i < len ;i++){
							  Die_y = currentDie_y - i;
							  var newkey  = Die_x+":"+Die_y;
							  if(coordsArray1.containsKey(newkey)){
								  if( coordsArray1.getValue(newkey).Bin == -1 ||coordsArray1.getValue(newkey).Bin == 12){    //遇到bin值为-1或12的die跳过
									  continue;
								  }
								  else{
									  break;  
								  }
							  }
							}
						  break;
						case 39:
						  for(var i = 1 ; i < len ;i++){
							  Die_x = currentDie_x -i ;
							  var newkey  = Die_x+":"+Die_y;
							  if(coordsArray1.containsKey(newkey)){
								  if( coordsArray1.getValue(newkey).Bin == -1 ||coordsArray1.getValue(newkey).Bin == 12){    //遇到bin值为-1或12的die跳过
									  continue;
								  }
								  else{
									  break;  
								  }
							  }
						  }
						  break;
						case 40:
						  for(var i = 1 ; i < len ;i++){
							  Die_y = currentDie_y + i ;
							  var newkey  = Die_x+":"+Die_y;
							  if(coordsArray1.containsKey(newkey)){
								  if( coordsArray1.getValue(newkey).Bin == -1 ||coordsArray1.getValue(newkey).Bin == 12){    //遇到bin值为-1或12的die跳过
									  continue;
								  }
								  else{
									  break;  
								  }
							  }
						  }
						  break;
					}
				}
				if(code == 37 ||code == 38 ||code == 39 ||code == 40){
					var newkey  = Die_x+":"+Die_y;
					if(coordsArray1.containsKey(newkey)){
						waferMapPlotObj1.changeCurrentDieCoord(newkey);			
						waferMapPlotObj1.plot();
						var WaferSerialID = $(".PWaferId option:selected").attr("id");
						var index = $(".content_right_title .active").index() ;
						getCurveData(Die_x,Die_y,WaferSerialID,index)
					}
				}
		   }
	   });  
	 //键盘事件 结束	
	};
	
	//获取晶圆数据
	var DirectionX = waferMapsData.match(/DirectionX=(\S*),/)[1]; 
	var DirectionY = waferMapsData.match(/DirectionY=(\S*),/)[1]; 
	var DieSizeX = waferMapsData.match(/DieSizeX=(\S*),/)[1]; 
	var DieSizeY = waferMapsData.match(/DieSizeY=(\S*),/)[1]; 
	var positionFlag = DirectionX + DirectionY;
	var Diameter = waferMapsData.match(/Diameter=(\S*)}/)[1];
	var FlatLength = waferMapsData.match(/FlatLength=(\S*),/)[1];
	var maxX = waferMapsData.match(/maxX=(\S*),/)[1];
	var minX = waferMapsData.match(/minX=(\S*),/)[1]; 
	var maxY = waferMapsData.match(/maxY=(\S*),/)[1];
	var minY = waferMapsData.match(/minY=(\S*),/)[1];
	var DieDataList =waferdata.m_DieDataListNew;	
	DieDataList = changeHash(DieDataList);
	var r = $(".canvasBox").height() / 2 -20;
	var centerX = $(".canvasBox").width() / 2;
	var centerY =  $(".canvasBox").height() / 2;
	
	var waferMapPlotObj1 = new WaferMapPlotObj(ctx,Diameter,r,centerX,centerY,DieSizeX,DieSizeY,minY,maxY,minX,maxX,DieDataList,positionFlag,FlatLength,"");
	waferMapPlotObj1.plot();
	
	
		
	
	//切换曲线
	$(document).on("click",".CurveName",function(){
		var x=[];
	    var y=[];
	    var CVZ= [];
	    var CVX=[];
	    var CVY=[];
	    var index = $(this).attr("index");
		var newsubdieNo = $(this).attr("subdieNo");
		var oldsubdieNo = $(".currentSubdie").text();
		//判断点击的曲线类型与上一个的曲线类型是否为同一个subdie  若不是则重新请求
		if(newsubdieNo == oldsubdieNo){ 
			  var data = sessionStorage.getItem('CurveData');
			  data = JSON.parse(data);
			  	var length = data.curveinfos[index].dimension;
			  	if(length != 0){
			  		$("#picture").show();$("#picture1").hide();
				  	if(length == 2){
				  		x = data.curveinfos[index].axis[0].curvedatas;
				  		y = data.curveinfos[index].axis[1].curvedatas;
				  		$(this).addClass("active").siblings().removeClass("active");
				  	}
				  	else if(length == 3){
				  		CVZ = data.curveinfos[index].ZAxis;
				  		CVX = data.curveinfos[index].XAxis;
				  		CVY = data.curveinfos[index].YAxis;
				  		$(this).addClass("active").siblings().removeClass("active");
				  	}
					else if(length == 1){
				  		alert("当前曲线仅有一列数据！");
				  		$("#picture").show();$("#picture1").hide();
				  		return;
				  	}
				  	var subdie = $(this).attr("subdie");
				  	var group = $(this).attr("group");
				  	$(".CurrentWaferData_right_content .currentSubdie").text(subdie);	
			  		$(".CurrentWaferData_right_content .currentGroup").text(group);
				  	
				  	 var currentCurvename=$(this).text();
				  	 
				  	 if(data.curveinfos[index].ParamXUnit == ""){
				  		 var xAxisTitle=data.curveinfos[index].ParamX;
				  	 }
				  	 else{
				  		var xAxisTitle=data.curveinfos[index].ParamX+"("+data.curveinfos[index].ParamXUnit+"）";
				  	 };
				  	 if(data.curveinfos[index].ParamYUnit == ""){
				  		 var yAxisTitle=data.curveinfos[index].ParamY;
				  	 }
				  	 else{
				  		var yAxisTitle=data.curveinfos[index].ParamY+"("+data.curveinfos[index].ParamYUnit+"）";
				  	 };
				  	drawCurve($("#picture"),length,CVX,CVY,CVZ,x,y,currentCurvename,xAxisTitle,yAxisTitle);
			  	}
			  	else{
			  		$(this).addClass("active").siblings().removeClass("active");
			  		SmithCurve(index,data);
			  	}
		}
		else{
			var currentCoordinate = $(".currentCoordinate").text().replace(/\s/ig,'').replace("(", "").replace(")", "");
			var DieX =currentCoordinate.match(/(\S*):/)[1];
			var DieY =currentCoordinate.match(/:(\S*)/)[1];
			var WaferSerialID = $(".PWaferId option:selected").attr("id");
			 RF_SP2SwalMixin({
			 	title: '请等待',
			 	text: "数据加载中",
			 	type: 'info',
			 	showConfirmButton: false,
			 	timer: 2000,
			 }).then(function(result){
			 	if(result.dismiss == "timer"){
			 	}
			 });
			keydownflag = false;
			 $("#keydownflag").val("false");
			 var that = $(this);
			$.ajax({
			      type : 'GET',
			      url : "Curve",
			      data : {
			    	  DieX : DieX,
			    	  DieY : DieY,
			    	  WaferSerialID : WaferSerialID,
			    	  DieNO : "",
			    	  SubdieNO : newsubdieNo,
			    	  Group : "",
			      },
			      dataType : 'json',
			      success : function (data) {
			    	  var  CurveData = JSON.stringify(data);
					  sessionStorage.setItem('CurveData',CurveData);
					 console.log(data)
					// console.log(index)
					  if(data.curveinfos.length >=1){
					  		var length = data.curveinfos[index].dimension;
					  		if(length != 0){
							  	if(length == 1){
							  		alert("当前曲线仅有一列数据！");
							  		$("#picture").show();$("#picture1").hide();
							  	}
							  	else{
							  		if(length == 2){
								  		x = data.curveinfos[index].axis[0].curvedatas;
								  		y = data.curveinfos[index].axis[1].curvedatas;
								  		that.addClass("active").siblings().removeClass("active");
								  	}
								  	else if(length == 3){
								  		CVZ = data.curveinfos[index].ZAxis;
								  		CVX = data.curveinfos[index].XAxis;
								  		CVY = data.curveinfos[index].YAxis;
								  		that.addClass("active").siblings().removeClass("active");
								  	}
							  		$("#picture").show();$("#picture1").hide();
							  		$(".CurrentWaferData_right_content .currentSubdie").text(data.curveinfos[index].Subdie);	
							  		$(".CurrentWaferData_right_content .currentGroup").text(data.curveinfos[index].DeviceGroup);
								  	 var currentCurvename=data.curveinfos[index].curveType;
								  	 if(data.curveinfos[index].ParamXUnit == ""){
								  		 var xAxisTitle=data.curveinfos[index].ParamX;
								  	 }
								  	 else{
								  		var xAxisTitle=data.curveinfos[index].ParamX+"("+data.curveinfos[index].ParamXUnit+"）";
								  	 };
								  	 if(data.curveinfos[index].ParamYUnit == ""){
								  		 var yAxisTitle=data.curveinfos[index].ParamY;
								  	 }
								  	 else{
								  		var yAxisTitle=data.curveinfos[index].ParamY+"("+data.curveinfos[index].ParamYUnit+"）";
								  	 };
								  	drawCurve($("#picture"),length,CVX,CVY,CVZ,x,y,currentCurvename,xAxisTitle,yAxisTitle);
								  	RF_SP2SwalMixin({
								  		title: '完成',
								  		text: "数据加载完成",
								  		type: 'success',
								  		showConfirmButton: false,
								  		timer: 2000,
								  	}).then(function(result){
								  		if(result.dismiss == "timer"){
								  			$("#keydownflag").val("true");
								  		}
								  	});
							  	}
					  		}
					  		else{
					  			that.addClass("active").siblings().removeClass("active");
						  		SmithCurve(index,data);
					  		}
						}
			      }
		      })
		}
	})

	
	
	
	//下拉框选中 过滤
	$(".filterBtn").on("click",function(){
		resizeflag = false ;
		var DieNO =$(".DieTypeSelect   option:selected").text();
		var SubdieNO = $(".SubdieSelect option:selected").text();
		var Group = $(".GroupSelect  option:selected").text();
		var WaferSerialID = $(".PWaferId option:selected").attr("id");
		DieNO == "AllDieType" ? DieNO="":DieNO=DieNO;
		SubdieNO == "AllSubdie" ? SubdieNO="":SubdieNO=SubdieNO;
		Group == "AllGroup" ? Group="":Group=Group;
		if(DieNO == "" &&SubdieNO == "" && Group == ""  ){
			window.location.reload();
		}
		else{
			$.ajax({
			      type : 'GET',
			      url : "CurveFilter",
			      data : {
			    	  DieNO : DieNO,
			    	  SubdieNO : SubdieNO,
			    	  Group : Group,
			    	  WaferSerialID : WaferSerialID,
			      },
			      dataType : 'json',
			      success : function (data) {
			    	 console.log(data)
			    	  var filterData = data.m_DieDataList;
			    	  filterArr = [];
			    	 var currentCoordinate = $(".currentCoordinate").text().replace(/\s/ig,'').replace("(", "").replace(")", "");
			    	 var flag = false;  // 判断当前die选中die过滤后是否存在
			    	  for(var n = 0; n < filterData.length ;n++){
			    		  var key = filterData[n].DieX+":"+filterData[n].DieY;
			    		  filterArr.push(key);
		    		 	  if(key == currentCoordinate){
			    			  flag = true;
			    		  }  
			    	  }
			    	 if(flag){
			    		waferMapPlotObj1.changeCurrentDieCoord(currentCoordinate);
			    		if($(".content_right_title .active").length > 0 ){var index = $(".content_right_title .active").index() }else{var index =0};
			    		var WaferSerialID = $(".PWaferId option:selected").attr("id");
 			    		var DieX = currentCoordinate.split(":")[0];
			    		var DieY = currentCoordinate.split(":")[1];
				    	getCurveData(DieX,DieY,WaferSerialID,index)
			    	 }
			    	 else{
			    		 waferMapPlotObj1.changeCurrentDieCoord("");			    		
			    	 }
			    	 waferMapPlotObj1.plot();
			      }
			 })
		}
		
	})
    
	window.onresize = function(){ 
		resizeflag = true;
		var r = $(".canvasBox").height() / 2 -20;
		var centerX = $(".canvasBox").width() / 2;
		var centerY =  $(".canvasBox").height() / 2;
		waferMapPlotObj1.setPlotParameter(r,centerX,centerY);			
		waferMapPlotObj1.plot();
    }
	
	
	var changeflag = 1;
	$(".title_left").click(function(){
		if($(this).hasClass("color")){
			return
		}
		else{
			var length =Math.floor( $(".content_right_title").width() / $(".CurveName").width())
		    var curveTitleLength = Math.ceil($(".CurveName").length / length);
			if(curveTitleLength < 2 ){
				$(".title_left").addClass("color");
				$(".title_right").addClass("color");
				return
			}
			else{
				var top = parseFloat($(".content_right .content_right_title").css("top")) +32;
				$(".content_right .content_right_title").css("top",top+"px");
				changeflag --;
				 if(changeflag <2){    //第一页
					$(".title_right").removeClass("color");
					$(".title_left").addClass("color");
				}
				if(changeflag < curveTitleLength){
					$(".title_right").removeClass("color");
				}
			}
		}
	})
	$(".title_right").click(function(){
		if($(this).hasClass("color")){
			return
		}
		else{
			var length =Math.floor( $(".content_right_title").width() / $(".CurveName").width())
		    var curveTitleLength = Math.ceil($(".CurveName").length / length);
			if(curveTitleLength < 2 ){
				$(".title_left").addClass("color");
				$(".title_right").addClass("color");
				return;
			}
			else{
				var top = parseFloat($(".content_right .content_right_title").css("top")) -32;
			//	console.log(top)
				$(".content_right .content_right_title").css("top",top+"px");
				changeflag ++;
				if(changeflag == curveTitleLength ){ //最后一页
					$(".title_right").addClass("color");
					$(".title_left").removeClass("color");
				}
				if(changeflag > 1){
					$(".title_left").removeClass("color");
				}
			}
		}
	})
})	

	//阻止浏览器默认右键点击事件
	$("#picture_box2,#picture_box3").bind("contextmenu", function(){
	    return false;
	})
	$("#picture_box2,#picture_box3").mousedown(function(e) {
		if (3 == e.which) {
			var p = getEventPosition(e);
			$(this).find(".contextmenuBox").css({top:(p.y+10),left:(p.x+10)});
			$(this).find(".contextmenuBox").show();
        }
	})
	$(".contextmenuBox").click(function(){
		var WaferSerialID = $(".PWaferId option:selected").attr("id");
		var Paramter = $(this).parent().find(".Smith_Paramter").eq(0).text().split("-");
		var Dieno = Paramter[0];
		var Subddie = Paramter[1];
		var CurveType = $(".content_right_title .active").text();
		var that = $(this);
		var flag = $(this).attr("flag");
		if(flag  == "initial"){
			var GraphStyle = "MagnitudeDB";
			$(this).removeAttr("flag").attr("flag","change");
		}
		else{
			var GraphStyle = "";
			$(this).removeAttr("flag").attr("flag","initial");
		}
		MagnitudeDB(that,GraphStyle,WaferSerialID,Dieno,Subddie,CurveType);
		$(".contextmenuBox").hide();
	})
	$(document).click(function(){
		$(".contextmenuBox").hide();
	})
	
	
	//史密斯区域 曲线图数据切换
	function MagnitudeDB(dom,GraphStyle,WaferSerialID,Dieno,Subddie,CurveType){
		$.ajax({
			  type : 'GET',
		      url : "GetMagnitudeDB",
		      data : {
		    	  GraphStyle : GraphStyle,
		    	  WaferSerialID : WaferSerialID,
		    	  Dieno : Dieno,
		    	  Subddie : Subddie,
		    	  CurveType : CurveType,
		      },
		      dataType : 'json',
		      success : function (data) {
		    	  console.log(data);
		    	  console.log(dom.parent().find(".picturetop").attr("id"))
		    	  dom.parent().find(".picturetop").empty();
		    	  var Smith_Msg1 =dom.parent().find(".Smith_Msg1").text();
		    	  if(Smith_Msg1 == "S12"){
		    		  var DbCurveData1 = data.S12;
		    	  }
		    	  else{
		    		  var DbCurveData1 = data.S21;
		    	  }
	    		 var DbCurveDom = dom.parent().find(".picturetop").attr("id");
				 var DbCurveDom1 = dom.parent().find(".picturebottom").attr("id");
				//曲线
				drawDbCurve(DbCurveDom,DbCurveData1,$("#"+DbCurveDom1));
		      }
		})
	}
	
	
//根据坐标获取曲线信息
/* index  当前选中项的索引 */
	function getCurveData(DieX,DieY,WaferSerialID,index){
		var chart = Highcharts.chart('picture', {credits: {enabled: false}});   //获取图表对象
        chart.showLoading();
        RF_SP2SwalMixin({
        	title: '请稍等',
        	text: "数据加载中",
        	type: 'info',
        	showConfirmButton: false,
        	timer: 2000,
        }).then(function(result){
        	if(result.dismiss == "timer"){
        		$("#keydownflag").val("false");
        	}
        });    	
        var DieNO =$(".DieTypeSelect  option:selected").text();
		var SubdieNO = $(".SubdieSelect option:selected").text();
		var Group = $(".GroupSelect  option:selected").text();
		DieNO == "AllDieType" ? DieNO="":DieNO=DieNO;
		SubdieNO == "AllSubdie" ? SubdieNO="":SubdieNO=SubdieNO;
		Group == "AllGroup" ? Group="":Group=Group;
		RF_SP2SwalMixin({
			title: '请稍等',
			text: "数据加载中",
			type: 'info',
			showConfirmButton: false,
			showCancelButton: false
		});
		$.ajax({
		      type : 'GET',
		      url : "Curve",
		      data : {
		    	  DieX : DieX,
		    	  DieY : DieY,
		    	  WaferSerialID : WaferSerialID,
		    	  DieNO : DieNO,
		    	  SubdieNO : SubdieNO,
		    	  Group : Group,
		      },
		      dataType : 'json',
		      success : function (data) {
			  var  CurveData = JSON.stringify(data);
			  sessionStorage.setItem('CurveData',CurveData);
			  console.log(data)
			  	//坐标信息区域显示
			  	$(".CurrentWaferData_right_content .currentCoordinate").text("( "+DieX+" : "+DieY+" )");
			  	$(".CurrentWaferData_right_content .currentSubdie").text(data.SubdieNO);	
			  	$(".CurrentWaferData_right_content .currentGroup").text(data.group);	
			  	$(".CurrentWaferData_right_content .currentDieType").text(data.DieType);	
			  	$(".CurrentWaferData_right_content .currentDieNo").text(data.Dieno);
			  	//绘图区域  标题
			  	var curvestr = "";
			  	var CurveTypeLength = -1;
			  	for(var n in data.SubdieAndCurveType){
			  		
			  		for(var a = 0 ; a < data.SubdieAndCurveType[n].length ; a++){     // index = a   当前subdie第几个曲线类型
			  			CurveTypeLength++;  //获取SubdieAndCurveType 长度
			  			curvestr += '<li class="CurveName" subdieNo="'+n+'" index="'+a+'" >'+data.SubdieAndCurveType[n][a]+'</li>'
			  		}
			  	}
			  	
			  	if(index >= CurveTypeLength || index < 0){
		  			index = CurveTypeLength;
		  		}
			  	$(".content_right_title").empty().append(curvestr);
			  	$(".content_right_title li").eq(index).addClass("active");
			  	var length =Math.floor( $(".content_right_title").width() / $(".CurveName").width())
			    var curveTitleLength = Math.ceil($(".CurveName").length / length);
			  	if(curveTitleLength > 1){
			  		$(".title_right").removeClass("color");
			  	}
			  	//默认加载第一个曲线
		  		var x=[];
			    var y=[];
			    var CVZ= [];
			    var CVX=[];
			    var CVY=[];
			  	//console.log("length=="+data.curveinfos.length)
			  	if(data.curveinfos.length >=1){
			  		if(index > 	data.curveinfos.length -1){
			  			index = data.curveinfos.length -1;
			  		}
			  		var length = data.curveinfos[index].dimension;
			  		
			  		if(length != 0){
			  			if(length == 1){
					  		alert("当前曲线仅有一列数据！");
					  		$("#picture").show();$("#picture1").hide();
					  	}
					  	else{
					  		if(length == 2){
						  		x = data.curveinfos[index].axis[0].curvedatas;
						  		y = data.curveinfos[index].axis[1].curvedatas;
						  	}
						  	else if(length == 3){
						  		CVZ = data.curveinfos[index].ZAxis;
						  		CVX = data.curveinfos[index].XAxis;
						  		CVY = data.curveinfos[index].YAxis;
						  	}
					  		$("#picture").show();$("#picture1").hide();
					  		$(".CurrentWaferData_right_content .currentSubdie").text(data.curveinfos[index].Subdie);	
					  		$(".CurrentWaferData_right_content .currentGroup").text(data.curveinfos[index].DeviceGroup);
						  	 var currentCurvename=data.curveinfos[index].curveType;
						  	 if(data.curveinfos[index].ParamXUnit == ""){
						  		 var xAxisTitle=data.curveinfos[index].ParamX;
						  	 }
						  	 else{
						  		var xAxisTitle=data.curveinfos[index].ParamX+"("+data.curveinfos[index].ParamXUnit+"）";
						  	 };
						  	 if(data.curveinfos[index].ParamYUnit == ""){
						  		 var yAxisTitle=data.curveinfos[index].ParamY;
						  	 }
						  	 else{
						  		var yAxisTitle=data.curveinfos[index].ParamY+"("+data.curveinfos[index].ParamYUnit+"）";
						  	 };
						  	drawCurve($("#picture"),length,CVX,CVY,CVZ,x,y,currentCurvename,xAxisTitle,yAxisTitle);
						  	
					  	}
			  		}
			  		else{
				  		SmithCurve(index,data);
			  		}
			  		chart.hideLoading();
			  		RF_SP2SwalMixin({
			  			title: '完成',
			  			text: "数据加载完成",
			  			type: 'success',
			  			showConfirmButton: false,
			  			showCancelButton: false,
			  			timer: 1000
			  		}).then(function(result){
						if(result.dismiss == "timer"){
							$("#keydownflag").val("true");
						}
					});
				}
			  	else{
			  		$("#picture").show();$("#picture1").hide();
			  		chart.hideLoading();
	  		  		RF_SP2SwalMixin({
	  		  			title: '信息',
	  		  			text: "此晶圆无曲线数据！",
	  		  			type: 'info',
	  		  			showConfirmButton: false,
	  		  			showCancelButton: false,
	  		  			timer: 1000
	  		  		}).then(function(result){
	  					if(result.dismiss == "timer"){
	  						$("#keydownflag").val("true");
	  					}
	  				});
			  	}
		      },
		      error : function () {
		      }
		 });
	}
	function SmithCurve(index,data){
  		$("#picture").hide();$("#picture1").show();
  		////默认加载史密斯信息
  		var Smith_Paramter = $(".currentDieNo").text()+"-"+data.curveinfos[index].Subdie+"-"+data.curveinfos[index].DeviceGroup;
		$(".Smith_Paramter").text(Smith_Paramter)
  		
  		var dom1 = document.getElementById("picture1top");
  		var dom2 = document.getElementById("picture4top");
  		var msgdom1  = document.getElementById("picture1bottom");
  		var msgdom2  = document.getElementById("picture4bottom");
		var title = [''];
		var legendName1 = ['S11'];var legendName2 = ['S22'];
		var data1 = [data.curveinfos[index].smithAndCurve.S11];
		var data2 = [data.curveinfos[index].smithAndCurve.S22];
		//console.log(data.curveinfos[index]);
		var smith1 = smithChart(dom1,title,legendName1, data1,'S11',msgdom1);
		var smith2 = smithChart(dom2,title,legendName2, data2,'S22',msgdom2);
		var DbCurveDom1 = "picture2top";
		var DbCurveDom2 = "picture3top";
		var DbCurveData1 = data.curveinfos[index].smithAndCurve.S12;
		var DbCurveData2 = data.curveinfos[index].smithAndCurve.S21;
		//曲线
		drawDbCurve(DbCurveDom1,DbCurveData1,$("#picture2bottom"));
		drawDbCurve(DbCurveDom2,DbCurveData2,$("#picture3bottom"));
		//默认加载曲线信息
		$("#picture2bottom .Smith_Msg2").text(parseFloat(DbCurveData1[0][1])+" dB,"+(DbCurveData1[0][0]/1000000000).toFixed(2)+"GHz");
		$("#picture3bottom .Smith_Msg2").text(parseFloat(DbCurveData2[0][1])+" dB,"+(DbCurveData2[0][0]/1000000000).toFixed(2)+"GHz");	
		
		window.onresize = function () {
			smith1.onresize();
			smith2.onresize();
		}
	}
	


	// 添加高亮
	  function addHighLight(ctx,x,y,dieXZoom,dieYZoom){
		ctx.strokeStyle="#fff";
		ctx.lineWidth=dieXZoom*0.06;
		ctx.beginPath();
		var sidewidth = dieXZoom*0.037;//绘制高亮边
		//左上
		ctx.moveTo(x+dieXZoom/5,y);
		ctx.lineTo(x,y);
		ctx.lineTo(x,y+dieYZoom/5);
		//左下
		ctx.moveTo(x,y+dieYZoom/5*4);
		ctx.lineTo(x,y+dieYZoom-sidewidth);
		ctx.lineTo(x+dieXZoom/5,y+dieYZoom-sidewidth);
		//右下上
		ctx.moveTo(x+dieXZoom/5*4,y+dieYZoom-sidewidth);
		ctx.lineTo(x+dieXZoom-sidewidth,y+dieYZoom-sidewidth);
		ctx.lineTo(x+dieXZoom-sidewidth,y+dieYZoom/5*4);
		//右上
		ctx.moveTo(x+dieXZoom/5*4,y);
		ctx.lineTo(x+dieXZoom-sidewidth,y);
		ctx.lineTo(x+dieXZoom-sidewidth,y+dieYZoom/5);
		ctx.stroke();
		
	}    
 	  /* function addHighLight(ctx,x,y,dieXZoom,dieYZoom) {
		// r, R, x, y
		x = x + dieXZoom/2;
		y = y + dieYZoom/2;
		var dieZoom ;
		dieXZoom >= dieYZoom ? dieZoom =  dieYZoom:  dieZoom = dieXZoom;
		R = dieZoom / 4 * 2;
		r = R /2;
		ctx.lineWidth=dieXZoom*0.06;
		var  fillColor = "#fff"
		var changeDeg = 0;
        //绘制星星的路径,changeDeg：表示五角星旋转的角度
        ctx.beginPath(); //开始路径  
        for (var i = 0; i < 5; i++) {
            ctx.lineTo(Math.cos((18 + i * 72 - changeDeg) / 180 * Math.PI) * R + x, -Math.sin((18 + i * 72 - changeDeg) / 180 * Math.PI) * R + y);
            ctx.lineTo(Math.cos((54 + i * 72 - changeDeg) / 180 * Math.PI) * r + x, -Math.sin((54 + i * 72 - changeDeg) / 180 * Math.PI) * r + y);
        }
        ctx.closePath() //结束路径  
        ctx.fillStyle = fillColor;
        ctx.fill();
    }   */ 
	//转换为哈希表格式
	function changeHash(obj){
		var Hash = new HashTable();
		for(var i = 0 ; i < obj.length ; i++){
			for(var a in obj[i]){
				Hash.add(a,obj[i][a])
			}
		}
		return Hash;
	}
	//判断鼠标当前点击位置是在die上
	function IsInRec(rec,p)
	{
		var contain = false;
		if((p.x >rec.x && p.x <= rec.x + rec.width) && (p.y >rec.y && p.y <= rec.y + rec.height))
			contain = true;
		else
			contain = false;
		return contain;
	}
	
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
	//判断字符是否在数组中
	function IsInArray(arr,val){ 
		var testStr=','+arr.join(",")+","; 
		return testStr.indexOf(","+val+",")!=-1; 
	} 
	//数组排序
	function sort(arr,arr1){
	    for(var j=0;j<arr.length-1;j++){
	    //两两比较，如果前一个比后一个大，则交换位置。
	       for(var i=0;i<arr.length-1-j;i++){
	            if(arr[i]>arr[i+1]){
	                var temp = arr[i];
	                arr[i] = arr[i+1];
	                arr[i+1] = temp;
	                var temp1 = arr1[i];
	                arr1[i] = arr1[i+1];
	                arr1[i+1] = temp1;
	            }
	        } 
	    }
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
							mouseOver: function () {
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
	
	
	function drawCurve(dom,length,CVX,CVY,CVZ,x,y,currentCurvename,xAxisTitle,yAxisTitle){
		if(length == 3){
			 var yData  = [];
			 var newCVZ = [];
			 for(var i = 0 ; i < CVX.length ; i++){
				sort(CVX[i],CVY[i]);
				 var str = {};
				 str.name = "P="+CVZ[i];
				 str.data = CVY[i];
				 yData.push(str);
			 }
			 var chart = Highcharts.chart('picture', {
					chart: {
							type: 'line'
					},
					title: {
							text: currentCurvename
					},
					legend: {
						
			        },
			        lang: {
			            loading: 'Loading...' ,//设置载入动画的提示内容，默认为'Loading...'，若不想要文字提示，则直接赋值空字符串即可 
			        },
				    xAxis: {
						  title: {
								text: xAxisTitle,
						},
						lineColor: 'black',
					}, 
					yAxis: [{
						lineWidth: 1,
						lineColor: 'black',
						arrow: true,
						reversed: false,
						title: {
							text: yAxisTitle,
							align: 'high',
							rotation: 0,
						},
					}],
					series: yData,
					credits: {
							enabled: false
					}
			});
			 
		}
		else if(length == 2){ 
			var chart = Highcharts.chart('picture', {
				chart: {
						type: 'line'
				},
				title: {
						text: currentCurvename
				},
				 lang: {
			            loading: 'Loading...'//设置载入动画的提示内容，默认为'Loading...'，若不想要文字提示，则直接赋值空字符串即可
			        },
		        xAxis: {
					  title: {
							text: xAxisTitle,
					},
					lineColor: 'black',
				},
			/* 	yAxis: {
					title: {
							text: yAxisTitle,
							align: 'high',
							rotation: 0,
					},
				}, */
				yAxis: [{
					lineWidth: 1,
					lineColor: 'black',
					arrow: true,
					reversed: false,
					title: {
						text: yAxisTitle,
						align: 'high',
						rotation: 0,
					},
				}],
				series: [ {
						data: y
				}],
				credits: {
						enabled: false
				}
			});
		}
	} 
	var currentHref = window.location.href.split("/")[0]+"//"+window.location.href.split("/")[2]+"/"+window.location.href.split("/")[3];
	
	$(".nav_tab1").click(function(){
		 var WaferID = storage.seeWaferID.split(";").join(" ");
		 var WaferSerialID = storage.WaferID.split(";").join(" ");
		 var actionUrl=currentHref+"/paramdiedata?selectwafer="+WaferID+"&waferSerialIDStr="+WaferSerialID+"&allParamter=allParamter";
		window.location.href = actionUrl;
	})
	//晶圆编号下拉框 切换
	$(".PWaferId").on("change",function(){
		 var WaferID = $(".PWaferId option:selected").attr("WaferSerialID");
		 var WaferSerialID = $(".PWaferId option:selected").attr("id");
		 var DeviceSerialID = $(".PWaferId option:selected").attr("device").replace(/(^\s*)/g,"");   //去除左边空格
		 var LotSerialID = $(".PWaferId option:selected").attr("lot").replace(/(^\s*)/g,"");
		window.location.href = currentHref+"/VectorMap?WaferSerialID="+WaferSerialID+"&WaferID="+WaferID+"&DeviceSerialID="+DeviceSerialID+"&LotSerialID="+LotSerialID;
	})
	
		var funDownload = function (content, filename) {
		    var eleLink = document.createElement('a');
		    eleLink.download = filename;
		    eleLink.style.display = 'none';
		    var blob = new Blob([content]);
		    eleLink.href = URL.createObjectURL(blob);
		    document.body.appendChild(eleLink);
		    eleLink.click();
		    document.body.removeChild(eleLink);
		};
    	
		var eleButton = document.querySelector('#createReg');
		if ('download' in document.createElement('a')) {
		    eleButton.onclick = function(){
		    	if($(".createReg").attr("flag")=="down"){
		    		var address = document.getElementById("address").value;
			    	  address = address.replace(/\\/g,'\\\\');
			    	  
			    	  var exename = address.split("\\").pop().match(/(\S*).exe/)[1];
			    	//  console.log(exename);
		    		if(address != ""){
		    			var eleTextarea = ' Windows Registry Editor Version 5.00'+'\n'+
						'[HKEY_CLASSES_ROOT\\test] '+'\n'+
						'@="myprotocol Protocol" '+'\n'+
						'"URL Protocol"="" '+'\n'+

						'[HKEY_CLASSES_ROOT\\test\\DefaultIcon] '+'\n'+
						'@="'+address+'"'+'\n'+

						'[HKEY_CLASSES_ROOT\\test\\shell] '+'\n'+
						'@="" '+'\n'+

						'[HKEY_CLASSES_ROOT\\test\\shell\\open] '+'\n'+
						'@="" '+'\n'+

						'[HKEY_CLASSES_ROOT\\test\\shell\\open\\command] '+'\n'+
						'@="'+address+'"';
		    			/*此处修改注册表的名字，可以根据需求任意命名*/
				    	funDownload(eleTextarea, 'Registry.reg');    
						$("#address").hide();
						$(".createReg").val("修改注册表");
						$(".createReg").attr("flag","edit")
						$(".starting").val("启动"+exename);
						window.localStorage.setItem("exe",exename);
		    		}
		    	}
		    	else{
		    		$("#address").show();
		    		$(".createReg").attr("flag","down")
					$(".createReg").val("注册表下载");
		    	}
		    }
		    
		} else {
			    eleButton.onclick = function () {
			        alert('浏览器不支持,推荐使用最新版本chrome浏览器');    
			    };
		}
	$(".starting").click(function(){
		document.getElementById("ProgramHref").click();
	})
		//logo 及数据列表跳转路径
	 function getUrl(){
		var currentHref = window.location.href.split("/")[0]+"//"+window.location.href.split("/")[2]+"/"+window.location.href.split("/")[3]; //当前网址
		var currentpage ='${CurrentPage}';
		var selectSearchType ='${selectSearchType}';
		var selectParameters ='${selectParameters}';
		var searchNumber ='${searchNumber}';
		var endtime ='${endtime}';
		var selectwafer ='${selectwafer}';
		var url = currentHref+"/GetSelectDataListPage?currentpage="+currentpage+"&selectSearchType="+selectSearchType+"&selectParameters="+selectParameters+"&searchNumber="+searchNumber+"&endtime="+endtime+"&selectwafer="+selectwafer;         
		return url;
	}
	$(document).on("click",".logo,.gotoIndex",function(){
		var url = getUrl();
		window.location.href=url;
	})