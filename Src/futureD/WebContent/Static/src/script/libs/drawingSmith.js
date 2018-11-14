
// smith图
function smithChart(dom,title,legendName, allData,Type,msgdom, lineColorArray, msgFun, msgInitFun) {

    // 公式是(x-x0)^2 + (y-y0)^2 = r^2
    dom.innerHTML = '';
    dom.innerHTML = '<div class="picName" style="position: absolute;"> </div><div class="value" style="position:absolute;z-index:1"' +
        '></div> <div class="pointValue" style="position:absolute;z-index:1"></div>' +
        '<div class="line1" style="position:absolute;z-index:1"></div> <div class="line2" style="position:absolute;z-index:1"></div>' +
        '<canvas class="canvas" style="position: absolute;"></canvas>' +
        '<div class="legend" style="position: absolute;display:none;"></div>';
    var picName = dom.getElementsByClassName("picName")[0];
    var legend = dom.getElementsByClassName("legend")[0];
    var _title = title;
    var _legend = legendName;
    var _data = allData;
    picName.innerHTML = _title[0];
    picName.style.cssText = "text-align: center;font-size: 20px;font-weight: bold;font-family: 宋体;display:none;";
    var value = dom.getElementsByClassName("value")[0];
    var pointValue = dom.getElementsByClassName("pointValue")[0];
    var line1 = dom.getElementsByClassName("line1")[0];
    var line2 = dom.getElementsByClassName("line2")[0];
    var c = dom.getElementsByClassName('canvas')[0];
    c.setAttribute('width', dom.offsetWidth);
    c.setAttribute('height', dom.offsetHeight);
  //  var titleLength = c.height * 0.08;
    var titleLength = 0;
    var cWidth = c.width;
    var cHeight = c.height;
    var ctx = c.getContext("2d");
    //    smith chart
    function SmithPlotObj(type,  axis, valueType, axisPointer, color) {
        this.type = type;
        this.axis = axis;
        this.valueType = valueType;
        this.axisPointer = axisPointer;
        this.color = color;
    }

    //数据信息
    SmithPlotObj.prototype.type = "SmithPlot";
    SmithPlotObj.prototype.plot = function () {
        var type = this.type;
        var _valueType = this.valueType;
        var _titleLength = titleLength;
        var _axisPointer = this.axisPointer;
        var _color = this.color;
        picName.style.height = titleLength + 'px';
        picName.style.lineHeight = titleLength + 'px';
        picName.style.color = _color[7];
        picName.style.width = c.width + 'px';
        if(cHeight<cWidth){
            legend.style.top = cHeight * 1.1 + 'px';
        }else{
            legend.style.top = cWidth * 1.05+titleLength + 'px';
        }
        var r = [];
        var Radis1 = [];
        var x1 = [];
        var R1 = [];
        var y1, y11;
        var Radis2 = [];
        var y2 = [];
        var R2 = [];
        var x2, x22;
        var Radis3 = [];
        var y3 = [];
        var R3 = [];
        var x3, x33;
        var radis, x0, y0, i, j, k, scale;
        if (type == 'S11' || type == 'S22') {
            r = [0.2, 0.4, 0.8, 1, 1.5, 2, 3, 4, 5, 10, 50];
            y11 = 0;
            for (i = 0; i < r.length; i++) {
                Radis1[i] = 1 / (1 + r[i]);
                x1[i] = r[i] / (1 + r[i]);
            }
            x22 = 1;
            for (j = 0; j < r.length; j++) {
                Radis2[j] = 1 / r[j];
                y2[j] = 1 / r[j];
            }
            x33 = 1;
            for (k = 0; k < r.length; k++) {
                Radis3[k] = -1 / r[k];
                y3[k] = 1 / r[k];
            }
            radis = 1;
            x0 = 0;
            y0 = 0;
            scale = (Math.min(cWidth, cHeight)) / 2;
        } else if (type == 'S12') {
            r = [0.02, 0.04, 0.06, 0.08, 0.1, 0.12, 0.14];
        } else if (type == 'S21') {
            r = [5, 10, 15, 20];
        }
        //                外圆，等电阻圆的最大圆，以该圆圆心为坐标原点
        if (cWidth >cHeight) {
            x0 = (x0 - radis) * scale + 2 * scale + Math.abs(cWidth - cHeight) / 2;
            y0 = (y0 - radis) * scale + 2 * scale;
        } else {
            x0 = (x0 - radis) * scale + 2 * scale;
            y0 = (y0 - radis) * scale + 2 * scale;
        }
        var R0 = radis * scale;
        ctx.beginPath();
        ctx.arc(x0, y0, R0, 0, 2 * Math.PI);
        ctx.strokeStyle = _color[0];
        ctx.stroke();
        ctx.font = "6px";
        ctx.strokeText(radis - 1, x0 - R0, y0);
        ctx.closePath();
//        剪切显示区域
        ctx.beginPath();
        ctx.arc(x0, y0, R0, 0, 2 * Math.PI);
        ctx.strokeStyle = _color[0];
        ctx.stroke();
        ctx.clip();
        ctx.closePath();
        //    等电阻圆
        for (i = 0; i < r.length; i++) {
            if (cWidth> cHeight) {
                x1[i] = (x1[i] - radis) * scale + 2 * scale + Math.abs(cWidth - cHeight) / 2;
                y1 = (y11 - radis) * scale + 2 * scale;
            } else {
                x1[i] = (x1[i] - radis) * scale + 2 * scale;
                y1 = (y11 - radis) * scale + 2 * scale;
            }
            R1[i] = Radis1[i] * scale;
            ctx.beginPath();
            ctx.arc(x1[i], y1, R1[i], 0, 2 * Math.PI);
            ctx.strokeStyle = _color[0];
            ctx.stroke();
            ctx.font = "6px";
            ctx.strokeText(r[i], x1[i] - R1[i], y1);
        }

        //    等电抗圆下半部
        for (j = 0; j < r.length; j++) {
            if (cWidth > cHeight) {
                x2 = (x22 - radis) * scale + 2 * scale + Math.abs(cWidth - cHeight) / 2;
                y2[j] = (Radis2[j] - radis) * scale + 2 * scale;
            } else {
                x2 = (x22 - radis) * scale + 2 * scale;
                y2[j] = (Radis2[j] - radis) * scale + 2 * scale;
            }
            R2[j] = Radis2[j] * scale;
            ctx.beginPath();
            ctx.arc(x2, y2[j], R2[j], 0, 2 * Math.PI);
            ctx.strokeStyle = _color[0];
            ctx.stroke();
//        判断是否有交点
            var t1 = x1[j] - R1[j] + 1 / 5 * scale;
            if (t1 <= x2 - R2[j]) {
                t1 = x2 - R2[j];
            }
            var p1 = -Math.sqrt(R2[j] * R2[j] - (t1 - x2) * (t1 - x2)) + y2[j];
            ctx.font = "6px";
            ctx.strokeText(-r[j], t1, p1);
            ctx.closePath();
        }
        //    等电抗圆上半部
        for (k = 0; k < r.length; k++) {
            if (cWidth > cHeight) {
                x3 = (x33 - radis) * scale + 2 * scale + Math.abs(cWidth - cHeight) / 2;
                y3[k] = (Radis3[k] - radis) * scale + 2 * scale;
            } else {
                x3 = (x33 - radis) * scale + 2 * scale;
                y3[k] = (Radis3[k] - radis) * scale + 2 * scale;
            }
            R3[k] = Math.abs(Radis3[k]) * scale;
            ctx.beginPath();
            ctx.arc(x3, y3[k], R3[k], 0, 2 * Math.PI);
            ctx.strokeStyle = _color[0];
            ctx.stroke();
            //        判断是否有交点
            var t2 = x1[k] - R1[k] + 1 / 5 * scale;
            if (t2 <= x3 - R3[k]) {
                t2 = x3 - R3[k];
            }
            var p2 = Math.sqrt(R3[k] * R3[k] - (t2 - x3) * (t2 - x3)) + y3[k];
            ctx.font = "6px";
            ctx.strokeText(r[k], t2, p2);
            ctx.closePath();
        }
        if (this.axis == true) {
            //横坐标
            ctx.beginPath();
            ctx.moveTo(0, y0);
            ctx.lineTo(cWidth, y0);
            ctx.strokeStyle = _color[1];
            ctx.stroke();
            ctx.closePath();
            //纵坐标
            ctx.beginPath();
            ctx.moveTo(x0, 0);
            ctx.lineTo(x0, cHeight);
            ctx.strokeStyle = _color[1];
            ctx.stroke();
            ctx.closePath();
        }
       // console.log(_data)
//        画数据
        var count = _data.length;
        legend.style.left = cWidth / 2 - 25 * count + 'px';
        if (count > 0) {
            var point = new Array(count);
//            获取数据
            legend.innerHTML='';
            for (var m = 0; m < count; m++) {
                point[m] = new Array(_data[m].length);
                for (var t = 0; t < point[m].length; t++) {
                    var x = x0 + parseFloat(_data[m][t][1]) * scale;
                    var y = y0 - parseFloat(_data[m][t][2]) * scale;
                    point[m][t] = [x, y];
                }
               
                //            连线
                for (var n = 0; n < point[m].length - 1; n++) {
                    ctx.beginPath();
                    ctx.lineWidth = 2;
                    ctx.moveTo(point[m][n][0], point[m][n][1]);
                    ctx.lineTo(point[m][n + 1][0], point[m][n + 1][1]);
                    ctx.strokeStyle = _color[2][m];
                    ctx.stroke();
                    ctx.closePath();
                }
                var legendLine = document.createElement('div');
                legendLine.style.cssText = 'float:left;width:20px;height:2px;margin:10px 5px;';
                legendLine.style.backgroundColor = _color[2][m];
                var legendContent = document.createElement('div');
                legendContent.style.float = 'left';
                legendContent.style.color = _color[6];
                legendContent.innerHTML = _legend[m];
                legend.appendChild(legendLine);
                legend.appendChild(legendContent);
            }
        }

        if (_axisPointer == true) {
            //        -------------------------显示坐标系内所有点坐标-----------------------------
            c.addEventListener('mousemove', function (e, event) {
                // 实现图形自适应时，去除上次加载的残留信息
                line1.style.display = 'none';
                line2.style.display = 'none';
                value.style.display = 'none';
                pointValue.style.display = 'none';
                var p = getEventPosition(e);
                ctx.beginPath();
                ctx.arc(x0, y0, R0, 0, 2 * Math.PI);
                ctx.fillStyle = 'rgba(0, 0, 0, 0)';
                ctx.fill();
                ctx.closePath();
                if (ctx.isPointInPath(p.x, p.y)) {
                    x = (p.x - x0) / scale;
                    y = (y0 - p.y) / scale;
                    line1.style.display = '';
                    line2.style.display = '';
                    value.style.display = '';
                    value.innerHTML = '<div style="height: 20px;margin-top: -25px;margin-left: 10px;">' + x.toFixed(3) + ',' + y.toFixed(3) + '</div>';
                    line1.innerHTML = '<div  style="height: 1px;background-color: rgba(0, 0, 0, 0);' +
                        'border-top: 1px dashed black ;"></div>';
                    line2.innerHTML = '<div  style="width: 1px;background-color: rgba(0, 0, 0, 0);' +
                        'border-left: 1px dashed black ;"></div>';
                    var horizonLine = line1.childNodes[0];
                    var verticalLine = line2.childNodes[0];
                    // 根据点的位置坐标和外圆方程确定十字坐标位置及宽高
                    var width = 2 * Math.sqrt(R0 * R0 - (p.y - y0) * (p.y - y0));
                    var height = 2 * Math.sqrt(R0 * R0 - (p.x - x0) * (p.x - x0));
                    var marginLeft = p.x - (x0 - Math.sqrt(R0 * R0 - (p.y - y0) * (p.y - y0)));
                    var marginTop = p.y - (y0 - Math.sqrt(R0 * R0 - (p.x - x0) * (p.x - x0)));
                    value.style.left = p.x + 'px';
                    value.style.top = (p.y + _titleLength) + 'px';
                    line1.style.left = p.x + 'px';
                    line1.style.top = (p.y + _titleLength) + 'px';
                    line2.style.left = p.x + 'px';
                    line2.style.top = (p.y + _titleLength) + 'px';
                    horizonLine.style.width = width + 'px';
                    verticalLine.style.height = height + 'px';
                    horizonLine.style.marginLeft = -marginLeft + 'px';
                    verticalLine.style.marginTop = -marginTop + 'px';
                    if (_valueType == 'point') {
                        for (var t = 0; t < count; t++) {
                            for (var m = 0; m < point[t].length; m++) {
                                ctx.beginPath();
                                ctx.arc(point[t][m][0], point[t][m][1], 2, 0, 2 * Math.PI);
                                ctx.fillStyle = 'rgba(0, 0, 0, 0)';
                                ctx.fill();
                                ctx.closePath();
                                if (ctx.isPointInPath(p.x, p.y)) {
                                    pointValue.style.display = '';
                                    pointValue.innerHTML = '<div id="drawPoint" style="width: 8px;height:8px;border-radius: 50%;' +
                                        'margin-left: -4px;margin-top: -4px;"></div><div id="valueContent" style="margin: 5px;">' +
                                        '<div style="margin: 2px 5px">x:' + [_data[t][m][1]] + '</div>' +
                                        '<div style="margin: 2px 5px">y:' + [_data[t][m][2]] + '</div></div>';
                                    var drawPoint = document.getElementById('drawPoint');
                                    var valueContent = document.getElementById('valueContent');
                                    drawPoint.style.color = _color[3];
                                    drawPoint.style.backgroundColor = _color[4][t];
                                    valueContent.style.color = _color[3];
                                    valueContent.style.backgroundColor = _color[5];
                                    pointValue.style.left = point[t][m][0] + 'px';
                                    pointValue.style.top = (point[t][m][1] + _titleLength) + 'px';
                                }
                            }
                        }
                    }
                }
            }, false);
        } else {
            //        -------------------------显示曲线上点坐标-----------------------------
            c.addEventListener('mousemove', function (e, event) {
                line1.style.display = 'none';
                line2.style.display = 'none';
                value.style.display = 'none';
                pointValue.style.display = 'none';
                var p = getEventPosition(e);
                //            描点
                for (var t = 0; t < count; t++) {
                    for (var m = 0; m < point[t].length; m++) {
                        ctx.beginPath();
                        ctx.arc(point[t][m][0], point[t][m][1], 2, 0, 2 * Math.PI);
                        ctx.fillStyle = 'rgba(0, 0, 0, 0)';
                        ctx.fill();
                        ctx.closePath();
                        if (ctx.isPointInPath(p.x, p.y)) {
                            if (_valueType == 'point') {
                                pointValue.style.display = '';
                                pointValue.innerHTML = '<div  style="width: 8px;height:8px;border-radius: 50%;' +
                                    'margin-left: -4px;margin-top: -4px;"></div><div  style="margin: 10px;border-radius: 5px;"><div style="margin: 2px 5px">x:' + _data[t][m][1] + '</div>' +
                                    '<div style="margin: 2px 5px">y:' + _data[t][m][2] + '</div></div>';
                                var drawPoint = pointValue.childNodes[0];
                                var valueContent = pointValue.childNodes[1];
                                drawPoint.style.color = _color[3];
                                drawPoint.style.backgroundColor = _color[4][t];
                                valueContent.style.color = _color[3];
                                valueContent.style.backgroundColor = _color[5];
                                pointValue.style.left = point[t][m][0] + 'px';
                                pointValue.style.top = (point[t][m][1] + _titleLength) + 'px';
                            } else if (_valueType == 'cross') {
                                line1.style.display = '';
                                line2.style.display = '';
                                value.style.display = '';
                                value.innerHTML = '<div style="height: 20px;">' + _data[t][m][1] + ',' + _data[t][m][2] + '</div>';
                                line1.innerHTML = '<div   style="height: 1px;background-color: rgba(0, 0, 0, 0);' +
                                    'border-top: 1px dashed black ;"></div>';
                                line2.innerHTML = '<div  style="width: 1px;background-color: rgba(0, 0, 0, 0);' +
                                    'border-left: 1px dashed black ;"></div>';
                                var horizonLine = line1.childNodes[0];
                                var verticalLine = line2.childNodes[0];
                                // 根据点的位置坐标和外圆方程确定十字坐标位置及宽高
                                var width = 2 * Math.sqrt(R0 * R0 - (point[t][m][1] - y0) * (point[t][m][1] - y0));
                                var height = 2 * Math.sqrt(R0 * R0 - (point[t][m][0] - x0) * (point[t][m][0] - x0));
                                var marginLeft = point[t][m][0] - (x0 - Math.sqrt(R0 * R0 - (point[t][m][1] - y0) * (point[t][m][1] - y0)));
                                var marginTop = point[t][m][1] - (y0 - Math.sqrt(R0 * R0 - (point[t][m][0] - x0) * (point[t][m][0] - x0)));
                                value.style.left = point[t][m][0] + 'px';
                                value.style.top = (point[t][m][1] + _titleLength) + 'px';
                                line1.style.left = point[t][m][0] + 'px';
                                line1.style.top = (point[t][m][1] + _titleLength) + 'px';
                                line2.style.left = point[t][m][0] + 'px';
                                line2.style.top = (point[t][m][1] + _titleLength) + 'px';
                                horizonLine.style.width = width + 'px';
                                verticalLine.style.height = height + 'px';
                                horizonLine.style.marginLeft = -marginLeft + 'px';
                                verticalLine.style.marginTop = -marginTop + 'px';
                                //加载点信息
                                if(msgdom && allData.length){
                                    var messag = "("+_data[t][m][1].toFixed(2)+","+_data[t][m][2].toFixed(2)+"),"+(_data[t][m][0]/10E6).toFixed(2)+"GHz";
                                    if(msgFun){
                                        var initMess = "("+_data[t][0][1].toFixed(2)+","+_data[t][0][2].toFixed(2)+"),"+(_data[t][0][0]/10E6).toFixed(2)+"GHz";
                                        msgFun(messag, t, initMess);
                                    }else{
                                        msgdom.getElementsByClassName("Smith_Msg2")[0].innerText = messag;
                                    }
                                }
                            }
                        }
                    }
                }
            }, false);
        }
    };
    if(msgdom && allData.length){
        var messag = "("+_data[0][0][1].toFixed(2)+","+_data[0][0][2].toFixed(2)+"),"+(_data[0][0][0]/10E6).toFixed(2)+"GHz";
        if(msgInitFun){
            msgInitFun(messag);
        }else{
            msgdom.getElementsByClassName("Smith_Msg2")[0].innerText = messag;
        }
    }
    SmithPlotObj.prototype.onresize = function (){
       // window.onresize = function () {
            c.setAttribute('width', dom.offsetWidth);
            c.setAttribute('height', dom.offsetHeight -20);
            cWidth = c.width;
            cHeight = c.height;
            titleLength = 0;
            smith.plot();
        //}
    };
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
    
    
   //显示坐标点类型
    var valueType = 'cross';
    // 顺序依次为圆的颜色，坐标颜色，数据线颜色，数据值字体颜色，数据点颜色，数据框背景颜色,图例字体颜色
    lineColorArray = lineColorArray || ['#1baee1', 'red'];
    var color = ['grey', 'black', lineColorArray, 'white', ['#1baee1', 'red'], 'rgba(128, 128, 128, 0.75)', 'grey','#028BCD'];
    var smith = new SmithPlotObj(Type, false, valueType, false, color);
   // smith.plot();
    smith.onresize(); 
    return smith;
}
