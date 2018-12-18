/*
*
** 这里开始开发自定义插件
** 自执行函数：
    ** // 写法一
    (function(){})()

    //写法二
    (function(){}())
** js里面()括号就是将代码结构变成表达式，被包在()里面的变成了表达式之后，则就会立即执行，js中将一段代码变成表达式有很多种方式，比如：
    ** void function(){...}();
    // 或者
    !function foo(){...}();
    // 或者
    +function foot(){...}();
*
*/

; // JavaScript 弱语法的特点,如果前面刚好有个函数没有以";"结尾,那么可能会有语法错误
(function(undefined){
    /**"use strict"**/
    var _global;
    // 定义一些默认参数
    var _DefaultParam = {
        // environment: "development",
        environment: "product",
        projectName: "futureD",
        versionNO: "1536897675562",
        browser: null,
        loginHref: "IndexInterface",
        curUserName: null,
        allAuthorityPage: ["HomeInterface"],
        excludeJudgeAuthorityPage: ["HomeInterface"],
        curPageJudgedAuthority: null,
        pageAllConfig: {
            "futureDT2": {
                canUseAjax: false,
                scrollBarWidth: 7
            },
            "colorArray": ["#0000FF", "#0000CD", "#191970", "#00008B", "#000080", "#4169E1", "#6495ED", "#B0C4DE", "#778899", "#708090", "#1E90FF", "#4682B4", "#87CEFA", "#87CEEB", "#00BFFF", "#ADD8E6", "#B0E0E6", "#5F9EA0", "#E1FFFF", "#AFEEEE", "#00FFFF", "#00CED1", "#2F4F4F", "#008B8B", "#008080", "#48D1CC", "#20B2AA", "#7FFFAA", "#00FA9A", "#00FF7F", "#3CB371", "#2E8B57", "#90EE90", "#98FB98", "#8FBC8F", "#32CD32", "#00FF00", "#228B22", "#008000", "#006400", "#7FFF00", "#ADFF2F", "#556B2F", "#F5F5DC", "#FFFFE0", "#FFFF00", "#808000", "#BDB76B", "#EEE8AA", "#F0E68C", "#FFD700", "#FFF8DC", "#DAA520", "#F5DEB3", "#FFE4B5", "#FFA500", "#FFEBCD", "#FFDEAD", "#FAEBD7", "#D2B48C", "#DEB887", "#FFE4C4", "#FF8C00", "#CD853F", "#FFDAB9", "#F4A460", "#D2691E", "#8B4513", "#A0522D", "#FFA07A", "#FF7F50", "#FF4500", "#E9967A", "#FF6347", "#FFE4E1", "#FA8072", "#F08080", "#BC8F8F", "#CD5C5C", "#FF0000", "#A52A2A", "#B22222", "#8B0000", "#800000", "#FFB6C1", "#FFC0CB", "#DC143C", "#DB7093", "#FF69B4", "#FF1493", "#C71585", "#DA70D6", "#D8BFD8", "#DDA0DD", "#EE82EE", "#FF00FF", "#FF00FF", "#8B008B", "#800080", "#BA55D3", "#9400D3", "#9932CC", "#4B0082", "#8A2BE2", "#9370DB", "#7B68EE", "#6A5ACD", "#483D8B"]
        },
        RegExpList: {
            "email": {
                "ODQ": /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/,
                "newRegExp": "^([a-zA-Z0-9]+[_|\\_|\\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\\_|\\.]?)*[a-zA-Z0-9]+\\.[a-zA-Z]{2,3}$",
                "g": false,
                "i": false,
                "success": true
            },
            "mobile": {
                "ODQ": /^1[34578]\d{9}$/,
                "newRegExp": "^1[34578]\\d{9}$",
                "g": false,
                "i": false,
                "success": true
            },
            "telephone": {
                "ODQ": /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/,
                "newRegExp": "^(\\(\\d{3,4}\\)|\\d{3,4}-|\\s)?\\d{7,14}$",
                "g": false,
                "i": false,
                "success": true
            }
        },
        futureDT2SysAuthority: [{
            "pageName": "数据列表",
            "weight": 1,
            "pageUrl": "DataList",
            "authority": [{
                "name": "数据列表",
                "value": 7,
                "url": "DataList"
            }, {
                "name": "上传",
                "value": 8,
                "url": "UploadStorage"
            }, {
                "name": "修改",
                "value": 9,
                "url": "DataListUpdate"
            }, {
                "name": "删除",
                "value": 10,
                "url": "DataListRemove"
            }]
        }, {
            "pageName": "数据对比",
            "weight": 5,
            "pageUrl": "DataCompare",
            "authority": [{
                "name": "数据对比",
                "value": 14,
                "url": "DataCompare"
            }, {
                "name": "良率晶圆",
                "value": 44,
                "url": "WaferMap"
            }, {
                "name": "色阶晶圆",
                "value": 45,
                "url": "ColorMap"
            }, {
                "name": "良品率",
                "value": 46,
                "url": "ShowYield"
            }, {
                "name": "直方图",
                "value": 47,
                "url": "Histogram"
            }, {
                "name": "箱线图",
                "value": 48,
                "url": "Boxplot"
            }, {
                "name": "CPK图",
                "value": 49,
                "url": "CPKServlet"
            }, {
                "name": "相关性",
                "value": 50,
                "url": "Correlation"
            }]
        }, {
            "pageName": "回收站",
            "weight": 3,
            "pageUrl": "RecycleBin",
            "authority": [{
                "name": "回收站",
                "value": 12,
                "url": "RecycleBin"
            }, {
                "name": "删除",
                "value": 20,
                "url": "RecycleBinRemove"
            }, {
                "name": "恢复",
                "value": 21,
                "url": "RecycleBinRecovery"
            }]
        }, {
            "pageName": "详细数据",
            "weight": 2,
            "pageUrl": "WaferData",
            "authority": [{
                "name": "详细数据",
                "value": 11,
                "url": "WaferData"
            }, {
                "name": "导出",
                "value": 22,
                "url": "ExportWafer"
            }, {
                "name": "矢量数据",
                "value": 23,
                "url": "VectorMap"
            }, {
                "name": "参数分布",
                "value": 27,
                "url": "WaferMap"
            }]
        }, {
            "pageName": "工程分析",
            "weight": 4,
            "pageUrl": "ProjectAnalysis",
            "authority": [{
                "name": "工程分析",
                "value": 13,
                "url": "ProjectAnalysis"
            }, {
                "name": "RF-S2P分析",
                "value": 15,
                "url": "Analysis"
            }, {
                "name": "数据分析",
                "value": 16,
                "url": "DataStatistics"
            }]
        }],
        // 以页面为单位的权限对象，包含跳转权限
        futureDT2PageAuthority: [{
            "pageName": "数据列表",
            "weight": 1,
            "pageUrl": "DataList",
            "authority": [{
                "name": "数据列表",
                "value": 7,
                "url": "DataList"
            }, {
                "name": "上传",
                "value": 8,
                "url": "UploadStorage"
            }, {
                "name": "修改",
                "value": 9,
                "url": "DataListUpdate"
            }, {
                "name": "删除",
                "value": 10,
                "url": "DataListRemove"
            }, {
                "name": "回收站",
                "value": 12,
                "url": "RecycleBin"
            }, {
                "name": "详细数据",
                "value": 11,
                "url": "WaferData"
            }, {
                "name": "管理员",
                "value": 17,
                "url": "UserInstall"
            }]
        }, {
            "pageName": "数据对比",
            "weight": 5,
            "pageUrl": "DataCompare",
            "authority": [{
                "name": "数据对比",
                "value": 14,
                "url": "DataCompare"
            }, {
                "name": "良率晶圆",
                "value": 44,
                "url": "WaferMap"
            }, {
                "name": "色阶晶圆",
                "value": 45,
                "url": "ColorMap"
            }, {
                "name": "良品率",
                "value": 46,
                "url": "ShowYield"
            }, {
                "name": "直方图",
                "value": 47,
                "url": "Histogram"
            }, {
                "name": "箱线图",
                "value": 48,
                "url": "Boxplot"
            }, {
                "name": "CPK图",
                "value": 49,
                "url": "CPKServlet"
            }, {
                "name": "管理员",
                "value": 17,
                "url": "UserInstall"
            }, {
                "name": "相关性",
                "value": 50,
                "url": "Correlation"
            }]
        }, {
            "pageName": "回收站",
            "weight": 3,
            "pageUrl": "RecycleBin",
            "authority": [{
                "name": "回收站",
                "value": 12,
                "url": "RecycleBin"
            }, {
                "name": "删除",
                "value": 20,
                "url": "RecycleBinRemove"
            }, {
                "name": "恢复",
                "value": 21,
                "url": "RecycleBinRecovery"
            }, {
                "name": "管理员",
                "value": 17,
                "url": "UserInstall"
            }]
        }, {
            "pageName": "详细数据",
            "weight": 2,
            "pageUrl": "WaferData",
            "authority": [{
                "name": "详细数据",
                "value": 11,
                "url": "WaferData"
            }, {
                "name": "导出",
                "value": 22,
                "url": "ExportWafer"
            }, {
                "name": "矢量数据",
                "value": 23,
                "url": "VectorMap"
            }, {
                "name": "参数分布",
                "value": 27,
                "url": "WaferMap"
            }, {
                "name": "管理员",
                "value": 17,
                "url": "UserInstall"
            }]
        }, {
            "pageName": "工程分析",
            "weight": 4,
            "pageUrl": "ProjectAnalysis",
            "authority": [{
                "name": "工程分析",
                "value": 13,
                "url": "ProjectAnalysis"
            }, {
                "name": "RF-S2P分析",
                "value": 15,
                "url": "Analysis"
            }, {
                "name": "数据分析",
                "value": 16,
                "url": "DataStatistics"
            }, {
                "name": "管理员",
                "value": 17,
                "url": "UserInstall"
            }]
        }]
    };

    // 定义一些api
    
    var eouluGlobal_API = {
    /* 这里定义可以链式调用的，以C_开头 */
        // C_firstFunc: function(str = _DefaultParam.projectName){
        //     var aa = $("<h2>");
        //     aa.append(str);
        //     $("body").empty().append(aa);
        //     return this;//返回当前方法
        // },
        // C_secondFunc: function(){
        //     $("body").append(this.S_ab());
        //     $("body").append($("<h1>223344556677</h1>"));
        //     return this;//返回当前方法
        // },
        C_setProjectName: function(str){
            _DefaultParam.projectName = str;
            return this;
        },
        C_setPageAllConfig: function(obj){
            var classify = obj.classify || "signal",
            value = _.isNil(obj.value) ? null : obj.value,
            path = _.isNil(obj.path) ? "other" : obj.path;
            if(!_.isEqual(classify, "signal")){
                _DefaultParam.pageAllConfig = value;
            }else{
                if(_.isNil(_DefaultParam.pageAllConfig)) _DefaultParam.pageAllConfig = {};
                _.set(_DefaultParam.pageAllConfig, path, value);
            }
            return this;
        },
        C_setCurUserName: function(str){
            _DefaultParam.curUserName = str;
            return this;
        },
        C_setBrowser: function(o){
            _DefaultParam.browser = o;
            return this;
        },
        // 设置判断后的权限对象
        C_setCurPageJudgedAuthority: function(o){
            _DefaultParam.curPageJudgedAuthority = o;
            return this;
        },
        /* @ 系统页面特殊处理类*/
        // 按钮不可点击
        C_btnDisabled: function(JQObj, isChangeText, newText){
            JQObj.css("cursor","not-allowed").prop("disabled","disabled");
            if(isChangeText){
                // var element = document.getElementById("p"); var name = element.tagName;
                // var name = $("#p").get(0).tagName;
                // var name = $("#p")[0].tagName;
                // var name = $("#p").prop("tagName");
                // var name = $("#p").prop("nodeName");
                var iTagName = JQObj.prop("nodeName").toLocaleUpperCase();
                if(iTagName == "INPUT"){
                    JQObj.val(newText);
                }else if(iTagName == "BUTTON" || iTagName == "A"){
                    JQObj.text(newText);
                }
            }
            return this;
        },
        // 按钮可以点击
        C_btnAbled: function(JQObj, isChangeText, newText){
            JQObj.css("cursor","pointer").prop("disabled",false);
            if(isChangeText){
                var iTagName = JQObj.prop("nodeName").toLocaleUpperCase();
                if(iTagName == "INPUT"){
                    JQObj.val(newText);
                }else if(iTagName == "BUTTON" || iTagName == "A"){
                    JQObj.text(newText);
                }
            }
            return this;
        },
        /*表格自适应出现省略号*/
        C_tableEllipsis: function(obj){
            obj.container.find("tbody td").each(function(){
                var inde = $(this).index();
                $(this).css({
                    "max-width": obj.widthArr[inde],
                    "min-width": obj.widthArr[inde],
                    "width": obj.widthArr[inde],
                    "overflow": "hidden",
                    "text-overflow": "ellipsis",
                    "white-space": "nowrap"
                });
            });
            return this;
        },
        /*服务器繁忙提示*/
        C_server500Message: function(obj){
            this.S_getSwalMixin()({
                title: "操作提示",
                text: "服务器繁忙",
                /*html: '',*/
                type: "error",
                showConfirmButton: false,
                timer: obj.timer===null ? null : 1600,
            }).then(function(result){
                if(result.dismiss == swal.DismissReason.backdrop || result.dismiss == swal.DismissReason.esc || result.dismiss == swal.DismissReason.timer){
                    _.isFunction(obj.callback) && obj.callback();
                }
            });
            return this;
        },
        // 页面权限普通处理
        C_pageAuthorityCommonHandler: function(obj){
            var authorityJQDomMap = obj.authorityJQDomMap,
            callback = obj.callback,
            disappear = obj.disappear || "remove",
            getKey = obj.getKey || 'name';
            var userAuthObj = eouluGlobal.S_getCurPageJudgedAuthority(),
            disappearFun;
            disappearFun = disappear == "hide" ? jQuery().hide : disappear == "remove" ? jQuery().remove : jQuery().detach;
            if(!_.isNil(userAuthObj) && !_.isEmpty(userAuthObj)){
                if(userAuthObj.isAll === true){
                    _.forOwn(authorityJQDomMap, function(v, k){
                        var findDOMFlag = _.find(userAuthObj.userAuthority, function(vv, ii){
                            return vv[getKey] == k; 
                        });
                        if(_.isNil(findDOMFlag)){
                            if(_.isArray(v)){
                                _.forEach(v, function(vv, ii){
                                    // vv.hide();
                                    disappearFun.call(vv);
                                });
                            }else{
                                // v.hide();
                                if(!_.isNil(v)) disappearFun.call(v);
                            }
                        }
                    });
                }else if(userAuthObj.isAll === false){
                    _.forOwn(userAuthObj.diff, function(v, k){
                        var name = _.get(_.values(v)[0], getKey);  // 默认是取name，如果页面有重复name，最好全部换个key，如url，字符串类型的最好
                        var hideObj = authorityJQDomMap[name];
                        if(_.isArray(hideObj)){
                            _.forEach(hideObj, function(vv, ii){
                                // vv.hide();
                                disappearFun.call(vv);
                            });
                        }else{
                            // hideObj.hide();
                            if(!_.isNil(hideObj)) disappearFun.call(hideObj);
                        }
                    });
                }
            }else{
                // 返回null
                _.forOwn(authorityJQDomMap, function(v, k){
                    if(_.isArray(v)){
                        _.forEach(v, function(vv, ii){
                            // vv.hide();
                            disappearFun.call(vv);
                        });
                    }else{
                        // v.hide();
                        disappearFun.call(v);
                    }
                });
            }
            callback && _.isFunction(callback) && callback(userAuthObj);
        },
        /* @ 系统页面特殊处理类end*/

    /* 这里定义不可以链式调用的，以S_开头 */
        // 同步或异步动态加载脚本
        // @param  success(response,status) --- response - 包含来自请求的结果数据;status - 包含请求的状态（"success", "notmodified", "error", "timeout" 或 "parsererror"）
        // @param scriptCharset --- 要求为String类型的参数，只有当请求时dataType为"jsonp"或者"script"，并且type是GET时才会用于强制修改字符集(charset)。通常在本地和远程的内容编码不同时使用。这里默认设置'utf-8'
        S_loadScript: function(iurl, async, cache, beforeSend, dataFilter, success, error, complete, scriptCharset){
            var eouluGlobalThis = this;
            iurl = iurl || "";
            if(async === undefined || async === null){
                async = true;
            }else{
                async = async;
            }
            // cache 默认为true（当dataType为script时，默认为false），设置为false将不会从浏览器缓存中加载请求信息
            if(cache === undefined || cache === null){
                cache = false;
            }else{
                cache = cache;
            }
            // 有时候有些项目需要include新闻发布系统某站点数据时，新闻发布系统该站点配置为gb2312编码的站点，此时，页面设置的编码必须为gb2312。但ajax异步获取的utf-8信息需要写入页面，与页面编码不一致，显示为乱码
                // 解决方法：添加ajax参数：scriptCharset:’utf-8’，使返回值以scriptCharset指定编码显示而不是默认以页面编码显示
            // 当异步请求的服务器页面的编码为 gb2312 时，此时不能使用ajax方法获取信息，因为ajax内部是使用unicode 按照utf8编码来处理所有字符的。所以返回的信息就乱码了
                // 解决方法：使用隐藏的iframe加载页面，然后再获取目标数据到相应位置。
                // // html代码：
                // <div class="main">
                //     <div class="com-con"></div>
                // </div>
                // <iframe src="" id="iframe" style="display:none"></iframe>
                // // js代码：
                // var PAGE =(function(){
                //     $iframe = $('#iframe'),
                //     fn = {
                //         init : function(){ /*初始*/
                //             $iframe.attr('src',url);
                //             $iframe.load(function(){                 
                //                 var $data;   
                //                 try{
                //                     $data = $iframe.contents();
                //                 }catch(e){
                //                     return;
                //                 } 
                //                 $('.main .com-con').append($data.find('.com-con').html());
                //             });
                //         },
                //         getMore : function(url){ /*加载更多*/
                //             $iframe.attr('src',url);
                //             $data = $iframe.contents();
                //             $('.main .com-con').append($data.find('.com-con').html());
                //         }

                //     },
                //     init = function() {
                //         fn.init(); 
                //         /*点击获取更多*/
                //         $(".more-btn").bind("click",function(){
                //             /*..此处省略..*/
                //             fn.getMore(url);
                //         });
                //     };
                //     return{
                //          fn: fn,
                //          init: init
                //      }
                // })();

                // nie.define(function(){
                //     PAGE.init();
                // });

            scriptCharset = scriptCharset || "utf-8";
            $.ajax({
                url: iurl,
                async: async,
                cache: cache,
                dataType: "script",
                beforeSend: function(XMLHttpReq){
                    var options = this;   //调用本次ajax请求时传递的options参数
                    if(eouluGlobalThis.S_isFunction(beforeSend)){
                        beforeSend(XMLHttpReq, options);
                    }
                },
                dataFilter: function(data, type){
                    // 给Ajax返回的原始数据进行预处理的函数。它的调用在success之前。提供data和type两个参数：data是Ajax返回的原始数据，type是调用jQuery.ajax时提供的dataType参数。函数返回的值将由jQuery进一步处理。
                        // 当用户的session失效时可使用ajax请求时，可以使用这个函数进行判断是否要重新跳转到登录界面（系统的过滤器发现用户ajax的请求，但用户没有登录或session失效时返回字符串”timeOut"）：
                        // dataFilter: function(data, type){
                        //     console.log("data:"+data);
                        //     if(data == "timeOut" || data == "[object XMLDocument]"){//ajax请求，发现session过期，重新刷新页面，跳转到登录页面
                        //         window.location.reload();
                        //     }else{
                        //         return data;
                        //     }
                        // }

                    // 对Ajax返回的原始数据进行预处理
                    if(eouluGlobalThis.S_isFunction(dataFilter)){
                        var newData = dataFilter(data, type); // 函数需要有返回值
                        return newData; // 返回处理后的数据，处理后的数据将被其它函数使用（如success）
                    }else{
                        console.warn("dataFilter不是一个函数，data未做处理");
                        return data;
                    }
                },
                success: function(data, textStatus){
                    var options = this;   //调用本次ajax请求时传递的options参数
                    if(eouluGlobalThis.S_isFunction(success)){
                        success(data, textStatus, options);
                    }
                },
                error: function(XMLHttpReq, textStatus, errorThrown){
                    //通常情况下textStatus和errorThrown只有其中一个包含信息
                    var options = this;   //调用本次ajax请求时传递的options参数
                    if(eouluGlobalThis.S_isFunction(error)){
                        error(XMLHttpReq, textStatus, errorThrown, options);
                    }
                },
                complete: function(XMLHttpReq, textStatus){
                    var options = this;   //调用本次ajax请求时传递的options参数
                    if(eouluGlobalThis.S_isFunction(complete)){
                        complete(XMLHttpReq, textStatus, errorThrown, options);
                    }
                },
                scriptCharset: scriptCharset
            });
        },

        // @获取默认参数@
        S_getDefaultParam: function(){
            return _DefaultParam;
        },
        S_getEnvironment: function(){
            return _DefaultParam.environment;
        },
        S_getProjectName: function(){
            return _DefaultParam.projectName;
        },
        S_getCurUserName: function(){
            return _DefaultParam.curUserName;
        },
        S_getBrowser: function(){
            return _DefaultParam.browser;
        },
        S_getLoginHref: function(){
            return _DefaultParam.loginHref;
        },
        S_getCurPageJudgedAuthority: function(){
            return _DefaultParam.curPageJudgedAuthority;
        },
        S_getExcludeJudgeAuthorityPage: function(){
            return _DefaultParam.excludeJudgeAuthorityPage;
        },
        S_getBaseUrl: function(){
            return (window.location.href.split(_DefaultParam.projectName)[0]+_DefaultParam.projectName);
        },
        S_getHostName: function(){
            return (window.location.href.split(_DefaultParam.projectName)[0].substring(0,window.location.href.split(_DefaultParam.projectName)[0].length-1));
        },
        S_getCurPageHref: function(){
            var leaveHref = window.location.href.split(_DefaultParam.projectName+"/")[1];
            var curHref;
            var problemIndex = leaveHref.indexOf("?");
            var poundIndex = leaveHref.indexOf("#");
            if(problemIndex == -1 && poundIndex == -1){
                curHref = leaveHref;
            }else if(problemIndex == -1 && poundIndex != -1){
                curHref = leaveHref.split("#")[0];
            }else if(problemIndex != -1 && poundIndex == -1){
                curHref = leaveHref.split("?")[0];
            }else if(problemIndex > poundIndex){
                curHref = leaveHref.split("#")[0];
            }else if(problemIndex < poundIndex){
                curHref = leaveHref.split("?")[0];
            }
            return curHref;
        },
        S_getPageAllConfig: function(){
            return _DefaultParam.pageAllConfig;
        },
        S_getRegExpList: function(classify){
            var returnVar;
            if(_.isNil(classify) || classify == "ALL"){
                returnVar = _DefaultParam.RegExpList;
            }else{
                var ireturnVar = _DefaultParam.RegExpList[classify];
                if(_.isNil(ireturnVar)){
                    returnVar = null;
                }else{
                    returnVar = ireturnVar;
                }
            }
            return returnVar;
        },
        S_getFutureDT2SysAuthority: function(classify){
            return _DefaultParam.futureDT2SysAuthority;
        },
        S_getFutureDT2PageAuthority: function(classify){
            return _DefaultParam.futureDT2PageAuthority;
        },
        S_getAllAuthorityPage: function(classify){
            return _DefaultParam.allAuthorityPage;
        },

        /* @ 系统页面特殊处理类*/
        // 根据页面获取该页面权限对象
        S_getPageAuthorityByPage: function(obj){
            var curAuthorityObj,
            iHref = this.S_getCurPageHref();
            if(_.isNil(obj)){
                curAuthorityObj = _.cloneDeep(_.find(_DefaultParam.futureDT2PageAuthority, function(v, i){
                    return _.isEqual(v.pageUrl, iHref);
                }));
            }else{
                if(_.isNil(obj.page) || _.isEmpty(obj.page)){
                    curAuthorityObj = _.cloneDeep(_.find(_DefaultParam.futureDT2PageAuthority, function(v, i){
                        return _.isEqual(v.pageUrl, iHref);
                    }));
                }else if(_.isEqual(_.toUpper(obj.page), "ALL")){
                    curAuthorityObj = _.cloneDeep(_DefaultParam.futureDT2PageAuthority);
                }else{
                    curAuthorityObj = _.cloneDeep(_.find(_DefaultParam.futureDT2PageAuthority, function(v, i){
                        return _.isEqual(v.pageUrl, obj.page);
                    }));
                }
            }
            return curAuthorityObj;
        },
        // 根据处理好的用户权限对象来返回差异，即不存在的权限
        S_pageReturnAuthorityHandler: function(obj){
            var objec = obj.objec,
            userAuthorityObj = obj.userAuthorityObj,
            getAllAuthorityCallback = obj.getAllAuthorityCallback;
            var returnObj;
            var pageAuthority = this.S_getPageAuthorityByPage(objec);
            if(!_.isNil(pageAuthority)){
                returnObj = {};
                if(_.isArray(pageAuthority)){
                    /*表示获取了全部权限*/
                    getAllAuthorityCallback && _.isFunction(getAllAuthorityCallback) && getAllAuthorityCallback(pageAuthority);
                    returnObj.diff = {};
                    returnObj.isAll = true;
                }else{
                    // S_getObjDifference 大的对象为第一个参数
                    returnObj.diff = this.S_getObjDifference(_.groupBy(pageAuthority.authority, function(v){return v.value;}), _.groupBy(userAuthorityObj, function(vv){return vv.value;}));
                    returnObj.isAll = false;
                }
                returnObj.pageAuthority = pageAuthority;
                returnObj.userAuthority = userAuthorityObj;
            }else{
                returnObj = null;
            }
            return returnObj;
        },
        /* @ 系统页面特殊处理类end*/

        /* @ 文件处理类*/
        // 获取文件大小
        S_getFileSize: function(value){
            if(null==value||value==''){
                return "0 Bytes";
            }
            var unitArr = new Array("Bytes","KB","MB","GB","TB","PB","EB","ZB","YB");
            var index=0,
                srcsize = parseFloat(value);
            index=Math.floor(Math.log(srcsize)/Math.log(1024));
            var size =srcsize/Math.pow(1024,index);
            //  保留的小数位数
            size=size.toFixed(2);
            return size+unitArr[index];
        },
        
        /* @http处理类@ */
        S_createXHR: function(){
            // IE7+,Firefox, Opera, Chrome ,Safari
            if (typeof XMLHttpRequest != "undefined") {
                return new XMLHttpRequest();
            }
            // IE6-
            else if (typeof ActiveXObject != "undefined") {
                if (typeof arguments.callee.activeXString != "string") {
                    var versions = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0", "MSXMLHttp"],
                        i, len;
                    for (i = 0, len = versions.length; i < len; i++) {
                        try {
                            new ActiveXObject(versions[i]);
                            arguments.callee.activeXString = versions[i];
                            break;
                        } catch (ex) {
                            alert("请升级浏览器版本");
                        }
                    }
                }
                return arguments.callee.activeXString;
            } else {
                throw new Error("XHR对象不可用");
            }
        },
        // get请求添加查询参数
        S_urlBuildParam: function(obj){
            var iurl = obj.url;
            iurl += (iurl.indexOf('?') == -1) ? '?' : '&';
            if(obj.isObject === true){
                iurl+=$.param(obj.data);
            }else{
                if(obj.name !== null && obj.name !== undefined) iurl += encodeURIComponent(obj.name) + "=" + encodeURIComponent(obj.value);
            }
            return iurl;
        },
        // 格式化post 传递的数据
        S_postDataFormat: function(obj){
            if (typeof obj.data != "object") {
                console.log("S_postDataFormat输入的参数obj.data必须是对象");
                return;
            }

            // 支持有FormData的浏览器（Firefox 4+ , Safari 5+, Chrome和Android 3+版的Webkit）
            /*if (typeof FormData == "function") {
                var data = new FormData();
                for (var attr in obj) {
                    data.append(attr, obj[attr]);
                }
                return data;
            } else {
                // 不支持FormData的浏览器的处理 
                var arr = new Array();
                var i = 0;
                for (var attr in obj) {
                    arr[i] = encodeURIComponent(attr) + "=" + encodeURIComponent(obj[attr]);
                    i++;
                }
                return arr.join("&");
            }*/
            if (obj.classify == "file") {
                var data = new FormData();
                data.enctype="multipart/form-data";
                for (var attr in obj) {
                    data.append(attr, obj[attr]);
                }
                return data;
            } else if(obj.classify == "form") {
                return $.param(obj.data);
            }else if(obj.classify == "json"){
                return JSON.stringify(obj.data);
            }else{
                // XML
            }
        },
        /*
        * @param obj 对象
        * {
        *     beforeSend [function]
        *     readyState0 [function]
        *     readyState1 [function]
        *     readyState2 [function]
        *     readyState3 [function]
        *     status200 [function]
        *     statusError [function]
        *     readyState4 [function]
        *     type [string]
        *     getObject [object]  {
        *         url [string]
        *         isObject [boolean]
        *         data [object]
        *         responseType [string]
        *                url [string]
        *                name [string]
        *                value [string]
        *                responseType [string]
        *     }
        *     postObject [object]  {
        *         url [string]
        *         data [object]
        *         classify [string]
        *         responseType [string]
        *     }
        * }
         */
        S_XHR: function(obj){
            var xhr = this.S_createXHR();
            this.S_isFunction(obj.beforeSend) && obj.beforeSend(obj, xhr);
            var that = this;
            // 定义xhr对象的请求响应事件
            xhr.onreadystatechange = function() {
                switch (xhr.readyState) {
                    case 0:
                        //alert("请求未初始化");
                        that.S_isFunction(obj.readyState0) && obj.readyState0(xhr.readyState, xhr);
                        break;
                    case 1:
                        //alert("请求启动，尚未发送");
                        that.S_isFunction(obj.readyState1) && obj.readyState1(xhr.readyState, xhr);
                        break;
                    case 2:
                        //alert("请求发送，尚未得到响应");
                        that.S_isFunction(obj.readyState2) && obj.readyState2(xhr.readyState, xhr);
                        break;
                    case 3:
                        //alert("请求开始响应，收到部分数据");
                        that.S_isFunction(obj.readyState3) && obj.readyState3(xhr.readyState, xhr);
                        break;
                    case 4:
                        // alert("请求响应完成得到全部数据");
                        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                            console.log(xhr)
                            var data = xhr.responseText;
                            that.S_isFunction(obj.status200) && obj.status200(data, xhr.status, xhr);
                        } else {
                            // alert("Request was unsuccessful : " + xhr.status + " " + xhr.statusText);
                            that.S_isFunction(obj.statusError) && obj.statusError(xhr, xhr.statusText, xhr.status);
                        }
                        that.S_isFunction(obj.readyState4) && obj.readyState4(xhr.readyState, xhr, xhr.status);
                        break;
                }
            };
            var iurl;
            // get请求
            if(obj.type.toLocaleUpperCase() == "GET"){
                iurl = that.S_urlBuildParam(obj.getObject);
                xhr.open("get", iurl, true);
                xhr.responseType = obj.getObject.responseType || "text";
                xhr.send(null);
            }else if(obj.type.toLocaleUpperCase() == "POST"){
                // post请求
                xhr.open("post", obj.postObject.url, true);
                xhr.responseType = obj.postObject.responseType || "text";
                /*// 不支持FormData的浏览器的处理 
                if (typeof FormData == "undefined") {
                    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                }*/
                var contentType;
                switch (obj.postObject.classify){
                    case "form":
                    contentType = "application/x-www-form-urlencoded";
                    break;
                    case "file":
                    contentType = "multipart/form-data";
                    break;
                    case "json":
                    contentType = "application/json";
                    break;
                    case "XML":
                    contentType = "text/xml"; // jquery text/plain
                    break;
                    default:
                    contentType = "application/x-www-form-urlencoded";
                }
                xhr.setRequestHeader("Content-Type", contentType);
                xhr.send(that.S_postDataFormat({
                    classify: obj.postObject.classify,
                    data: obj.postObject.data
                }));
            }
        },
        // @http处理类@ 结束

        // @URL处理类@
        // 设置URL，并跳转，@param isRead 是否只读，true为不跳转，只返回新url，false为跳转并返回新url
        // @param _blank，true为新页面，false为原页面；
        // @param ireplace，true为替换前一个历史记录，后退无效，false为不替换，可以后退
        // @param NewUrl  新的URL
        S_settingURLParam: function(paramObj, isRead, _blank, ireplace, NewUrl){
            if(this.S_isObject(paramObj)){
                var problemFlag = true;
                if(jQuery.isEmptyObject(paramObj)){
                    console.warn("C_setURLParam参数paramObj为空对象");
                    problemFlag = false;
                }
                var paramStr = $.param(paramObj);
                var iURL = NewUrl || this.S_getCurPageHref();
                var preHref = this.S_getBaseUrl()+"/"+iURL;
                if(problemFlag) preHref+="?";
                var setHref = preHref+paramStr;
                if(!isRead){
                    if(_blank){
                        window.open(setHref);
                    }else{
                        if(!ireplace){
                            window.location.assign(setHref);
                        }else{
                            window.location.replace(setHref);
                        }
                    }
                }
                return setHref;
            }else{
                console.warn("S_settingURLParam参数paramObj不是一个对象");
            }
        },
        //获取url参数
        //getUrlPrmt('segmentfault.com/write?draftId=122000011938')
        //result：Object{draftId: "122000011938"}
        S_getUrlPrmt: function (url) {
            url = url ? url : window.location.href;
            var _pa = url.substring(url.indexOf('?') + 1),
                _arrS = _pa.split('&'),
                _rs = {};
            for (var i = 0, _len = _arrS.length; i < _len; i++) {
                var pos = _arrS[i].indexOf('=');
                if (pos == -1) {
                    continue;
                }
                var name = _arrS[i].substring(0, pos),
                    value = window.decodeURIComponent(_arrS[i].substring(pos + 1));
                _rs[name] = value;
            }
            return _rs;
        },
        // 解析URL
        S_URLParser: function(obj) {
            var iurl = obj.iurl || "",
            classify = obj.classify || "REG";
            var returnUrlObj;
            if(_.isEqual(_.toUpper(classify), "A")){
                var a = document.createElement('a');
                a.href = iurl;
                returnUrlObj = {
                    protocol: a.protocol,
                    username: a.username, // IE
                    password: a.password, // IE
                    hostname: a.hostname, // host 可能包括 port, hostname 不包括
                    port: a.port,
                    pathname: a.pathname,
                    search: a.search,
                    hash: a.hash,
                };
            }else if(_.isEqual(_.toUpper(classify), "REG")){
                var pattern = RegExp("^(?:([^/?#]+))?//(?:([^:]*)(?::?(.*))@)?(?:([^/?#:]*):?([0-9]+)?)?([^?#]*)(\\?(?:[^#]*))?(#(?:.*))?");
                var matches = iurl.match(pattern) || [];
                returnUrlObj = {
                    protocol: matches[1],
                    username: matches[2],
                    password: matches[3],
                    hostname: matches[4],
                    port: matches[5],
                    pathname: matches[6],
                    search: matches[7],
                    hash: matches[8]
                };
            }
            return returnUrlObj;
        },
        
        S_getLastStr: function(str, num){
            if(this.S_isString(str)){
                num = num || 1;
                if(str.length<num){
                    return str;
                }else{
                    return str.substring(str.length-num, str.length);
                }
            }else{
                console.warn("S_getLastStr参数Str不是字符串");
            }
        },

        // @数据处理类@
        // 判断变量是否是函数
        S_isFunction: function(obj){
            return Object.prototype.toString.call(obj) === '[object Function]';
        },
        // 判断变量是否是对象
        S_isObject: function(o){
            return Object.prototype.toString.call(o) === '[object Object]';
        },
        // 判断对象是否是字符串
        S_isString: function(obj){ 
            return Object.prototype.toString.call(obj) === "[object String]";  
        },
        // 判断对象是否是整数
        S_isInteger: function(obj) {
            return (obj | 0) === obj;
        },

        /*源数据：
        [{
            "name": "数据列表",
            "value": 7,
            "url": "DataList"
        }, {
            "name": "上传",
            "value": 8,
            "url": "UploadStorage"
        }]
        返回数据：
        {name: Array(2), value: Array(2), url: Array(2)}
        name: (2) ["数据列表", "上传"]
        url: (2) ["DataList", "UploadStorage"]
        value: (2) [7, 8]
        __proto__: Object*/
        S_groupItemVByItemK: function(obj){
            var objec = obj.objec;
            var returnV;
            if(_.isArray(objec)){
                returnV = _.reduce(objec, function(result, v, i, arr) {
                    _.forEach(_.keys(v), function(vv, ii) {
                        result[vv] = result[vv] || [];
                        result[vv].push(v[vv]);
                        // (result[value] || (result[value] = [])).push(key);
                    });
                    return result;
                }, {});
            }else{
                console.warn("S_groupItemVByItemK参数属性objec不是数组");
                returnV = null;
            }
            return returnV;
        },

        // 阿拉伯数字转汉字
        S_numToChineseSm: function(section){
            if(!this.S_isInteger(section)){
                console.warn("S_numToChineseSm函数的参数不是整数");
                return null;
            }
            var chnNumChar = ["零","一","二","三","四","五","六","七","八","九"];
            var chnUnitSection = ["","万","亿","万亿","亿亿"];
            var chnUnitChar = ["","十","百","千"];
            var strIns = '', chnStr = '';
            var unitPos = 0;
            var zero = true;
            while(section == 0) return "零";
            while(section > 0){
                var v = section % 10;
                if(v === 0){
                    if(!zero){
                        zero = true;
                        chnStr = chnNumChar[v] + chnStr;
                    }
                }else{
                    zero = false;
                    strIns = chnNumChar[v];
                    strIns += chnUnitChar[unitPos];
                    chnStr = strIns + chnStr;
                }
                unitPos++;
                section = Math.floor(section / 10);
            }
            return chnStr;
        },
        /**
         * Deep diff between two object, using lodash
         * @param  {Object} object Object compared
         * @param  {Object} base   Object to compare with
         * @return {Object}        Return a new object who represent the diff
         */
        S_getObjDifference: function(object, base) {
            function changes(object, base) {
                return _.transform(object, function(result, value, key) {
                    if (!_.isEqual(value, base[key])) {
                        result[key] = (_.isObject(value) && _.isObject(base[key])) ? changes(value, base[key]) : value;
                    }
                });
            }
            return changes(object, base);
        },

        // @数学
        S_factorial: function (num) { 
            if (num < 0) { 
                return -1; 
            } else if (num === 0 || num === 1) { 
                return 1; 
            } else { 
                return (num * this.S_factorial(num - 1)); 
            } 
        },
        // 普通数字和科学计数法保留精度
        // @param isToPrecision [boolean] 是否用保留有效数字的方法 
        S_ComSCMRound: function (num, precision, isToPrecision){
            if(!_.isNumber(num) || !_.isNumber(precision)) {
                console.warn("S_ComSCMRound参数不是数字");
                return null;
            }
            var returnN,
            strnum = _.toString(num);
            if(strnum.indexOf("e")>-1){
                returnN = _.toNumber(_.toString(_.round(strnum.match(/^\-?\d+\.?\d*/)[0], precision)) +"e"+ strnum.match(/e([\+\-]?\d+)/)[1]);
            }else{
                if(isToPrecision === true){
                    returnN = _.toNumber(num.toPrecision(precision));
                }else{
                    returnN = _.round(num, precision);
                }
            }
            return returnN;
        },
        //  将传入数据转换为字符串,并清除字符串中非数字与.的字符，按数字格式补全字符串
        //  @ obj.num 如果全是非数字非.，则输出0.00[zeroTime]
        S_complateFloatStr: function(obj) {
            var num = obj.num,
            zeroTime = obj.zeroTime || 2;
            if(_.isNumber(num) || _.isString(num)){
                num += '';
                var zeroStr = '';
                _.times(zeroTime, function(){
                    zeroStr+='0';
                });
                num = num.replace(/[^0-9|\.]/g, ''); //清除字符串中的非数字非.字符
                if (/^0+/) //清除字符串开头的0
                    num = num.replace(/^0+/, '');
                if (!/\./.test(num)) //为整数字符串在末尾添加.00
                    num += '.'+zeroStr;
                if (/^\./.test(num)) //字符以.开头时,在开头添加0
                    num = '0' + num;
                num += zeroStr; //在字符串末尾补零
                var numMatch = num.match(new RegExp("\\d\+\\.\\d\{"+zeroTime+"\}"));
                if(_.isNil(numMatch)){
                    console.warn("S_complateFloatStr num正则匹配异常");
                    return null;
                }else{
                    num = numMatch[0];
                    return num;
                }
                // num = num.match(/\d+\.\d{2}/)[0];
            }else{
                console.warn("S_complateFloatStr参数属性num类型错误");
                return null;
            }
        },

        // @DOM
        S_getCaretPosition: function(dom){
            var CaretPos = 0;
            if (document.selection){
                dom.focus ();
                var Sel = document.selection.createRange ();
                Sel.moveStart ('character', -dom.value.length);
                CaretPos = Sel.text.length;
            }else if (dom.selectionStart || dom.selectionStart == '0')
                CaretPos = dom.selectionStart;
            return (CaretPos);
        },
        S_setCaretPosition: function(dom, pos){
            if(dom.setSelectionRange){
                dom.focus();
                dom.setSelectionRange(pos,pos);
            }else if (dom.createTextRange){
                var range = dom.createTextRange();
                range.collapse(true);
                range.moveEnd('character', pos);
                range.moveStart('character', pos);
                range.select();
            }
        },
        // 获取事件的坐标
        S_getEventPosition: function(e){
            var x, y;
            if (this.S_getBrowserType()[0] == "Firefox") {
                x = e.originalEvent.layerX;
                y = e.originalEvent.layerY;
            } else { 
                x = e.offsetX;
                y = e.offsetY;
            }
            return {x: x, y: y};
        },

        // @浏览器
        S_getBrowserType: function(){
            var Sys = {};
            var ua = navigator.userAgent.toLowerCase();
            var s;
            (s = ua.match(/edge\/([\d.]+)/)) ? Sys.edge = s[1] :
            (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
            (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
            (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
            (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
            (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 
            (s = ua.match(/rv\:?([\d.]+)/)) ? Sys.ie11 = s[1] : 0;
            var returnArr = [];
            if (Sys.edge){
                returnArr[0] = "Edge";
                returnArr[1] = Sys.edge;
            }else if (Sys.ie){
                returnArr[0] = "IE";
                returnArr[1] = Sys.ie;
            }else if (Sys.firefox){
                returnArr[0] = "Firefox";
                returnArr[1] = Sys.firefox;
            }else if (Sys.chrome){
                returnArr[0] = "Chrome";
                returnArr[1] = Sys.chrome;
            }else if (Sys.opera){
                returnArr[0] = "Opera";
                returnArr[1] = Sys.opera;
            }else if (Sys.safari){
                returnArr[0] = "Safari";
                returnArr[1] = Sys.safari;
            }else if (Sys.ie11){
                returnArr[0] = "IE11";
                returnArr[1] = Sys.ie11;
            }else{
                returnArr[0] = "other";
                returnArr[1] = "0";
            }
            return returnArr;
        },

        // @操作系统
        S_getOSInfo: function() {
            var _pf = navigator.platform;
            var appVer = navigator.userAgent;
            var _bit;
            if (_pf == "Win32" || _pf == "Windows") {
                if (appVer.indexOf("WOW64") > -1 || appVer.indexOf("Win64") > -1) {
                    _bit = "64位";
                } else {
                    _bit = "32位";
                }
                /*Windows_vista 判断*/
                if (appVer.indexOf("Windows NT 6.0") > -1 || appVer.indexOf("Windows Vista") > -1) {
                    if (_bit == '64位' || appVer.indexOf("Windows Vista") > -1) {
                        return 'Windows_vista ' + _bit;
                    } else {
                        return "Unknow_Windows_vista";
                    }
                }
                /*Windows_7 判断*/
                else if (appVer.indexOf("Windows NT 6.1") > -1 || appVer.indexOf("Windows 7") > -1) {
                    return 'Windows_7 ' + _bit;
                }
                /*Windows_8 判断*/
                else if (appVer.indexOf("Windows NT 6.2") > -1 || appVer.indexOf("Windows 8") > -1) {
                    return 'Windows_8 ' + _bit;
                }
                /*Windows_8.1 判断*/
                else if (appVer.indexOf("Windows NT 6.3") > -1 || appVer.indexOf("Windows 8.1") > -1) {
                    return 'Windows_8.1 ' + _bit;
                }
                /*Windows_10 判断*/
                else if (appVer.indexOf("Windows NT 10") > -1 || appVer.indexOf("Windows NT 10.0") > -1) {
                    return 'Windows_10 ' + _bit;
                }
                else {
                    try {
                        var _winName = Array('2000', 'XP', '2003');
                        var _ntNum = appVer.match(/Windows NT 5.\d/i).toString();
                        return 'Windows_' + _winName[_ntNum.replace(/Windows NT 5.(\d)/i, "$1")] + " " + _bit;
                    } catch (e) {
                        return 'Unknow_Windows';
                    }
                }
            } else if (_pf == "Mac68K" || _pf == "MacPPC" || _pf == "Macintosh") {
                return "Mac";
            } else if (_pf == "X11") {
                return "Unix";
            } else if (String(_pf).indexOf("Linux") > -1) {
                return "Linux";
            } else {
                return "Unknow_";
            }
        },
        /*S_getOSInfo end*/

        // @第三方库额外配置
        S_getSwalMixin: function(){
            return swal.mixin({
                confirmButtonClass: 'btn btn-success',
                cancelButtonClass: 'btn btn-danger',
                buttonsStyling: true,
                animation: false,
                customClass: 'animated zoomIn'
            });
        }
    };

    // 最后将插件对象暴露给全局对象
    // 则最后闭包的实参不必传 jQuery, window, document
    _global = (function(){ return this || (0, eval)('this'); }());
    if (typeof module !== "undefined" && module.exports) {
        module.exports = eouluGlobal_API;
    } else if (typeof define === "function" && define.amd) {
        define(function(){return eouluGlobal_API;});
    } else {
        !('eouluGlobal' in _global) && (_global.eouluGlobal = eouluGlobal_API);
    }

    //这里确定了插件的名称
    // this.eouluGlobal = eouluGlobal_API;
})();