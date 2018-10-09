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
        dataList: [
            {
                "wafer_id": {
                    "exegesis": "主键",
                    "value": "1",
                    "detail": null
                },
                "wafer_number": {
                    "exegesis": "晶圆编号",
                    "value": "wafer1",
                    "detail": null
                },
                "die_type": {
                    "exegesis": "器件类型",
                    "value": "DefaultType",
                    "detail": null
                },
                "device_number": {
                    "exegesis": "设备/产品类型",
                    "value": "device1",
                    "detail": null
                },
                "lot_number": {
                    "exegesis": "批次编号",
                    "value": "1",
                    "detail": null
                },
                "product_category": {
                    "exegesis": "产品类别",
                    "value": "1",
                    "detail": "product_category"
                },
                "wafer_file_name": {
                    "exegesis": "晶圆文件名",
                    "value": "file1",
                    "detail": null
                },
                "qualified_rate": {
                    "exegesis": "良率",
                    "value": "1.00",
                    "detail": null
                },
                "test_start_date": {
                    "exegesis": "测试起始时间",
                    "value": "2018-10-01 12:12:12",
                    "detail": "time"
                },
                "test_end_date": {
                    "exegesis": "测试截止时间",
                    "value": "2018-10-01 12:12:12",
                    "detail": "time"
                },
                "test_operator": {
                    "exegesis": "测试员",
                    "value": "operator1",
                    "detail": null
                },
                "archive_user": {
                    "exegesis": "上传者",
                    "value": "archive_user1",
                    "detail": null
                },
                "description": {
                    "exegesis": "描述",
                    "value": "description1",
                    "detail": null
                },
                "delete_status": {
                    "exegesis": "删除状态,1表示在回收站中",
                    "value": "1",
                    "detail": "delete_status"
                },
                "total_test_quantity": {
                    "exegesis": "测试总数",
                    "value": "1",
                    "detail": null
                },
                "data_format": {
                    "exegesis": "数据格式",
                    "value": "1",
                    "detail": "1：EOULU标准数据；2：博达微数据；3：Excel格式；4：TXT数据格式"
                },
                "gmt_create": {
                    "exegesis": "生成时间",
                    "value": "2018-10-01 12:12:12",
                    "detail": "time"
                },
                "gmt_modified": {
                    "exegesis": "修改时间",
                    "value": "2018-10-01 12:12:12",
                    "detail": "time"
                }
            }
        ]
    };

    // 定义一些api
    
    var futuredGlobal_API = {
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
        

    /* 这里定义不可以链式调用的，以S_开头 */
        // @获取默认参数@
        S_getDefaultParam: function(){
            return _DefaultParam;
        },

        S_getDataList: function(){
            return _DefaultParam.dataList;
        },

        // @数据处理类@
        // 判断变量是否是函数
        S_isFunction: function(obj){
            return Object.prototype.toString.call(obj) === '[object Function]';
        },
        // 判断变量是否是对象
        S_isObject: function(o){
            return Object.prototype.toString.call(o) === '[object Object]';
        }
        
    };

    // 最后将插件对象暴露给全局对象
    // 则最后闭包的实参不必传 jQuery, window, document
    _global = (function(){ return this || (0, eval)('this'); }());
    if (typeof module !== "undefined" && module.exports) {
        module.exports = futuredGlobal_API;
    } else if (typeof define === "function" && define.amd) {
        define(function(){return futuredGlobal_API;});
    } else {
        !('futuredGlobal' in _global) && (_global.futuredGlobal = futuredGlobal_API);
    }

    //这里确定了插件的名称
    // this.futuredGlobal = futuredGlobal_API;
})();