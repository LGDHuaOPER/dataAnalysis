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
        projectName: "futureDT2",
        versionNO: "1536897675562",
        pageAllConfig: {
            "futureDT2": {
                canUseAjax: false
            }
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
        }
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
            return this; //返回当前方法，即 eouluGlobal对象
        },
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
                beforeSend: function(XMLHttpRequest){
                    var options = this;   //调用本次ajax请求时传递的options参数
                    if(eouluGlobalThis.S_isFunction(beforeSend)){
                        beforeSend(XMLHttpRequest, options);
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
                error: function(XMLHttpRequest, textStatus, errorThrown){
                    //通常情况下textStatus和errorThrown只有其中一个包含信息
                    var options = this;   //调用本次ajax请求时传递的options参数
                    if(eouluGlobalThis.S_isFunction(error)){
                        error(XMLHttpRequest, textStatus, errorThrown, options);
                    }
                },
                complete: function(XMLHttpRequest, textStatus){
                    var options = this;   //调用本次ajax请求时传递的options参数
                    if(eouluGlobalThis.S_isFunction(complete)){
                        complete(XMLHttpRequest, textStatus, errorThrown, options);
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
        S_getBaseUrl: function(){
            return (window.location.href.split(_DefaultParam.projectName)[0]+_DefaultParam.projectName);
        },
        S_getHostName: function(){
            return (window.location.href.split(_DefaultParam.projectName)[0].substring(0,window.location.href.split(_DefaultParam.projectName)[0].length-1));
        },
        S_getCurPageHref: function(){
            var leaveHref = window.location.href.split(_DefaultParam.projectName+"/")[1];
            var curHref;
            if(leaveHref.indexOf("?")>-1){
                curHref = leaveHref.split("?")[0];
            }else{
                curHref = leaveHref;
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
        
        // @URL处理类@
        // 设置URL，并跳转，@param isRead 是否只读，true为不跳转，只返回新url，false为跳转并返回新url
        // @param _blank，true为新页面，false为原页面；
        // @param ireplace，true为替换前一个历史记录，后退无效，false为不替换，可以后退
        S_settingURLParam: function(paramObj, isRead, _blank, ireplace){
            if(this.S_isObject(paramObj)){
                if(jQuery.isEmptyObject(paramObj)){
                    console.warn("C_setURLParam参数paramObj为空对象");
                    return false;
                }
                var paramStr = $.param(paramObj);
                var preHref = this.S_getBaseUrl()+"/"+this.S_getCurPageHref()+"?";
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