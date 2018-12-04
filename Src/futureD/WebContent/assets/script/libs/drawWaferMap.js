//判断鼠标当前点击位置是在die上
function IsInnerRect(rec,p){
    var contain = false;
    if((p.x >rec.x && p.x <= rec.x + rec.width) && (p.y >rec.y && p.y <= rec.y + rec.height))
        contain = true;
    else
        contain = false;
    return contain;
}

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

// 添加高亮
  function mapAddHighLight(ctx,x,y,dieXZoom,dieYZoom){
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

function HashTable(){ 
	var size = 0; 
	var entry = new Object(); 
	this.add = function (key , value){ 
		if(!this.containsKey(key)) 
		{ 
			size ++ ; 
		} 
	   entry[key] = value; 
	};
	this.getValue = function (key){ 
		return this.containsKey(key) ? entry[key] : null; 
	};
	this.remove = function ( key ){ 
		if( this.containsKey(key) && ( delete entry[key] ) ) 
		{ 
		size --; 
		} 
	};
	this.containsKey = function ( key ){ 
		return (key in entry); 
	};
	this.containsValue = function ( value ){ 
		for(var prop in entry) 
		{ 
			if(entry[prop] == value) 
			{ 
				return true; 
			} 
		} 
		return false; 
	};
	this.getValues = function (){ 
		var values = new Array(); 
		for(var prop in entry) 
		{ 
			values.push(entry[prop]); 
		} 
		return values; 
	};
	this.getKeys = function (){ 
		var keys = new Array(); 
		for(var prop in entry) 
		{ 
			keys.push(prop); 
		} 
		return keys; 
	};
	this.getSize = function (){ 
		return size; 
	};
	this.clear = function (){ 
		size = 0; 
		entry = new Object(); 
	};
} 

//转换为哈希表格式
function changeHash(obj){
	var Hash = new HashTable();
	for(var i = 0 ; i < obj.length ; i++){
		for(var a in obj[i]){
			Hash.add(a,obj[i][a]);
		}
	}
	return Hash;
}

function WaferMapPlotObj(option) {
    this.colorMap = option.colorMap;
    this.bgFillColor = option.bgFillColor;
    this.ctx = option.ctx;
    this.r0 = option.r0; //真实晶圆半径
    this.r = option.r;
    this.centerX = option.centerX;
    this.centerY = option.centerY;
    this.dieX = option.dieX;
    this.dieY = option.dieY;
    this.minRow = option.minRow;
    this.maxRow = option.maxRow;
    this.minCol = option.minCol;
    this.maxCol = option.maxCol;
    this.coordsArray = option.coordsArray;
    this.positionFlag = option.positionFlag;
    this.FlatLength = option.FlatLength;
    this.colorOrder = option.colorOrder;
    this.filterArr = option.filterArr;
    this.currentDieCoord = option.currentDieCoord;
    this.isFirst = option.isFirst;
    this.isSaveDieCoord = option.isSaveDieCoord;
    this.saveDieCoord = option.saveDieCoord;
    this.coordsArra = option.coordsArra;
    this.vectorMap = option.vectorMap;
    this.container = option.container;
}

if (WaferMapPlotObj.prototype.type == undefined) {
    WaferMapPlotObj.prototype.setPlotParam = function(newObj){
        if(!_.isEmpty(newObj)){
            _.forOwn(newObj, (function(v, k){
                this[k] = v;
            }).bind(this));
        }
        return this;
    };
    WaferMapPlotObj.prototype.plot = function() {
    	var colorMap = this.colorMap;
    	var ctx = this.ctx;
    	var bgFillColor = this.bgFillColor;
        var dieXZoom = 0.001 * this.r * this.dieX / this.r0;
        var dieYZoom = 0.001 * this.r * this.dieY / this.r0;
        var realr = this.r;
        var x_Max = -999999;
        var x_Min = 999999;
        var y_Max = -999999;
        var y_Min = 999999;
        var colorOrder = this.colorOrder;
        var filterArr = this.filterArr;
        var isFirst = this.isFirst;
        var isSaveDieCoord = this.isSaveDieCoord;
        var coordsArra = this.coordsArra;
        var vectorMap = this.vectorMap;
        //计算行列坐标平均值
        for (var i = this.maxRow; i >= this.minRow; i--) {
            for (var j = this.maxCol; j >= this.minCol; j--) {
                var key = j + ":" + i;
                if (this.coordsArray.containsKey(key)) {
                    if (j > x_Max)
                        x_Max = j;
                    if (j < x_Min)
                        x_Min = j;
                    if (i > y_Max)
                        y_Max = i;
                    if (i < y_Min)
                        y_Min = i;
                    if(y_Min == y_Max)
                    	y_Min = y_Min-1;
                    if(x_Max == x_Min)
                    	x_Min = x_Min-1;
                }
            }
        }
        var xmean = (x_Max + x_Min) / 2;
        var ymean = (y_Max + y_Min) / 2;
        dieYZoom = dieXZoom * (x_Max - x_Min) / (y_Max - y_Min);
        //计算绘制die需要的圆的半径
        var rc = 0;
        var ri = 0;
        for (var i = this.maxRow; i >= this.minRow; i--) {
            for (var j = this.maxCol; j >= this.minCol; j--) {
                var key = j + ":" + i;
                if (this.coordsArray.containsKey(key)) {
                    ri = Math.sqrt(Math.pow((Math.abs(j - xmean) + 0.5) * dieXZoom, 2) + Math.pow((Math.abs(i - ymean) + 0.5) * dieYZoom, 2));
                    if (rc < ri)
                        rc = ri;
                }
            }
        }
        dieXZoom = 0.995 * dieXZoom * realr / rc;
        dieYZoom = 0.995 * dieYZoom * realr / rc;
        //计算圆弧的角度
        var a = Math.floor(180 * Math.asin(this.FlatLength / (2 * this.r0)) / Math.PI);
        var startArc = ((90 + a) * Math.PI) / 180;
        var endArc = ((90 - a) * Math.PI) / 180;
        ctx.fillStyle = bgFillColor;
        ctx.beginPath();
        if (startArc == endArc) {
            ctx.arc(this.centerX, this.centerY, this.r, 0, 2 * Math.PI);
        } else {
            ctx.arc(this.centerX, this.centerY, this.r, startArc, endArc);
        }
        ctx.closePath();
        ctx.fill();
        var x1, x2, x3, x4, y1, y2, y3, y4, z1, z2, z3, z4;
        var area = this.r * this.r;
        var dieCount = 0;
        if (this.positionFlag == 'nullnull') {
            for (var i = this.maxRow; i >= this.minRow; i--) {
                var y = this.centerY + i * dieYZoom - dieYZoom;
                for (var j = this.maxCol; j >= this.minCol; j--) {
                    var key = j + ":" + i;
                    var x = this.centerX - j * dieXZoom;
                    if (this.coordsArray.containsKey(key)) {
                        dieCount++; ///
                        var bin = this.coordsArray.getValue(key);
                        var Die = new Object(); ///
                        var rect = new Object(); ///
                        /*普通分布于色阶分布*/
                        if(colorOrder === true){
                            ctx.fillStyle = colorMap.getValue(bin.color); //'#e0bf88';
                            ///
                            if(vectorMap){
                                if(!_.isEmpty(filterArr)){
                                    if(_.indexOf(filterArr, key) > -1 && bin.bin != -1){
                                        Die.filterFlag = "undisabled";
                                    }
                                    else{
                                        ctx.fillStyle="#ccc";   
                                        Die.filterFlag = "disabled";
                                    }
                                }else{
                                    Die.filterFlag = "undisabled";
                                }
                            }
                            ///
                        }else{
                            ctx.fillStyle = colorMap.getValue(bin); //'#e0bf88';
                            ///
                            if(vectorMap){
                                if(!_.isEmpty(filterArr)){
                                    if(_.indexOf(filterArr, key) > -1 && bin != -1){
                                        Die.filterFlag = "undisabled";
                                    }
                                    else{
                                        ctx.fillStyle="#ccc";   
                                        Die.filterFlag = "disabled";
                                    }
                                }
                                else{
                                    Die.filterFlag = "undisabled";
                                }
                            }
                            ///
                        }
                        /*普通分布于色阶分布end*/
                        ctx.fillRect(x, y, dieXZoom, dieYZoom);
                        ctx.lineWidth = 1;
                        ctx.strokeStyle = "black";
                        ctx.strokeRect(x, y, dieXZoom, dieYZoom);
                        ///
                        if(vectorMap){
                            var BBin = bin;
                            if(colorOrder === true){
                                BBin = bin.bin;
                            }
                            if( _.isEmpty(this.currentDieCoord) && isFirst && Die.filterFlag == "undisabled" && BBin != -1  && BBin != 12){ // 第一次加载  
                                mapAddHighLight(ctx,x,y,dieXZoom,dieYZoom);
                                isFirst = false;
                                Die.moveFlag = true;
                                if(isSaveDieCoord === true){
                                    this.saveDieCoord[0] = key;
                                }    
                            }
                            else if( this.currentDieCoord == key){
                                mapAddHighLight(ctx,x,y,dieXZoom,dieYZoom);
                                Die.moveFlag = true;
                            }
                            else{
                                Die.moveFlag = false;
                            }
                            rect.x = x;
                            rect.y = y;
                            rect.width = dieXZoom;
                            rect.height = dieYZoom;
                            Die.Dieno=dieCount;
                            Die.Bin = BBin;
                            Die.rect = rect;
                            coordsArra.add(key, Die);
                        }
                        ///
                    } else {
                        ctx.fillStyle = "#20242b";
                    }
                }
            }
        } else if (this.positionFlag == 'LeftDown') {
            for (var i = this.minRow; i <= this.maxRow; i++) {
                var y = this.centerY - i * dieYZoom + ymean * dieYZoom - 0.5 * dieYZoom;
                for (var j = this.minCol; j <= this.maxCol; j++) {
                    var key = j + ":" + i;
                    var x = this.centerX + j * dieXZoom - xmean * dieXZoom - 0.5 * dieXZoom;
                    if (this.coordsArray.containsKey(key)) {
                        dieCount++; ///
                        var bin = this.coordsArray.getValue(key);
                        var Die = new Object(); ///
                        var rect = new Object(); ///
                        /*普通分布于色阶分布*/
                        if(colorOrder === true){
                            ctx.fillStyle = colorMap.getValue(bin.color); //'#e0bf88';
                            ///
                            if(vectorMap){
                                if(!_.isEmpty(filterArr)){
                                    if(_.indexOf(filterArr, key) > -1 && bin.bin != -1){
                                        Die.filterFlag = "undisabled";
                                    }
                                    else{
                                        ctx.fillStyle="#ccc";   
                                        Die.filterFlag = "disabled";
                                    }
                                }else{
                                    Die.filterFlag = "undisabled";
                                }
                            }
                            ///
                        }else{
                            ctx.fillStyle = colorMap.getValue(bin); //'#e0bf88';
                            ///
                            if(vectorMap){
                                if(!_.isEmpty(filterArr)){
                                    if(_.indexOf(filterArr, key) > -1 && bin != -1){
                                        Die.filterFlag = "undisabled";
                                    }
                                    else{
                                        ctx.fillStyle="#ccc";   
                                        Die.filterFlag = "disabled";
                                    }
                                }
                                else{
                                    Die.filterFlag = "undisabled";
                                }
                            }
                            ///
                        }
                        /*普通分布于色阶分布end*/
                        ctx.fillRect(x, y, dieXZoom, dieYZoom);
                        ctx.lineWidth = 1;
                        ctx.strokeStyle = "black";
                        ctx.strokeRect(x, y, dieXZoom, dieYZoom);
                        ///
                        if(vectorMap){
                            var BBin = bin;
                            if(colorOrder === true){
                                BBin = bin.bin;
                            }
                            if( _.isEmpty(this.currentDieCoord) && isFirst && Die.filterFlag == "undisabled" && BBin != -1  && BBin != 12){ // 第一次加载  
                                mapAddHighLight(ctx,x,y,dieXZoom,dieYZoom);
                                isFirst = false;
                                Die.moveFlag = true;
                                if(isSaveDieCoord === true){
                                    this.saveDieCoord[0] = key;
                                }                   
                            }
                            else if( this.currentDieCoord == key){
                                mapAddHighLight(ctx,x,y,dieXZoom,dieYZoom);
                                Die.moveFlag = true;
                            }
                            else{
                                Die.moveFlag = false;
                            }
                            rect.x = x;
                            rect.y = y;
                            rect.width = dieXZoom;
                            rect.height = dieYZoom;
                            Die.Dieno=dieCount;
                            Die.Bin = BBin;
                            Die.rect = rect;
                            coordsArra.add(key, Die);
                        }
                        ///
                    } else {
                        ctx.fillStyle = "#20242b";
                    }
                }
            }
        } else if (this.positionFlag == 'RightDown') {
            for (var i = this.maxRow; i >= this.minRow; i--) {
                var y = this.centerY - i * dieYZoom + ymean * dieYZoom - 0.5 * dieYZoom;
                for (var j = this.maxCol; j >= this.minCol; j--) {
                    var key = j + ":" + i;
                    var x = this.centerX - j * dieXZoom + xmean * dieXZoom - 0.5 * dieXZoom;
                    if (this.coordsArray.containsKey(key)) {
                        dieCount++; ///
                        var bin = this.coordsArray.getValue(key);
                        var Die = new Object(); ///
                        var rect = new Object(); ///
                        /*普通分布于色阶分布*/
                        if(colorOrder === true){
                            /*if(_.isNil(colorMap.getValue(bin.color)) || _.isEmpty(colorMap.getValue(bin.color))){
                                console.log(key)
                                console.log(bin)
                            }*/
                            ctx.fillStyle = colorMap.getValue(bin.color); //'#e0bf88';
                            ///
                            if(vectorMap){
                                if(!_.isEmpty(filterArr)){
                                    if(_.indexOf(filterArr, key) > -1 && bin.bin != -1){
                                        Die.filterFlag = "undisabled";
                                    }
                                    else{
                                        ctx.fillStyle="#ccc";   
                                        Die.filterFlag = "disabled";
                                    }
                                }else{
                                    Die.filterFlag = "undisabled";
                                }
                            }
                            ///
                        }else{
                            ctx.fillStyle = colorMap.getValue(bin); //'#e0bf88';
                            ///
                            if(vectorMap){
                                if(!_.isEmpty(filterArr)){
                                    if(_.indexOf(filterArr, key) > -1 && bin != -1){
                                        Die.filterFlag = "undisabled";
                                    }
                                    else{
                                        ctx.fillStyle="#ccc";   
                                        Die.filterFlag = "disabled";
                                    }
                                }
                                else{
                                    Die.filterFlag = "undisabled";
                                }
                            }
                            ///
                        }
                        /*普通分布于色阶分布end*/
                        
                        ctx.fillRect(x, y, dieXZoom, dieYZoom);
                        ctx.lineWidth = 1;
                        ctx.strokeStyle = "black";
                        ctx.strokeRect(x, y, dieXZoom, dieYZoom);
                        ///
                        if(vectorMap){
                            var BBin = bin;
                            if(colorOrder === true){
                                BBin = bin.bin;
                            }
                            if( _.isEmpty(this.currentDieCoord) && isFirst && Die.filterFlag == "undisabled" && BBin != -1  && BBin != 12){ // 第一次加载  
                                mapAddHighLight(ctx,x,y,dieXZoom,dieYZoom);
                                isFirst = false;
                                Die.moveFlag = true;
                                if(isSaveDieCoord === true){
                                    this.saveDieCoord[0] = key;
                                }                    
                            }
                            else if( this.currentDieCoord == key){
                                mapAddHighLight(ctx,x,y,dieXZoom,dieYZoom);
                                Die.moveFlag = true;
                            }
                            else{
                                Die.moveFlag = false;
                            }
                            rect.x = x;
                            rect.y = y;
                            rect.width = dieXZoom;
                            rect.height = dieYZoom;
                            Die.Dieno=dieCount;
                            Die.Bin = BBin;
                            Die.rect = rect;
                            coordsArra.add(key, Die);
                        }
                        ///
                    } else {
                        ctx.fillStyle = "#20242b";
                    }
                }
            }
        } else if (this.positionFlag == 'RightTop') {
            for (var i = this.minRow; i <= this.maxRow; i++) {
                var y = this.centerY + i * dieYZoom - ymean * dieYZoom - 0.5 * dieYZoom;
                for (var j = this.maxCol; j >= this.minCol; j--) {
                    var key = j + ":" + i;
                    var x = this.centerX - j * dieXZoom + xmean * dieXZoom - 0.5 * dieXZoom;
                    if (this.coordsArray.containsKey(key)) {
                        dieCount++; ///
                        var bin = this.coordsArray.getValue(key);
                        var Die = new Object(); ///
                        var rect = new Object(); ///
                        /*普通分布于色阶分布*/
                        if(colorOrder === true){
                            ctx.fillStyle = colorMap.getValue(bin.color); //'#e0bf88';
                            ///
                            if(vectorMap){
                                if(!_.isEmpty(filterArr)){
                                    if(_.indexOf(filterArr, key) > -1 && bin.bin != -1){
                                        Die.filterFlag = "undisabled";
                                    }
                                    else{
                                        ctx.fillStyle="#ccc";   
                                        Die.filterFlag = "disabled";
                                    }
                                }else{
                                    Die.filterFlag = "undisabled";
                                }
                            }
                            ///
                        }else{
                            ctx.fillStyle = colorMap.getValue(bin); //'#e0bf88';
                            ///
                            if(vectorMap){
                                if(!_.isEmpty(filterArr)){
                                    if(_.indexOf(filterArr, key) > -1 && bin != -1){
                                        Die.filterFlag = "undisabled";
                                    }
                                    else{
                                        ctx.fillStyle="#ccc";   
                                        Die.filterFlag = "disabled";
                                    }
                                }
                                else{
                                    Die.filterFlag = "undisabled";
                                }
                            }
                            ///
                        }
                        /*普通分布于色阶分布end*/
                        ctx.fillRect(x, y, dieXZoom, dieYZoom);
                        ctx.lineWidth = 1;
                        ctx.strokeStyle = "black";
                        ctx.strokeRect(x, y, dieXZoom, dieYZoom);
                        ///
                        if(vectorMap){
                            var BBin = bin;
                            if(colorOrder === true){
                                BBin = bin.bin;
                            }
                            if( _.isEmpty(this.currentDieCoord) && isFirst && Die.filterFlag == "undisabled" && BBin != -1  && BBin != 12){ // 第一次加载  
                                mapAddHighLight(ctx,x,y,dieXZoom,dieYZoom);
                                isFirst = false;
                                Die.moveFlag = true;
                                if(isSaveDieCoord === true){
                                    this.saveDieCoord[0] = key;
                                }                    
                            }
                            else if( this.currentDieCoord == key){
                                mapAddHighLight(ctx,x,y,dieXZoom,dieYZoom);
                                Die.moveFlag = true;
                            }
                            else{
                                Die.moveFlag = false;
                            }
                            rect.x = x;
                            rect.y = y;
                            rect.width = dieXZoom;
                            rect.height = dieYZoom;
                            Die.Dieno=dieCount;
                            Die.Bin = BBin;
                            Die.rect = rect;
                            coordsArra.add(key, Die);
                        }
                        ///
                    } else {
                        ctx.fillStyle = "#20242b";
                    }
                }
            }

        } else if (this.positionFlag == 'LeftTop') {
            for (var i = this.minRow; i <= this.maxRow; i++) {
                var y = this.centerY + i * dieYZoom - ymean * dieYZoom - 0.5 * dieYZoom;
                for (var j = this.minCol; j <= this.maxCol; j++) {
                    var key = j + ":" + i;
                    var x = this.centerX + j * dieXZoom - xmean * dieXZoom - 0.5 * dieXZoom;
                    if (this.coordsArray.containsKey(key)) {
                        dieCount++; ///
                        var bin = this.coordsArray.getValue(key);
                        var Die = new Object(); ///
                        var rect = new Object(); ///
                        /*普通分布于色阶分布*/
                        if(colorOrder === true){
                            ctx.fillStyle = colorMap.getValue(bin.color); //'#e0bf88';
                            ///
                            if(vectorMap){
                                if(!_.isEmpty(filterArr)){
                                    if(_.indexOf(filterArr, key) > -1 && bin.bin != -1){
                                        Die.filterFlag = "undisabled";
                                    }
                                    else{
                                        ctx.fillStyle="#ccc";   
                                        Die.filterFlag = "disabled";
                                    }
                                }else{
                                    Die.filterFlag = "undisabled";
                                }
                            }
                            ///
                        }else{
                            ctx.fillStyle = colorMap.getValue(bin); //'#e0bf88';
                            ///
                            if(vectorMap){
                                if(!_.isEmpty(filterArr)){
                                    if(_.indexOf(filterArr, key) > -1 && bin != -1){
                                        // 过滤只针对当前器件类型  bin12是其他器件类型的 暂时不考虑
                                        Die.filterFlag = "undisabled";
                                    }
                                    else{
                                        ctx.fillStyle="#ccc";   
                                        Die.filterFlag = "disabled";
                                    }
                                }
                                else{
                                    Die.filterFlag = "undisabled";
                                }
                            }
                            ///
                        }
                        /*普通分布于色阶分布end*/
                        ctx.fillRect(x, y, dieXZoom, dieYZoom);
                        ctx.lineWidth = 1;
                        ctx.strokeStyle = "black";
                        ctx.strokeRect(x, y, dieXZoom, dieYZoom);
                        ///
                        if(vectorMap){
                            var BBin = bin;
                            if(colorOrder === true){
                                BBin = bin.bin;
                            }
                            if( _.isEmpty(this.currentDieCoord) && isFirst && Die.filterFlag == "undisabled" && BBin != -1  && BBin != 12){ // 第一次加载  
                                mapAddHighLight(ctx,x,y,dieXZoom,dieYZoom);
                                isFirst = false;
                                Die.moveFlag = true; 
                                if(isSaveDieCoord === true){
                                    this.saveDieCoord[0] = key;
                                }                   
                            }
                            else if( this.currentDieCoord == key){
                                mapAddHighLight(ctx,x,y,dieXZoom,dieYZoom);
                                Die.moveFlag = true;
                            }
                            else{
                                Die.moveFlag = false;
                            }
                            rect.x = x;
                            rect.y = y;
                            rect.width = dieXZoom;
                            rect.height = dieYZoom;
                            Die.Dieno=dieCount;
                            Die.Bin = BBin;
                            Die.rect = rect;
                            coordsArra.add(key, Die);
                        }
                        ///
                    } else {
                        ctx.fillStyle = "#20242b";
                    }
                }
            }
        }
    };
}

function renderWaferMapByGetData(obj){
	//晶圆图
	var can = document.getElementById(obj.container);
	var ctx = can.getContext('2d');
	can.width = obj.width;  
	can.height = obj.height;
    var newWaferMap = new WaferMapPlotObj({
        /*颜色数据*/
        colorMap: obj.colorMap,
        bgFillColor: obj.bgFillColor,
        /*canvas容器*/
        ctx: ctx,
        r0: parseFloat(obj.waferData.Diameter || obj.waferData.diameter), //真实晶圆半径
        r: (obj.width) / 2 - (obj.spacePercent.x * obj.width), //根据分辨率计算的晶圆半径   减去圆两边空白
        centerX: (obj.width) / 2,
        centerY: (obj.width) / 2 - (obj.spacePercent.x * obj.width) + (obj.spacePercent.y * obj.height),
        dieX: parseFloat(obj.waferData.DieSizeX || obj.waferData.dieSizeX),
        dieY: parseFloat(obj.waferData.DieSizeY || obj.waferData.dieSizeY),
        minRow: parseFloat(obj.waferData.minY),
        maxRow: parseFloat(obj.waferData.maxY),
        minCol: parseFloat(obj.waferData.minX),
        maxCol: parseFloat(obj.waferData.maxX),
        coordsArray: changeHash(obj.m_DieDataListNew), // 晶圆数据
        positionFlag: ((obj.waferData.DirectionX || obj.waferData.directionX) + (obj.waferData.DirectionY || obj.waferData.directionY)),
        FlatLength: parseFloat(obj.waferData.FlatLength || obj.waferData.flagLength),
        /*色阶图标志*/
        colorOrder: obj.colorOrder,
        /*过滤后的数组*/
        filterArr: obj.filterArr,
        /*当前die坐标，显示框框*/
        currentDieCoord: obj.currentDieCoord,
        /*第一次加载标志 第一个高亮*/
        isFirst: obj.isFirst,
        /*是否保存第一个高亮die坐标标志*/
        isSaveDieCoord: obj.isSaveDieCoord,
        /*要保存第一个高亮die坐标的对象*/
        saveDieCoord: obj.saveDieCoord,
        /*矢量图悬浮、点击事件用到的坐标数组*/
        coordsArra: obj.coordsArra,
        /*矢量图标志*/
        vectorMap: obj.vectorMap,
        /*容器*/
        container: obj.container
    });
    newWaferMap.plot();
    if(obj.addEvent){
        $(can).off("mousemove click");
        $(can).on({
            mousemove: function(e){
                e.stopPropagation();
                // console.log(obj.coordsArra.getValues())
                obj.curSelectedDie = null;
                var p = eouluGlobal.S_getEventPosition(e);
                // debugger;
                for (var i = obj.waferData.maxY; i >= obj.waferData.minY; i--) {
                    for (var j = obj.waferData.maxX; j >= obj.waferData.minX; j--) {
                        var key = j + ":" + i;
                        if (obj.coordsArra.containsKey(key)) {
                            var die = obj.coordsArra.getValue(key);
                            if (IsInnerRect(die.rect, p)) {
                                obj.curSelectedDie = _.cloneDeep(die);
                                obj.curSelectedDie.x = j;
                                obj.curSelectedDie.y = i;
                                break;
                            }
                        }
                    }
                    if (obj.curSelectedDie != null) break;
                }
                if (obj.curSelectedDie !== null) {
                    $("html, body").css("cursor", "pointer");
                    $('#in').fadeIn(100);
                    $('#in').html('<ul style="list-style:none;"><li>DIE信息</li><li>Coord: (' + obj.curSelectedDie.x + ":" + obj.curSelectedDie.y + ')</li><li>Bin:' + obj.curSelectedDie.Bin + '</li>');
                    $('#in').css({
                        'left': p.x + 10 + 'px',
                        'top': p.y + 10 + 'px',
                        'color': '#000',
                        'background': '#fff',
                        'padding': '5px'
                    });
                }else{
                    $('#in').fadeOut(100);
                    $("html,body").css("cursor","default");
                }
            },
            click: function(e) {
                e.stopPropagation();
                obj.curSelectedDie = null;
                var p = eouluGlobal.S_getEventPosition(e);
                for (var i = obj.waferData.maxY; i >= obj.waferData.minY; i--) {
                    for (var j = obj.waferData.minX; j <= obj.waferData.maxX; j++) {
                        var key = j + ":" + i;
                        if (obj.coordsArra.containsKey(key)) {
                            var die = obj.coordsArra.getValue(key);
                            if (IsInnerRect(die.rect, p)) {
                                obj.curSelectedDie = _.cloneDeep(die);
                                obj.curSelectedDie.x = j;
                                obj.curSelectedDie.y = i;
                                break;
                            }
                        }
                    }
                    if (obj.curSelectedDie != null)
                        break;
                }
                if (obj.curSelectedDie != null) {
                    //  console.log(obj.curSelectedDie.filterFlag )
                    if (obj.curSelectedDie.filterFlag != "disabled" && obj.curSelectedDie.Bin != -1 && obj.curSelectedDie.Bin != 12) {
                        if (obj.curSelectedDie.Dieno != '-1') {
                            var DieX = obj.curSelectedDie.x;
                            var DieY = obj.curSelectedDie.y;
                            var currentDieCoord = (DieX + ":" + DieY);
                            newWaferMap.setPlotParam({
                                currentDieCoord: currentDieCoord
                            }).plot();
                            obj.clickCallback && obj.clickCallback(currentDieCoord);
                        }
                    }
                }
            }
        });
        $(document).off("keydown");
        $(document).on("keydown", function(e){
            e.stopPropagation();
            var code = e.keyCode || e.which || e.charCode;
            var currentDie_x = "";
            var currentDie_y = "";
            for (var i = parseFloat(obj.waferData.maxY); i >= parseFloat(obj.waferData.minY); i--) {
                for (var j = parseFloat(obj.waferData.minX); j <= parseFloat(obj.waferData.maxX); j++) {
                    var key = j + ":" + i;
                    if (obj.coordsArra.containsKey(key)) {
                        var die = obj.coordsArra.getValue(key);
                        if (die.moveFlag) {
                            currentDie_x = j;
                            currentDie_y = i;
                            break;
                        }
                    }
                }
            }
            var positionFlag = (obj.waferData.DirectionX + obj.waferData.DirectionY);
            var Die_x = currentDie_x;
            var Die_y = currentDie_y;
            var len = obj.coordsArra.getKeys().length;
            var codeMap = {
                37: {
                    "vari": "x",
                    "Left": "-",
                    "Right": "+"
                },
                38: {
                    "vari": "y",
                    "Top": "-",
                    "Down": "+"
                },
                39: {
                    "vari": "x",
                    "Left": "+",
                    "Right": "-"
                },
                40: {
                    "vari": "y",
                    "Top": "+",
                    "Down": "-"
                }
            };
            var codeItem = _.find(codeMap, function(v, k){
                return k == code;
            });
            if(_.isNil(codeItem)) return false;
            for (var i = 1; i < len; i++) {
                var a = ("Die_"+codeItem["vari"]);
                var b = ("currentDie_"+codeItem["vari"]);
                var c = codeItem[eval("obj.waferData.Direction"+codeItem["vari"].toUpperCase())] || codeItem[eval("obj.waferData.direction"+codeItem["vari"].toUpperCase())];
                console.log(a)
                console.log(b)
                console.log(c)
                // a = b + c + i;
                var ee = a+ " = " + b + c + "i";
                // console.log(ee)
                eval(ee);
                var newkey = Die_x + ":" + Die_y;
                if (obj.coordsArra.containsKey(newkey)) {
                    if (obj.coordsArra.getValue(newkey).Bin == -1 || obj.coordsArra.getValue(newkey).Bin == 12 || obj.coordsArra.getValue(newkey).filterFlag == "disabled") { //遇到bin值为-1或12或者disabled的die跳过
                        continue;
                    } else {
                        break;
                    }
                }
            }
            /*if (positionFlag == "LeftDown") {
                switch (code) {
                    case 37:
                        for (var i = 1; i < len; i++) {
                            Die_x = currentDie_x - i;
                            var newkey = Die_x + ":" + Die_y;
                            if (obj.coordsArra.containsKey(newkey)) {
                                if (obj.coordsArra.getValue(newkey).Bin == -1 || obj.coordsArra.getValue(newkey).Bin == 12) { //遇到bin值为-1或12的die跳过
                                    continue;
                                } else {
                                    break;
                                }
                            }
                        }
                        break;
                    case 38:
                        for (var i = 1; i < len; i++) {
                            Die_y = currentDie_y + i;
                            var newkey = Die_x + ":" + Die_y;
                            if (obj.coordsArra.containsKey(newkey)) {
                                if (obj.coordsArra.getValue(newkey).Bin == -1 || obj.coordsArra.getValue(newkey).Bin == 12) { //遇到bin值为-1或12的die跳过
                                    continue;
                                } else {
                                    break;
                                }
                            }
                        }
                        break;
                    case 39:
                        for (var i = 1; i < len; i++) {
                            Die_x = currentDie_x + i;
                            var newkey = Die_x + ":" + Die_y;
                            if (obj.coordsArra.containsKey(newkey)) {
                                if (obj.coordsArra.getValue(newkey).Bin == -1 || obj.coordsArra.getValue(newkey).Bin == 12) { //遇到bin值为-1或12的die跳过
                                    continue;
                                } else {
                                    break;
                                }
                            }
                        }
                        break;
                    case 40:
                        for (var i = 1; i < len; i++) {
                            Die_y = currentDie_y - i;
                            var newkey = Die_x + ":" + Die_y;
                            if (obj.coordsArra.containsKey(newkey)) {
                                if (obj.coordsArra.getValue(newkey).Bin == -1 || obj.coordsArra.getValue(newkey).Bin == 12) { //遇到bin值为-1或12的die跳过
                                    continue;
                                } else {
                                    break;
                                }
                            }
                        }
                        break;
                }
            } else if (positionFlag == "RightDown") {
                switch (code) {
                    case 37:
                        for (var i = 1; i < len; i++) {
                            Die_x = currentDie_x + i;
                            var newkey = Die_x + ":" + Die_y;
                            if (obj.coordsArra.containsKey(newkey)) {
                                if (obj.coordsArra.getValue(newkey).Bin == -1 || obj.coordsArra.getValue(newkey).Bin == 12) { //遇到bin值为-1或12的die跳过
                                    continue;
                                } else {
                                    break;
                                }
                            }
                        }
                        break;
                    case 38:
                        for (var i = 1; i < len; i++) {
                            Die_y = currentDie_y + i;
                            var newkey = Die_x + ":" + Die_y;
                            if (obj.coordsArra.containsKey(newkey)) {
                                if (obj.coordsArra.getValue(newkey).Bin == -1 || obj.coordsArra.getValue(newkey).Bin == 12) { //遇到bin值为-1或12的die跳过
                                    continue;
                                } else {
                                    break;
                                }
                            }
                        }
                        break;
                    case 39:
                        for (var i = 1; i < len; i++) {
                            Die_x = currentDie_x - i;
                            var newkey = Die_x + ":" + Die_y;
                            if (obj.coordsArra.containsKey(newkey)) {
                                if (obj.coordsArra.getValue(newkey).Bin == -1 || obj.coordsArra.getValue(newkey).Bin == 12) { //遇到bin值为-1或12的die跳过
                                    continue;
                                } else {
                                    break;
                                }
                            }
                        }
                        break;
                    case 40:
                        for (var i = 1; i < len; i++) {
                            Die_y = currentDie_y - i;
                            var newkey = Die_x + ":" + Die_y;
                            if (obj.coordsArra.containsKey(newkey)) {
                                if (obj.coordsArra.getValue(newkey).Bin == -1 || obj.coordsArra.getValue(newkey).Bin == 12) { //遇到bin值为-1或12的die跳过
                                    continue;
                                } else {
                                    break;
                                }
                            }
                        }
                        break;
                }
            } else if (positionFlag == "LeftTop") {
                switch (code) {
                    case 37:
                        for (var i = 1; i < len; i++) {
                            Die_x = currentDie_x - i;
                            var newkey = Die_x + ":" + Die_y;
                            if (obj.coordsArra.containsKey(newkey)) {
                                if (obj.coordsArra.getValue(newkey).Bin == -1 || obj.coordsArra.getValue(newkey).Bin == 12) { //遇到bin值为-1或12的die跳过
                                    continue;
                                } else {
                                    break;
                                }
                            }
                        }
                        break;
                    case 38:
                        for (var i = 1; i < len; i++) {
                            Die_y = currentDie_y - i;
                            var newkey = Die_x + ":" + Die_y;
                            if (obj.coordsArra.containsKey(newkey)) {
                                if (obj.coordsArra.getValue(newkey).Bin == -1 || obj.coordsArra.getValue(newkey).Bin == 12) { //遇到bin值为-1或12的die跳过
                                    continue;
                                } else {
                                    break;
                                }
                            }
                        }
                        break;
                    case 39:
                        for (var i = 1; i < len; i++) {
                            Die_x = currentDie_x + i;
                            var newkey = Die_x + ":" + Die_y;
                            if (obj.coordsArra.containsKey(newkey)) {
                                if (obj.coordsArra.getValue(newkey).Bin == -1 || obj.coordsArra.getValue(newkey).Bin == 12) { //遇到bin值为-1或12的die跳过
                                    continue;
                                } else {
                                    break;
                                }
                            }
                        }
                        break;
                    case 40:
                        for (var i = 1; i < len; i++) {
                            Die_y = currentDie_y + i;
                            var newkey = Die_x + ":" + Die_y;
                            if (obj.coordsArra.containsKey(newkey)) {
                                if (obj.coordsArra.getValue(newkey).Bin == -1 || obj.coordsArra.getValue(newkey).Bin == 12) { //遇到bin值为-1或12的die跳过
                                    continue;
                                } else {
                                    break;
                                }
                            }
                        }
                        break;
                }
            } else if (positionFlag == "RightTop") {
                switch (code) {
                    case 37:
                        for (var i = 1; i < len; i++) {
                            Die_x = currentDie_x + i;
                            var newkey = Die_x + ":" + Die_y;
                            if (obj.coordsArra.containsKey(newkey)) {
                                if (obj.coordsArra.getValue(newkey).Bin == -1 || obj.coordsArra.getValue(newkey).Bin == 12) { //遇到bin值为-1或12的die跳过
                                    continue;
                                } else {
                                    break;
                                }
                            }
                        }
                        break;
                    case 38:
                        for (var i = 1; i < len; i++) {
                            Die_y = currentDie_y - i;
                            var newkey = Die_x + ":" + Die_y;
                            if (obj.coordsArra.containsKey(newkey)) {
                                if (obj.coordsArra.getValue(newkey).Bin == -1 || obj.coordsArra.getValue(newkey).Bin == 12) { //遇到bin值为-1或12的die跳过
                                    continue;
                                } else {
                                    break;
                                }
                            }
                        }
                        break;
                    case 39:
                        for (var i = 1; i < len; i++) {
                            Die_x = currentDie_x - i;
                            var newkey = Die_x + ":" + Die_y;
                            if (obj.coordsArra.containsKey(newkey)) {
                                if (obj.coordsArra.getValue(newkey).Bin == -1 || obj.coordsArra.getValue(newkey).Bin == 12) { //遇到bin值为-1或12的die跳过
                                    continue;
                                } else {
                                    break;
                                }
                            }
                        }
                        break;
                    case 40:
                        for (var i = 1; i < len; i++) {
                            Die_y = currentDie_y + i;
                            var newkey = Die_x + ":" + Die_y;
                            if (obj.coordsArra.containsKey(newkey)) {
                                if (obj.coordsArra.getValue(newkey).Bin == -1 || obj.coordsArra.getValue(newkey).Bin == 12) { //遇到bin值为-1或12的die跳过
                                    continue;
                                } else {
                                    break;
                                }
                            }
                        }
                        break;
                }
            }*/
            if (_.indexOf([37, 38, 39, 40], code) > -1) {
                var newkey2 = Die_x + ":" + Die_y;
                // console.log("newkey2", newkey2)
                // console.log("obj.coordsArra.getValues()", obj.coordsArra.getValues())
                // console.log("obj.coordsArra.getKeys()", obj.coordsArra.getKeys())
                if (obj.coordsArra.containsKey(newkey2)) {
                    newWaferMap.setPlotParam({
                        currentDieCoord: newkey2
                    }).plot();
                    obj.keydownCallback && obj.keydownCallback(newkey2);
                }
            }
        });
    }
    if(obj.returnFlag){
        return newWaferMap;
    }
}

/**
 * 根据值获取线性渐变颜色
 * @param  {String} start 起始颜色
 * @param  {String} end   结束颜色
 * @param  {Number} max   最多分成多少分
 * @param  {Number} val   渐变取值
 * @return {String}       颜色
 */
function getGradientColor (start, end, max, val) {
    var rgb = /#((?:[0-9]|[a-fA-F]){2})((?:[0-9]|[a-fA-F]){2})((?:[0-9]|[a-fA-F]){2})/;
    var sM = start.match(rgb);
    var eM = end.match(rgb);
    var err = '';
    max = max || 1
    val = val || 0
    if (sM === null) {
        err = 'start';
    }
    if (eM === null) {
        err = 'end';
    }
    if (err.length > 0) {
        throw new Error('Invalid ' + err + ' color format, required hex color'); 
    }
    var sR = parseInt(sM[1], 16),
        sG = parseInt(sM[2], 16),
        sB = parseInt(sM[3], 16);
    var eR = parseInt(eM[1], 16),
        eG = parseInt(eM[2], 16),
        eB = parseInt(eM[3], 16);
    var p = val / max;
    var gR = Math.round(sR + (eR - sR) * p).toString(16),
        gG = Math.round(sG + (eG - sG) * p).toString(16),
        gB = Math.round(sB + (eB - sB) * p).toString(16);
        gR = eouluGlobal.S_getLastStr("0"+gR, 2);
        gG = eouluGlobal.S_getLastStr("0"+gG, 2);
        gB = eouluGlobal.S_getLastStr("0"+gB, 2);
    return '#' + gR + gG + gB;
}

function buildColorGradation(obj) {
    var colorMap = new HashTable();
    var colorOrder = obj.colorOrder;
    if(colorOrder === true){
        var theMin = obj.theMin;
        var lowwer = obj.lowwer;
        var midder = obj.midder;
        var upper = obj.upper;
        var theMax = obj.theMax;
        var twoDiff = obj.colorGradation.twoDiff;
        var threeDiff = obj.colorGradation.threeDiff;
        var fourDiff = obj.colorGradation.fourDiff;
        var fiveDiff = obj.colorGradation.fiveDiff;
        _.times(twoDiff, function(i){
            colorMap.add("2:"+(theMin+i), getGradientColor (obj.colorGradation.lowwerColor, obj.colorGradation.theMinColor, obj.colorGradation.twoDiff, obj.colorGradation.twoDiff-i));
        });
        _.times(threeDiff, function(i){
            colorMap.add("3:"+(lowwer+i), getGradientColor (obj.colorGradation.midderColor, obj.colorGradation.lowwerColor, obj.colorGradation.threeDiff, obj.colorGradation.threeDiff-i));
        });
        _.times(fourDiff, function(i){
            colorMap.add("4:"+(midder+i), getGradientColor (obj.colorGradation.upperColor, obj.colorGradation.midderColor, obj.colorGradation.fourDiff, obj.colorGradation.fourDiff-i));
        });
        _.times(fiveDiff, function(i){
            colorMap.add("5:"+(upper+i), getGradientColor (obj.colorGradation.theMaxColor, obj.colorGradation.upperColor, obj.colorGradation.fiveDiff, obj.colorGradation.fiveDiff-i));
        });
        colorMap.add("1:"+theMin, obj.colorGradation.theMinColor);
        colorMap.add("6:"+theMax, obj.colorGradation.theMaxColor);
        _.forOwn(obj.otherColor, function(v, k){
            colorMap.add(k, v);
        });
    }else{
        colorMap.add(-123456, obj.colorGradation.limitColor); //低于下限，也是不合格数据
        colorMap.add(123456, obj.colorGradation.limitColor); //超出上限，也是不合格数据
        _.times(256, function(i){
            if(i > 0){
                colorMap.add(i, getGradientColor (obj.colorGradation.limitColor, obj.colorGradation.floorColor, obj.colorGradation.nums, obj.colorGradation.nums-i));
            }
        });
        colorMap.add(-1,"#314067");
        colorMap.add(12,"#FFFFFF");
    }
    var width = obj.width;
    var height = obj.height;
    if(obj.custom){
        if(obj.custom.WH === true){
            width = (obj.waferData.maxX - obj.waferData.minX + 1)*50;
            height = (obj.waferData.maxY - obj.waferData.minY + 1)*50;
        }
        if(width > obj.maxWidth || height > obj.maxHeight){
            width = height = _.sortBy([obj.maxHeight, obj.maxWidth])[0]
        }
    }
    var newRenderWaferMap = renderWaferMapByGetData({
        width: width,
        height: height,
        container: obj.container,
        bgFillColor: obj.bgFillColor,
        colorMap: colorMap,
        waferData: obj.waferData,
        spacePercent: obj.spacePercent, // {x: 0.1, y: 0.1}
        m_DieDataListNew: obj.m_DieDataListNew,
        colorOrder: colorOrder,
        filterArr: obj.filterArr,
        currentDieCoord: obj.currentDieCoord,
        isFirst: obj.isFirst,
        isSaveDieCoord: obj.isSaveDieCoord,
        saveDieCoord: obj.saveDieCoord,
        coordsArra: obj.coordsArra,
        returnFlag: obj.returnFlag,
        addEvent: obj.addEvent,
        curSelectedDie: obj.curSelectedDie,
        vectorMap: obj.vectorMap,
        clickCallback: obj.clickCallback,
        keydownCallback: obj.keydownCallback,
    });
    // console.log("obj.m_DieDataListNew", obj.m_DieDataListNew);
    // console.log("colorMap.getKeys", colorMap.getKeys());
    // console.log("colorMap.getValues", colorMap.getValues());
    // console.log("currentDieCoord", obj.currentDieCoord);
    var positionFlag = (obj.waferData.DirectionX || obj.waferData.directionX) + (obj.waferData.DirectionY || obj.waferData.directionY);
    obj.callback && obj.callback(positionFlag, newRenderWaferMap);
    obj.resizeCallback && obj.resizeCallback(width, height, newRenderWaferMap);
    if(obj.returnFlag){
        return newRenderWaferMap;
    }
}