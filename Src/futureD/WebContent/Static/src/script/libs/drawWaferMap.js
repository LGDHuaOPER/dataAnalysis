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
}

if (WaferMapPlotObj.prototype.type == undefined) {
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
                        var bin = this.coordsArray.getValue(key);
                        /*普通分布于色阶分布*/
                        if(colorOrder === true){
                            ctx.fillStyle = colorMap.getValue(bin.color); //'#e0bf88';
                        }else{
                            ctx.fillStyle = colorMap.getValue(bin); //'#e0bf88';
                        }
                        /*普通分布于色阶分布end*/
                        ctx.strokeStyle = "black";
                        ctx.strokeRect(x, y, dieXZoom, dieYZoom);
                        ctx.fillRect(x, y, dieXZoom, dieYZoom);
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
                        var bin = this.coordsArray.getValue(key);
                        ctx.fillStyle = colorMap.getValue(bin); //'#e0bf88';
                        ctx.strokeStyle = "black";
                        ctx.strokeRect(x, y, dieXZoom, dieYZoom);
                        ctx.fillRect(x, y, dieXZoom, dieYZoom);
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
                        var bin = this.coordsArray.getValue(key);
                        /*普通分布于色阶分布*/
                        if(colorOrder === true){
                            ctx.fillStyle = colorMap.getValue(bin.color); //'#e0bf88';
                        }else{
                            ctx.fillStyle = colorMap.getValue(bin); //'#e0bf88';
                        }
                        /*普通分布于色阶分布end*/
                        ctx.strokeStyle = "black";
                        ctx.strokeRect(x, y, dieXZoom, dieYZoom);
                        ctx.fillRect(x, y, dieXZoom, dieYZoom);
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
                        var bin = this.coordsArray.getValue(key);
                        ctx.fillStyle = colorMap.getValue(bin); //'#e0bf88';
                        ctx.strokeStyle = "black";
                        ctx.strokeRect(x, y, dieXZoom, dieYZoom);
                        ctx.fillRect(x, y, dieXZoom, dieYZoom);
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
                        var bin = this.coordsArray.getValue(key);
                        ctx.fillStyle = colorMap.getValue(bin); //'#e0bf88';
                        ctx.strokeStyle = "black";
                        ctx.strokeRect(x, y, dieXZoom, dieYZoom);
                        ctx.fillRect(x, y, dieXZoom, dieYZoom);
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
    (new WaferMapPlotObj({
		colorMap: obj.colorMap,
		bgFillColor: obj.bgFillColor,
		ctx: ctx,
		r0: obj.waferData.Diameter, //真实晶圆半径
		r: (obj.width) / 2 - (obj.spacePercent.x * obj.width), //根据分辨率计算的晶圆半径   减去圆两边空白
		centerX: (obj.width) / 2,
		centerY: (obj.width) / 2 - (obj.spacePercent.x * obj.width) + (obj.spacePercent.y * obj.height),
		dieX: obj.waferData.DieSizeX,
		dieY: obj.waferData.DieSizeY,
		minRow: obj.waferData.minY,
		maxRow: obj.waferData.maxY,
		minCol: obj.waferData.minX,
		maxCol: obj.waferData.maxX,
		coordsArray: changeHash(obj.m_DieDataListNew), // 晶圆数据
		positionFlag: (obj.waferData.DirectionX + obj.waferData.DirectionY),
		FlatLength: obj.waferData.FlatLength,
        colorOrder: obj.colorOrder
    })).plot();
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
        var firstMax = obj.firstMax;
        var firstMin = obj.firstMin;
        var secondMax = obj.secondMax;
        var secondMin = obj.secondMin;
        var firstDiff = firstMax - firstMin;
        var secondDiff = secondMax - secondMin;
        _.times(firstDiff, function(i){
            colorMap.add("1:"+(firstMin+i), getGradientColor (obj.colorGradation.limitColor1, obj.colorGradation.floorColor1, obj.colorGradation.nums1, obj.colorGradation.nums1-i));
        });
        _.times(secondDiff, function(i){
            colorMap.add("255:"+(secondMin+i), getGradientColor (obj.colorGradation.limitColor2, obj.colorGradation.floorColor2, obj.colorGradation.nums2, obj.colorGradation.nums2-i));
        });
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
    }
    renderWaferMapByGetData({
        width: obj.width,
        height: obj.height,
        container: obj.container,
        bgFillColor: obj.bgFillColor,
        colorMap: colorMap,
        waferData: obj.waferData,
        spacePercent: obj.spacePercent, // {x: 0.1, y: 0.1}
        m_DieDataListNew: obj.m_DieDataListNew,
        colorOrder: colorOrder
    });
    console.log("colorMap", colorMap);
}