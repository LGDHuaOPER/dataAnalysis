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
        /*数据列表*/
        dataList: [
            {
                "wafer_id": {
                    "exegesis": "主键",
                    "value": "",
                    "detail": null
                },
                "wafer_number": {
                    "exegesis": "晶圆编号",
                    "value": "wafer",
                    "detail": null
                },
                "die_type": {
                    "exegesis": "器件类型",
                    "value": "DefaultType",
                    "detail": null
                },
                "device_number": {
                    "exegesis": "设备/产品类型",
                    "value": "device",
                    "detail": null
                },
                "lot_number": {
                    "exegesis": "批次编号",
                    "value": "",
                    "detail": null
                },
                "product_category": {
                    "exegesis": "产品类别",
                    "value": "",
                    "detail": "product_category"
                },
                "wafer_file_name": {
                    "exegesis": "晶圆文件名",
                    "value": "file",
                    "detail": null
                },
                "qualified_rate": {
                    "exegesis": "良率",
                    "value": ".00",
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
                    "value": "operator",
                    "detail": null
                },
                "archive_user": {
                    "exegesis": "上传者",
                    "value": "archive_user",
                    "detail": null
                },
                "description": {
                    "exegesis": "描述",
                    "value": "description",
                    "detail": null
                },
                "delete_status": {
                    "exegesis": "删除状态,1表示在回收站中",
                    "value": "1",
                    "detail": "delete_status"
                },
                "total_test_quantity": {
                    "exegesis": "测试总数",
                    "value": "",
                    "detail": null
                },
                "data_format": {
                    "exegesis": "数据格式",
                    "value": "1",
                    "detail": "0：EOULU标准数据；1：博达微数据；2：新Excel格式；3：TXT数据格式"
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
        ],
        /*管理员 用户管理*/
        admin_staff: {
            "Admin": {
                "user_id": {
                    "exegesis": "主键",
                    "value": "1",
                    "detail": null
                },
                "user_name": {
                    "exegesis": "用户名",
                    "value": "Admin",
                    "detail": null
                },
                "password": {
                    "exegesis": "密码",
                    "value": "admin",
                    "detail": null
                },
                "sex": {
                    "exegesis": "性别",
                    "value": "男",
                    "detail": null
                },
                "telephone": {
                    "exegesis": "联系电话",
                    "value": "15468524598",
                    "detail": null
                },
                "email": {
                    "exegesis": "电子邮箱",
                    "value": "remind@eoulu.com",
                    "detail": null
                },
                "role_id": {
                    "exegesis": "角色",
                    "value": "3",
                    "detail": "1：成员；2：管理员；3：超级管理员"
                },
                "authority": {
                    "exegesis": "权限",
                    "value": [1,2,3,4,5,6,7,8,9],
                    "detail": "authority"
                },
                "last_login": {
                    "exegesis": "上次登录时间",
                    "value": "2018-10-11 10:25:00",
                    "detail": "time"
                },
                "gmt_create": {
                    "exegesis": "生成时间",
                    "value": "2018-10-11 10:25:00",
                    "detail": "time"
                },
                "current_login": {
                    "exegesis": "当前登录时间",
                    "value": "2018-10-11 10:25:00",
                    "detail": "time"
                }
            },

            "test": {
                "user_id": {
                    "exegesis": "主键",
                    "value": "2",
                    "detail": null
                },
                "user_name": {
                    "exegesis": "用户名",
                    "value": "test",
                    "detail": null
                },
                "password": {
                    "exegesis": "密码",
                    "value": "test123456",
                    "detail": null
                },
                "sex": {
                    "exegesis": "性别",
                    "value": "男",
                    "detail": null
                },
                "telephone": {
                    "exegesis": "联系电话",
                    "value": "15468524598",
                    "detail": null
                },
                "email": {
                    "exegesis": "电子邮箱",
                    "value": "test@eoulu.com",
                    "detail": null
                },
                "role_id": {
                    "exegesis": "角色",
                    "value": "2",
                    "detail": "1：角色；2：管理员；3：超级管理员"
                },
                "authority": {
                    "exegesis": "权限",
                    "value": [1,2,3,4,5,6],
                    "detail": "authority"
                },
                "last_login": {
                    "exegesis": "上次登录时间",
                    "value": "2018-10-11 10:25:00",
                    "detail": "time"
                },
                "gmt_create": {
                    "exegesis": "生成时间",
                    "value": "2018-10-11 10:25:00",
                    "detail": "time"
                },
                "current_login": {
                    "exegesis": "当前登录时间",
                    "value": "2018-10-11 10:25:00",
                    "detail": "time"
                }
            },

            "user": {
                "user_id": {
                    "exegesis": "主键",
                    "value": "3",
                    "detail": null
                },
                "user_name": {
                    "exegesis": "用户名",
                    "value": "user",
                    "detail": null
                },
                "password": {
                    "exegesis": "密码",
                    "value": "user123456",
                    "detail": null
                },
                "sex": {
                    "exegesis": "性别",
                    "value": "男",
                    "detail": null
                },
                "telephone": {
                    "exegesis": "联系电话",
                    "value": "15468524598",
                    "detail": null
                },
                "email": {
                    "exegesis": "电子邮箱",
                    "value": "user@eoulu.com",
                    "detail": null
                },
                "role_id": {
                    "exegesis": "角色",
                    "value": "1",
                    "detail": "1：角色；2：管理员；3：超级管理员"
                },
                "authority": {
                    "exegesis": "权限",
                    "value": [4,5,6],
                    "detail": "authority"
                },
                "last_login": {
                    "exegesis": "上次登录时间",
                    "value": "2018-10-11 10:25:00",
                    "detail": "time"
                },
                "gmt_create": {
                    "exegesis": "生成时间",
                    "value": "2018-10-11 10:25:00",
                    "detail": "time"
                },
                "current_login": {
                    "exegesis": "当前登录时间",
                    "value": "2018-10-11 10:25:00",
                    "detail": "time"
                }
            }
        },
        /*管理员 操作日志*/
        admin_operation: [
            {
                "log_id": {
                    "exegesis": "主键",
                    "value": "",
                    "detail": null
                },
                "user_name": {
                    "exegesis": "操作账户",
                    "value": "",
                    "detail": "user_name"
                },
                "page": {
                    "exegesis": "操作页面",
                    "value": "",
                    "detail": "page"
                },
                "description": {
                    "exegesis": "操作记录",
                    "value": "",
                    "detail": "description"
                },
                "gmt_create": {
                    "exegesis": "操作时间",
                    "value": "2018-10-01 12:12:12",
                    "detail": "time"
                },
                "ip_address": {
                    "exegesis": "IP地址",
                    "value": "",
                    "detail": "ip_address"
                },
                "location": {
                    "exegesis": "地理位置",
                    "value": "",
                    "detail": "location"
                }
            }
        ],
        /*权限表*/
        admin_authorityMap: {
            "管理员": [
                {
                    "authority_name": "管理员页面",
                    "authority_url": "admin.html",
                    "authority_id": "1"
                },
                {
                    "authority_name": "操作用户",
                    "authority_url": null,
                    "authority_id": "2"
                },
                {
                    "authority_name": "授权",
                    "authority_url": null,
                    "authority_id": "3"
                }
            ],
            "数据列表": [
                {
                    "authority_name": "数据列表-读",
                    "authority_url": "dataList.html",
                    "authority_id": "4"
                },
                {
                    "authority_name": "数据列表-写",
                    "authority_url": "dataList.html",
                    "authority_id": "5"
                }
            ],
            "工程分析": [
                {
                    "authority_name": "工程分析-读",
                    "authority_url": "ProjectAnalysis.html",
                    "authority_id": "6"
                },
                {
                    "authority_name": "工程分析-写",
                    "authority_url": "ProjectAnalysis.html",
                    "authority_id": "7"
                },
            ],
            "数据统计": [
                {
                    "authority_name": "数据统计-读",
                    "authority_url": "DataStatistics.html",
                    "authority_id": "8"
                },
                {
                    "authority_name": "数据统计-写",
                    "authority_url": "DataStatistics.html",
                    "authority_id": "9"
                }
            ]
        }
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

        S_getAdmin_staff: function(){
            return _DefaultParam.admin_staff;
        },

        S_getAdmin_operation: function(){
            return _DefaultParam.admin_operation;
        },

        S_getAdmin_authorityMap: function(){
            return _DefaultParam.admin_authorityMap;
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